import fs from 'fs';
import path from 'path';
import { executeCode } from '../server/executor';

console.log("Starting script...");

async function main() {
    console.log("Reading data...");
    const jsonPath = path.join(process.cwd(), 'json_store', 'topic-jsons', 'mergerd-info.json');
    if (!fs.existsSync(jsonPath)) {
        console.error("File not found");
        return;
    }
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    // Iterate over all topics
    for (const [slug, topicData] of Object.entries(data)) {
        if (!topicData || !(topicData as any).problems) continue;

        const problems = (topicData as any).problems;

        for (const problem of problems) {
            console.log(`  Problem: ${problem.title}`);

            // Test each language
            const languages = ['python', 'java', 'javascript', 'cpp', 'c'];

            for (const lang of languages) {
                const sol = problem.solutions.find((s: any) => s.language === lang);
                if (sol) {
                    try {
                        console.log(`    Testing ${lang}...`);
                        await new Promise(r => setTimeout(r, 1000)); // Rate limit buffer
                        const res = await executeCode(lang, sol.code, problem.testCases);
                        let allPassed = true;
                        let errorMsg = "";

                        res.forEach((r, i) => {
                            if (!r.passed) {
                                allPassed = false;
                                if (!errorMsg) errorMsg = r.error || `Input: ${r.input.substring(0, 20)}... Expected: ${r.expected} Actual: ${r.actual}`;
                            }
                        });

                        if (allPassed) {
                            console.log(`PASS: [${slug}] ${problem.title} (${lang})`);
                        } else {
                            console.log(`FAIL: [${slug}] ${problem.title} (${lang}) - ${errorMsg.substring(0, 500)}`);
                        }
                    } catch (err: any) {
                        console.log(`    ${lang}: ERROR - ${err.message}`);
                    }
                } else {
                    // console.log(`    ${lang}: No solution found`);
                }
            }
        }
    }
}

main().catch(err => console.error(err));
