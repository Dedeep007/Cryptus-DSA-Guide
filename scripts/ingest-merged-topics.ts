import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

interface TestCase {
    input: string;
    output: string;
}

interface Solution {
    language: string;
    code: string;
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

interface CodeExample {
    language: string;
    code: string;
    explanation: string;
}

interface TopicData {
    topic: {
        slug: string;
        title: string;
        description: string;
    };
    codeExamples: CodeExample[];
    problems: Problem[];
}

interface MergedTopicsData {
    [topicSlug: string]: TopicData;
}

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

async function ingestMergedTopics() {
    try {
        // Read the JSON file
        const jsonPath = path.join(process.cwd(), 'json_store', 'topic-jsons', 'merged-topics.json');
        const jsonData = fs.readFileSync(jsonPath, 'utf-8');
        const mergedTopicsData: MergedTopicsData = JSON.parse(jsonData);

        const topicSlugs = Object.keys(mergedTopicsData);
        console.log(`Found ${topicSlugs.length} topics to ingest.`);

        const processedSlugs = new Set<string>();

        for (let i = 0; i < topicSlugs.length; i++) {
            const topicSlug = topicSlugs[i];
            const topicData = mergedTopicsData[topicSlug];

            // Validate topic data structure
            if (!topicData || !topicData.topic || !topicData.topic.slug) {
                console.log(`\n⚠️  Skipping invalid topic entry: ${topicSlug} (missing topic object)`);
                continue;
            }

            // Skip if we've already processed this topic slug (handles duplicates like updated_arrays)
            if (processedSlugs.has(topicData.topic.slug)) {
                console.log(`\n⚠️  Skipping duplicate topic slug: ${topicData.topic.slug}`);
                continue;
            }

            // Check if topic with this slug already exists
            const existingTopic = await db.select().from(schema.topics).where(eq(schema.topics.slug, topicData.topic.slug));
            if (existingTopic.length > 0) {
                console.log(`\nSkipping duplicate topic: ${topicData.topic.title} (slug: ${topicData.topic.slug})`);
                continue;
            }

            console.log(`\nIngesting topic: ${topicData.topic.title}`);

            // Insert topic with order
            const [topic] = await db.insert(schema.topics).values({
                slug: topicData.topic.slug,
                title: topicData.topic.title,
                description: topicData.topic.description,
                order: i + 1, // Assign sequential order
            }).returning();

            console.log(`Inserted topic: ${topic.title} (ID: ${topic.id})`);
            processedSlugs.add(topicData.topic.slug);

            // Insert code examples
            if (Array.isArray(topicData.codeExamples)) {
                for (const example of topicData.codeExamples) {
                    await db.insert(schema.topicExamples).values({
                        topicSlug: topic.slug,
                        language: example.language,
                        code: example.code,
                        explanation: example.explanation || 'Code example for this topic',
                    });
                }
                console.log(`Inserted ${topicData.codeExamples.length} code examples`);
            }

            // Insert problems
            if (Array.isArray(topicData.problems)) {
                for (let j = 0; j < topicData.problems.length; j++) {
                    try {
                        const problem = topicData.problems[j];

                        // Transform test cases to match expected format
                        const testCases = Array.isArray(problem.testCases)
                            ? problem.testCases.map((tc: any) => ({
                                input: tc.input || '',
                                output: tc.output || tc.expectedOutput || ''
                            }))
                            : [];

                        const [insertedProblem] = await db.insert(schema.problems).values({
                            topicId: topic.id,
                            title: problem.title,
                            description: problem.description || 'No description available',
                            difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
                            initialCode: '// Write your solution here',
                            testCases: JSON.stringify(testCases),
                            conceptExplanation: problem.concept || problem.conceptExplanation || 'This problem demonstrates key concepts from the topic.',
                            workedExample: problem.workedExample || problem.concept || 'Example solution will be shown after attempting the problem.',
                            submissionFormat: problem.submissionFormat || 'No submission format provided.',
                            order: j + 1,
                        }).returning();

                        console.log(`Inserted problem: ${problem.title} (ID: ${insertedProblem.id})`);

                        // Insert solutions for each language
                        if (Array.isArray(problem.solutions)) {
                            let insertedCount = 0;
                            for (const solution of problem.solutions) {
                                // Skip solutions with empty or missing code
                                if (!solution.code || solution.code.trim() === '') {
                                    console.log(`  Skipping empty solution for ${solution.language}`);
                                    continue;
                                }

                                await db.insert(schema.codeSnippets).values({
                                    problemId: insertedProblem.id,
                                    language: solution.language,
                                    type: 'solution',
                                    code: solution.code,
                                });
                                insertedCount++;
                            }
                            console.log(`Inserted ${insertedCount} solutions for ${problem.title}`);
                        }
                    } catch (problemError) {
                        console.error(`\n⚠️  Warning: Skipping problem at index ${j}:`, topicData.problems[j]?.title);
                        console.error('Error:', problemError instanceof Error ? problemError.message : problemError);
                        // Continue with next problem instead of failing
                        continue;
                    }
                }
            }
        }

        console.log('\n✅ All merged topics data ingested successfully!');

    } catch (error) {
        console.error('❌ Error ingesting merged topics:');
        console.error('Error details:', error);
        if (error instanceof Error) {
            console.error('Stack trace:', error.stack);
        }
        process.exit(1);
    } finally {
        await client.end();
    }
}

async function main() {
    await clearDatabase();
    await ingestMergedTopics();
}

main();
