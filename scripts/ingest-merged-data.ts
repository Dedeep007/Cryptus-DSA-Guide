/**
 * Ingest Merged Topics Data
 * 
 * This script:
 * 1. Clears all existing curriculum data from the database
 * 2. Ingests data from mergerd-info.json with the new schema structure
 * 
 * Run with: npx tsx scripts/ingest-merged-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    process.exit(1);
}

const pool = new Pool({ connectionString });
const db = drizzle(pool);

// Path to merged JSON
const MERGED_JSON_PATH = path.join(__dirname, '../json_store/topic-jsons/mergerd-info.json');

interface TestCase {
    input: string;
    output: string;
}

interface Solution {
    language: string;
    code: string;
}

interface CodeExample {
    language: string;
    code: string;
    explanation?: string;
}

interface Problem {
    title: string;
    description: string;
    difficulty: string;
    testCases: TestCase[];
    solutions: Solution[];
    conceptExplanation: string;
    submissionFormat: string;
}

interface TopicData {
    topic: {
        slug: string;
        title: string;
        description: string;
    };
    codeExamples?: CodeExample[];
    problems: Problem[];
}

async function clearDatabase() {
    console.log('🗑️  Clearing existing data...');

    try {
        // Drop tables if they exist (in order of dependencies)
        await db.execute(sql`DROP TABLE IF EXISTS doubt_responses CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS doubts CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS submissions CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS solutions CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS code_snippets CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS topic_examples CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS problems CASCADE`);
        await db.execute(sql`DROP TABLE IF EXISTS topics CASCADE`);

        console.log('✅ Old tables dropped');

        // Create new tables with the updated schema
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS topics (
                id SERIAL PRIMARY KEY,
                slug TEXT NOT NULL UNIQUE,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS topic_examples (
                id SERIAL PRIMARY KEY,
                topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                language TEXT NOT NULL,
                code TEXT NOT NULL,
                explanation TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS problems (
                id SERIAL PRIMARY KEY,
                topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                difficulty TEXT NOT NULL,
                test_cases TEXT NOT NULL,
                concept_explanation TEXT NOT NULL,
                submission_format TEXT NOT NULL,
                "order" INTEGER NOT NULL DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS solutions (
                id SERIAL PRIMARY KEY,
                problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
                language TEXT NOT NULL,
                code TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS submissions (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
                language TEXT NOT NULL,
                code TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS doubts (
                id SERIAL PRIMARY KEY,
                user_id TEXT NOT NULL,
                problem_id INTEGER REFERENCES problems(id) ON DELETE SET NULL,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                code TEXT,
                status TEXT DEFAULT 'open',
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);

        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS doubt_responses (
                id SERIAL PRIMARY KEY,
                doubt_id INTEGER NOT NULL REFERENCES doubts(id) ON DELETE CASCADE,
                user_id TEXT NOT NULL,
                response TEXT NOT NULL,
                is_mentor BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);

        console.log('✅ New tables created');
    } catch (error) {
        console.error('Error clearing database:', error);
        throw error;
    }
}

async function ingestData() {
    console.log('📥 Loading merged JSON...');
    const mergedData: Record<string, TopicData> = JSON.parse(fs.readFileSync(MERGED_JSON_PATH, 'utf-8'));

    const topicSlugs = Object.keys(mergedData);
    console.log(`Found ${topicSlugs.length} topics`);

    let topicOrder = 0;
    let totalProblems = 0;
    let totalSolutions = 0;
    let totalExamples = 0;

    for (const slug of topicSlugs) {
        const topicData = mergedData[slug];
        const topicInfo = topicData.topic;

        console.log(`\n📂 Processing: ${topicInfo.title}`);

        // Insert topic
        const topicResult = await db.execute(sql`
            INSERT INTO topics (slug, title, description, "order")
            VALUES (${topicInfo.slug}, ${topicInfo.title}, ${topicInfo.description}, ${topicOrder})
            RETURNING id
        `);
        const topicId = (topicResult.rows[0] as any).id;
        topicOrder++;

        // Insert code examples
        if (topicData.codeExamples && topicData.codeExamples.length > 0) {
            for (const example of topicData.codeExamples) {
                await db.execute(sql`
                    INSERT INTO topic_examples (topic_id, language, code, explanation)
                    VALUES (${topicId}, ${example.language}, ${example.code}, ${example.explanation || ''})
                `);
                totalExamples++;
            }
            console.log(`  📝 Added ${topicData.codeExamples.length} code examples`);
        }

        // Insert problems
        let problemOrder = 0;
        for (const problem of topicData.problems) {
            try {
                // Ensure all fields have values
                const conceptExpl = problem.conceptExplanation || '';
                const submFormat = problem.submissionFormat || '';
                const testCasesJson = JSON.stringify(problem.testCases || []);

                // Insert problem
                const problemResult = await db.execute(sql`
                    INSERT INTO problems (topic_id, title, description, difficulty, test_cases, concept_explanation, submission_format, "order")
                    VALUES (
                        ${topicId},
                        ${problem.title},
                        ${problem.description},
                        ${problem.difficulty.toLowerCase()},
                        ${testCasesJson},
                        ${conceptExpl},
                        ${submFormat},
                        ${problemOrder}
                    )
                    RETURNING id
                `);
                const problemId = (problemResult.rows[0] as any).id;
                problemOrder++;
                totalProblems++;

                // Insert solutions
                if (problem.solutions) {
                    for (const solution of problem.solutions) {
                        try {
                            await db.execute(sql`
                                INSERT INTO solutions (problem_id, language, code)
                                VALUES (${problemId}, ${solution.language}, ${solution.code})
                            `);
                            totalSolutions++;
                        } catch (solErr) {
                            console.error(`    ⚠️ Error inserting solution for ${problem.title} (${solution.language})`);
                        }
                    }
                }
            } catch (probErr) {
                console.error(`  ⚠️ Error inserting problem "${problem.title}": ${(probErr as any).message?.slice(0, 100)}`);
            }
        }

        console.log(`  ✅ Added ${topicData.problems.length} problems`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 INGESTION SUMMARY');
    console.log('='.repeat(50));
    console.log(`Topics: ${topicSlugs.length}`);
    console.log(`Code Examples: ${totalExamples}`);
    console.log(`Problems: ${totalProblems}`);
    console.log(`Solutions: ${totalSolutions}`);
    console.log('='.repeat(50));
}

async function main() {
    try {
        console.log('🚀 Starting database reset and ingestion...\n');

        await clearDatabase();
        await ingestData();

        console.log('\n✅ Database reset and ingestion completed successfully!');

        // Close the pool
        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
}

main();
