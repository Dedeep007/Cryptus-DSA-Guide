const fs = require('fs');
const path = require('path');

// Test all problems by calling the API directly
async function testAllProblems() {
    const topicsDir = path.join(__dirname, '..', 'json_store', 'topic-jsons');
    const files = fs.readdirSync(topicsDir).filter(f => f.endsWith('.json') && f !== 'merged-topics.json');

    const results = {
        passed: [],
        failed: [],
        errors: []
    };

    console.log('='.repeat(60));
    console.log('AUTOMATED PROBLEM TESTING');
    console.log('='.repeat(60));

    for (const file of files) {
        const filePath = path.join(topicsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        const topicName = data.topic?.title || file;
        console.log(`\n📁 Topic: ${topicName}`);
        console.log('-'.repeat(40));

        if (!Array.isArray(data.problems)) continue;

        for (const problem of data.problems) {
            // Get the C++ solution (most reliable for testing)
            const cppSolution = problem.solutions?.find(s => s.language === 'cpp');
            if (!cppSolution) {
                console.log(`  ⚠️  ${problem.title}: No C++ solution`);
                continue;
            }

            const testCases = problem.testCases || [];
            if (testCases.length === 0) {
                console.log(`  ⚠️  ${problem.title}: No test cases`);
                continue;
            }

            // Test by calling the executor API
            try {
                const response = await fetch('http://localhost:5000/api/run', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        code: cppSolution.code,
                        language: 'cpp',
                        testCases: testCases
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json();

                // Check if all test cases passed
                const allPassed = result.every(r => r.passed);
                const passedCount = result.filter(r => r.passed).length;

                if (allPassed) {
                    console.log(`  ✅ ${problem.title}: ${passedCount}/${testCases.length} passed`);
                    results.passed.push({
                        topic: topicName,
                        problem: problem.title,
                        testCases: testCases.length
                    });
                } else {
                    console.log(`  ❌ ${problem.title}: ${passedCount}/${testCases.length} passed`);

                    // Log failed test case details
                    for (const r of result) {
                        if (!r.passed) {
                            console.log(`      Input: ${r.input.substring(0, 50)}...`);
                            console.log(`      Expected: ${r.expected}`);
                            console.log(`      Actual: ${r.actual}`);
                            if (r.error) {
                                console.log(`      Error: ${r.error.substring(0, 100)}`);
                            }
                        }
                    }

                    results.failed.push({
                        topic: topicName,
                        problem: problem.title,
                        testResults: result
                    });
                }
            } catch (error) {
                console.log(`  💥 ${problem.title}: Error - ${error.message}`);
                results.errors.push({
                    topic: topicName,
                    problem: problem.title,
                    error: error.message
                });
            }

            // Small delay to avoid overwhelming the API
            await new Promise(r => setTimeout(r, 200));
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${results.passed.length}`);
    console.log(`❌ Failed: ${results.failed.length}`);
    console.log(`💥 Errors: ${results.errors.length}`);

    if (results.failed.length > 0) {
        console.log('\n--- FAILED PROBLEMS ---');
        for (const f of results.failed) {
            console.log(`  ${f.topic} > ${f.problem}`);
        }
    }

    if (results.errors.length > 0) {
        console.log('\n--- ERROR PROBLEMS ---');
        for (const e of results.errors) {
            console.log(`  ${e.topic} > ${e.problem}: ${e.error}`);
        }
    }

    // Save detailed results to file
    fs.writeFileSync(
        path.join(__dirname, 'test-results.json'),
        JSON.stringify(results, null, 2)
    );
    console.log('\nDetailed results saved to scripts/test-results.json');
}

testAllProblems().catch(console.error);
