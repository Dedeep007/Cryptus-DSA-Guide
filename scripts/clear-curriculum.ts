import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

async function clearCurriculumData() {
    console.log("Clearing curriculum data...");

    // Delete in order due to foreign key constraints
    // codeSnippets reference problems
    await db.delete(codeSnippets);
    console.log("✓ Deleted all code snippets");

    // topicExamples are independent
    await db.delete(topicExamples);
    console.log("✓ Deleted all topic examples");

    // problems reference topics
    await db.delete(problems);
    console.log("✓ Deleted all problems");

    // topics are the parent
    await db.delete(topics);
    console.log("✓ Deleted all topics");

    console.log("\n🎉 All curriculum data has been removed from the database!");
    process.exit(0);
}

clearCurriculumData().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
