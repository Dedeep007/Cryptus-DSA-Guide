/**
 * DEBUG execution test for a specific problem
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import { executeCode } from '../server/executor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const curriculumPath = path.join(__dirname, '../json_store/curriculum-data.json');

async function main() {
    process.env.DEBUG_EXECUTOR = 'true';

    const problemTitle = process.argv[2] || "Rotate Array Left by One Place";

    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));
    let foundProblem: any = null;

    for (const topic of curriculum) {
        foundProblem = topic.problems.find((p: any) => p.title === problemTitle);
        if (foundProblem) break;
    }

    if (!foundProblem) {
        console.error(`Problem "${problemTitle}" not found`);
        process.exit(1);
    }

    const cppSolution = foundProblem.solutions.find((s: any) => s.language === 'cpp');
    console.log(`Testing [${foundProblem.title}]...`);

    const results = await executeCode('cpp', cppSolution.code, foundProblem.testCases);

    results.forEach((res: any, idx: number) => {
        console.log(`\nTC ${idx + 1}: ${res.passed ? 'PASSED' : 'FAILED'}`);
        console.log(`Input: ${res.input}`);
        console.log(`Expected: ${res.expected}`);
        console.log(`Actual: ${res.actual}`);
        if (res.error) console.log(`Error: ${res.error}`);
    });
}

main().catch(console.error);
