/**
 * LIVE execution test for Arrays problems
 * Uses the actual executor to run solution code against Piston API
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
    if (!fs.existsSync(curriculumPath)) {
        console.error('Curriculum data not found at:', curriculumPath);
        process.exit(1);
    }

    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

    // Find Arrays topic
    const arraysTopic = curriculum.find((t: any) => t.topic.slug === 'arrays');
    if (!arraysTopic) {
        console.error('Arrays topic not found in curriculum');
        process.exit(1);
    }

    console.log('='.repeat(70));
    console.log(`LIVE EXECUTION TEST: ARRAYS TOPIC (${arraysTopic.problems.length} problems)`);
    console.log('='.repeat(70));

    let totalTC = 0;
    let passedTC = 0;
    let failedTC = 0;
    let errorTC = 0;

    const failures: any[] = [];

    for (const problem of arraysTopic.problems) {
        const cppSolution = problem.solutions?.find((s: any) => s.language === 'cpp');
        if (!cppSolution) {
            console.log(`Skipping [${problem.title}] - No C++ solution`);
            continue;
        }

        console.log(`\nTesting [${problem.title}]...`);

        try {
            // Run all test cases for this problem through the actual executor
            const results = await executeCode('cpp', cppSolution.code, problem.testCases);

            results.forEach((res: any, idx: number) => {
                totalTC++;
                if (res.passed) {
                    passedTC++;
                } else if (res.error) {
                    errorTC++;
                    failures.push({
                        problem: problem.title,
                        testCase: idx + 1,
                        input: res.input,
                        error: res.error,
                        type: 'ERROR'
                    });
                } else {
                    failedTC++;
                    failures.push({
                        problem: problem.title,
                        testCase: idx + 1,
                        input: res.input,
                        expected: res.expected,
                        actual: res.actual,
                        type: 'WRONG_ANSWER'
                    });
                }
            });

            const problemPassed = results.every((r: any) => r.passed);
            console.log(`  ${problemPassed ? '✅' : '❌'} ${results.filter((r: any) => r.passed).length}/${results.length} test cases passed`);

        } catch (err: any) {
            console.error(`  🔥 Major error executing [${problem.title}]:`, err.message);
        }

        // Wait a bit to avoid hitting rate limits
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY: ARRAYS TOPIC');
    console.log('='.repeat(70));
    console.log(`Total Test Cases: ${totalTC}`);
    console.log(`Passed: ${passedTC}`);
    console.log(`Failed (WA): ${failedTC}`);
    console.log(`Errors: ${errorTC}`);
    console.log(`Overall Success Rate: ${((passedTC / totalTC) * 100).toFixed(1)}%`);

    if (failures.length > 0) {
        console.log('\nDetailed Failures (Max 10):');
        failures.slice(0, 10).forEach(f => {
            console.log(`\n[${f.problem}] TC ${f.testCase}: ${f.type}`);
            console.log(`  Input: ${f.input}`);
            if (f.type === 'WRONG_ANSWER') {
                console.log(`  Expected: ${f.expected}`);
                console.log(`  Actual: ${f.actual}`);
            } else {
                console.log(`  Error: ${f.error}`);
            }
        });
    }
}

main().catch(console.error);
