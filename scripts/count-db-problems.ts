import { db } from './server/db';
import { problems, topics } from './shared/schema';

async function count() {
    const allProblems = await db.select().from(problems);
    const allTopics = await db.select().from(topics);
    console.log(`Total Topics in DB: ${allTopics.length}`);
    console.log(`Total Problems in DB: ${allProblems.length}`);

    for (const topic of allTopics) {
        const topicProblems = allProblems.filter(p => p.topicId === topic.id);
        console.log(`- ${topic.title}: ${topicProblems.length} problems`);
    }
}

count().catch(console.error).finally(() => process.exit());
