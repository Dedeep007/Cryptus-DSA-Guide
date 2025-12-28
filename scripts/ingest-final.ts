
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '../shared/schema';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, { schema });

async function clearDatabase() {
    console.log('Clearing existing data...');
    // Delete in reverse order of dependencies
    await db.delete(schema.submissions);
    await db.delete(schema.codeSnippets);
    await db.delete(schema.topicExamples);
    await db.delete(schema.problems);
    await db.delete(schema.topics);
    console.log('Database cleared.');
}

function normalizeDifficulty(d: string): string {
    if (!d) return 'Easy';
    const low = d.toLowerCase();
    if (low === 'easy' || low === 'learning') return 'Easy';
    if (low === 'medium') return 'Medium';
    if (low === 'hard') return 'Hard';
    return d.charAt(0).toUpperCase() + d.slice(1);
}

async function ingest() {
    try {
        const jsonPath = path.join(process.cwd(), 'curriculum-data.json');
        const rawData = fs.readFileSync(jsonPath, 'utf8');
        const topicsData = JSON.parse(rawData);

        console.log(`Ingesting ${topicsData.length} topics...`);

        for (let i = 0; i < topicsData.length; i++) {
            const tData = topicsData[i];
            const topicInfo = tData.topic;

            const [topic] = await db.insert(schema.topics).values({
                slug: topicInfo.slug,
                title: topicInfo.title,
                description: topicInfo.description || topicInfo.title,
                order: i + 1,
            }).returning();

            console.log(`Topic: ${topic.title} (${topic.slug})`);

            // Code Examples
            const codeExamples = tData.codeExamples || topicInfo.codeExamples;
            if (Array.isArray(codeExamples)) {
                for (const ce of codeExamples) {
                    await db.insert(schema.topicExamples).values({
                        topicSlug: topic.slug,
                        language: ce.language,
                        code: ce.code,
                        explanation: ce.explanation || 'Example code'
                    });
                }
            }

            // Collect all problems from all potential arrays
            const allProblems: any[] = [];
            const arrayKeys = ['problems', 'easy', 'medium', 'hard', 'learning'];
            arrayKeys.forEach(key => {
                if (Array.isArray(tData[key])) {
                    allProblems.push(...tData[key]);
                }
            });

            console.log(`  Found ${allProblems.length} problems`);

            for (let j = 0; j < allProblems.length; j++) {
                const pData = allProblems[j];

                // Standardize test cases
                const rawTestCases = pData.testCases || [];
                const standardTestCases = rawTestCases.map((tc: any) => ({
                    input: tc.input || "",
                    output: tc.output || tc.expectedOutput || ""
                }));

                const [prob] = await db.insert(schema.problems).values({
                    topicId: topic.id,
                    title: pData.title,
                    difficulty: normalizeDifficulty(pData.difficulty),
                    description: pData.description || pData.problemStatement || 'No description',
                    initialCode: pData.initialCode || '// Write your solution here',
                    testCases: JSON.stringify(standardTestCases),
                    conceptExplanation: pData.conceptExplanation || 'Concept details for ' + pData.title,
                    workedExample: pData.workedExample || 'Detailed example for ' + pData.title,
                    submissionFormat: pData.submissionFormat || 'Follow the provided function template.',
                    order: j + 1
                }).returning();

                // Solutions
                if (Array.isArray(pData.solutions)) {
                    for (const sol of pData.solutions) {
                        await db.insert(schema.codeSnippets).values({
                            problemId: prob.id,
                            language: sol.language,
                            type: 'solution',
                            code: sol.code
                        });
                    }
                }
            }
        }

        console.log('Ingestion finished successfully!');
    } catch (err) {
        console.error('Error during ingestion:', err);
    } finally {
        await pool.end();
    }
}

async function main() {
    await clearDatabase();
    await ingest();
}

main();
