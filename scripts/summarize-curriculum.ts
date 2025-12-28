import fs from 'fs';
import path from 'path';

const curriculumPath = path.join(process.cwd(), 'json_store', 'curriculum-data.json');
const data = JSON.parse(fs.readFileSync(curriculumPath, 'utf8'));

console.log('--- CURRICULUM OVERVIEW ---');
console.log(`Total Topics: ${data.length}`);
let totalProblems = 0;
data.forEach((t: any, index: number) => {
    try {
        const title = t.topic?.title || 'Unknown Topic';
        const count = t.problems?.length || 0;
        console.log(`${index + 1}. ${title}: ${count} problems`);
        totalProblems += count;
    } catch (e) {
        console.error(`Error processing topic at index ${index}:`, e);
    }
});
console.log(`\nTotal Problems Found: ${totalProblems}`);
