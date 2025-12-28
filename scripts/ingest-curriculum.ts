import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

interface CurriculumData {
  topic: {
    slug: string;
    title: string;
    description: string;
  };
  codeExamples: Array<{
    language: string;
    code: string;
    explanation: string;
  }>;
  problems: Array<{
    title: string;
    description: string;
    difficulty: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
    solutions: Array<{
      language: string;
      code: string;
    }>;
  }>;
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

async function ingestCurriculum() {
  try {
    // Read the JSON file
    const jsonPath = path.join(process.cwd(), 'curriculum-data.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    const curriculumData: CurriculumData[] = JSON.parse(jsonData);

    console.log(`Found ${curriculumData.length} topics to ingest.`);

    for (let i = 0; i < curriculumData.length; i++) {
      const topicData = curriculumData[i];
      
      // Handle different JSON structures
      const topicInfo = topicData.topic || topicData;
      
      // Check if topic with this slug already exists
      const existingTopic = await db.select().from(schema.topics).where(eq(schema.topics.slug, topicInfo.slug));
      if (existingTopic.length > 0) {
        console.log(`\nSkipping duplicate topic: ${topicInfo.title} (slug: ${topicInfo.slug})`);
        continue;
      }
      
      console.log(`\nIngesting topic: ${topicInfo.title}`);

      // Insert topic with order
      const [topic] = await db.insert(schema.topics).values({
        slug: topicInfo.slug,
        title: topicInfo.title,
        description: topicInfo.description,
        order: i + 1, // Assign sequential order
      }).returning();

      console.log(`Inserted topic: ${topic.title} (ID: ${topic.id})`);

      // Insert code examples - handle different structures
      const codeExamples = topicData.codeExamples || topicInfo.codeExamples;
      if (Array.isArray(codeExamples)) {
        for (const example of codeExamples) {
          await db.insert(schema.topicExamples).values({
            topicSlug: topic.slug,
            language: example.language,
            code: example.code,
            explanation: example.explanation || 'Code example for this topic',
          });
        }
      } else if (codeExamples && typeof codeExamples === 'object') {
        // Handle dict format like {cpp: "code", python: "code", ...}
        for (const [language, code] of Object.entries(codeExamples)) {
          await db.insert(schema.topicExamples).values({
            topicSlug: topic.slug,
            language: language,
            code: code as string,
            explanation: 'Code example for this topic',
          });
        }
      }
      console.log(`Inserted code examples`);

      // Insert problems
      for (let j = 0; j < topicData.problems.length; j++) {
        const problem = topicData.problems[j];
        const [insertedProblem] = await db.insert(schema.problems).values({
          topicId: topic.id,
          title: problem.title,
          description: problem.description || problem.problemStatement || 'No description available',
          difficulty: problem.difficulty as 'easy' | 'medium' | 'hard',
          initialCode: problem.initialCode || '// Write your solution here',
          testCases: JSON.stringify(problem.testCases),
          conceptExplanation: problem.conceptExplanation || 'This problem demonstrates key concepts from the topic.',
          workedExample: problem.workedExample || 'Example solution will be shown after attempting the problem.',
          order: j + 1,
        }).returning();

        console.log(`Inserted problem: ${problem.title} (ID: ${insertedProblem.id})`);

        // Insert solutions for each language - handle different structures
        const solutions = problem.solutions;
        if (Array.isArray(solutions)) {
          for (const solution of solutions) {
            await db.insert(schema.codeSnippets).values({
              problemId: insertedProblem.id,
              language: solution.language,
              type: 'solution',
              code: solution.code,
            });
          }
        } else if (solutions && typeof solutions === 'object') {
          // Handle dict format like {cpp: "code", python: "code", ...}
          for (const [language, code] of Object.entries(solutions)) {
            await db.insert(schema.codeSnippets).values({
              problemId: insertedProblem.id,
              language: language,
              type: 'solution',
              code: code as string,
            });
          }
        }
        console.log(`Inserted solutions for ${problem.title}`);
      }
    }

    console.log('\n✅ All curriculum data ingested successfully!');

  } catch (error) {
    console.error('❌ Error ingesting curriculum:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

async function main() {
  await clearDatabase();
  await ingestCurriculum();
}

main();