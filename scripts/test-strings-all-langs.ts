import fs from 'fs';
import path from 'path';
import { executeCode } from '../server/executor';

const LANG_MAP: Record<string, string> = {
    'cpp': 'cpp',
    'c': 'c',
    'python': 'python',
    'java': 'java',
    'javascript': 'javascript'
};

const TOPIC_FILE = 'strings.json';

async function testStringsTopic() {
    const topicsDir = path.join(import.meta.dirname, '..', 'json_store', 'topic-jsons');
    const filePath = path.join(topicsDir, TOPIC_FILE);

    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`Testing topic: ${data.topic.title} (${TOPIC_FILE})`);
    console.log('='.repeat(60));

    let totalPassed = 0;
    let totalFailed = 0;

    for (const problem of data.problems) {
        if (problem.title !== "Roman to Integer") continue;
        console.log(`\n🔹 Problem: ${problem.title}`);

        const testCases = problem.testCases || [];
        if (testCases.length === 0) {
            console.log('   ⚠️ No test cases found.');
            continue;
        }

        for (const sol of problem.solutions) {
            const lang = sol.language;
            if (!LANG_MAP[lang]) continue;

            process.stdout.write(`   Testing ${lang.padEnd(10)}: `);

            try {
                // Short timeout for basic validation
                // We use the executor directly
                const results = await executeCode(lang, sol.code, testCases);
                const allPassed = results.every(r => r.passed);

                if (allPassed) {
                    console.log('✅ PASS');
                    totalPassed++;
                } else {
                    console.log('❌ FAIL');
                    results.filter(r => !r.passed).forEach(r => {
                        console.log('      FULL RESULT:', JSON.stringify(r));
                    });
                    totalFailed++;
                }
            } catch (err: any) {
                console.log('💥 ERROR');
                console.log(`      ${err.message}`);
                totalFailed++;
            }
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`SUMMARY: ${totalPassed} passed, ${totalFailed} failed`);
}

testStringsTopic().catch(console.error);
