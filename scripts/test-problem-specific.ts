/**
 * Test Problems Using Problem-Specific Executor
 * 
 * This script tests all problems in mergerd-info.json using the problem-specific
 * executor that has explicit configurations for each problem.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { executeProblemCode, hasProblemConfig } from '../server/problem-executor';
import { PROBLEM_CONFIGS, normalizeTitle } from '../server/problem-configs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MERGED_JSON_PATH = path.join(__dirname, '../json_store/topic-jsons/mergerd-info.json');
const RESULTS_PATH = path.join(__dirname, 'problem-specific-results.json');

interface TestResult {
    topic: string;
    problem: string;
    language: string;
    passed: boolean;
    testsRun: number;
    testsPassed: number;
    failedTests?: {
        input: string;
        expected: string;
        actual: string;
        error?: string;
    }[];
}

interface Summary {
    totalProblems: number;
    problemsWithConfig: number;
    problemsWithoutConfig: string[];
    results: TestResult[];
    passedByLanguage: Record<string, number>;
    failedByLanguage: Record<string, number>;
}

const SUPPORTED_LANGUAGES = ['cpp', 'python', 'javascript'];
const RATE_LIMIT_DELAY = 500;

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    console.log('Loading merged JSON...');
    const mergedData = JSON.parse(fs.readFileSync(MERGED_JSON_PATH, 'utf-8'));

    const summary: Summary = {
        totalProblems: 0,
        problemsWithConfig: 0,
        problemsWithoutConfig: [],
        results: [],
        passedByLanguage: {},
        failedByLanguage: {}
    };

    // Initialize language counters
    for (const lang of SUPPORTED_LANGUAGES) {
        summary.passedByLanguage[lang] = 0;
        summary.failedByLanguage[lang] = 0;
    }

    // Get all topic keys (mergedData is object keyed by topic slug)
    const topicKeys = Object.keys(mergedData);

    // Count all problems first
    for (const key of topicKeys) {
        const topicData = mergedData[key];
        summary.totalProblems += topicData.problems?.length || 0;
    }

    console.log(`Found ${summary.totalProblems} problems total across ${topicKeys.length} topics`);

    // Check which problems have configs
    const configuredProblems = Object.keys(PROBLEM_CONFIGS);
    console.log(`\nConfigured problems: ${configuredProblems.length}`);

    // List all configured problem names
    console.log('\n=== Configured Problems ===');
    configuredProblems.forEach(p => console.log(`  - ${p}`));
    console.log('===========================\n');

    // Test each problem
    let problemIndex = 0;
    for (const topicKey of topicKeys) {
        const topicData = mergedData[topicKey];
        const topicName = topicData.topic?.title || topicKey;
        console.log(`\n📂 Topic: ${topicName}`);

        for (const problem of topicData.problems || []) {
            problemIndex++;
            const title = problem.title;

            // Check if this problem has a config
            if (!hasProblemConfig(title)) {
                summary.problemsWithoutConfig.push(`${topicName}/${title}`);
                console.log(`  ⚠️ [${problemIndex}/${summary.totalProblems}] ${title} - NO CONFIG (skipping)`);
                continue;
            }

            summary.problemsWithConfig++;
            console.log(`  🧪 [${problemIndex}/${summary.totalProblems}] Testing: ${title}`);

            const testCases = problem.testCases || [];
            if (testCases.length === 0) {
                console.log(`    ⏭️ No test cases, skipping`);
                continue;
            }

            // Test each language
            for (const lang of SUPPORTED_LANGUAGES) {
                const solution = problem.solutions?.find((s: any) => s.language === lang);
                if (!solution) {
                    console.log(`    ❌ ${lang}: No solution available`);
                    continue;
                }

                try {
                    await sleep(RATE_LIMIT_DELAY);

                    const results = await executeProblemCode(
                        title,
                        lang,
                        solution.code,
                        testCases.map((tc: any) => ({ input: tc.input, output: tc.output }))
                    );

                    const passed = results.every(r => r.passed);
                    const testsPassed = results.filter(r => r.passed).length;
                    const testsRun = results.length;

                    const testResult: TestResult = {
                        topic: topicName,
                        problem: title,
                        language: lang,
                        passed,
                        testsRun,
                        testsPassed
                    };

                    if (!passed) {
                        testResult.failedTests = results
                            .filter(r => !r.passed)
                            .map(r => ({
                                input: r.input,
                                expected: r.expected,
                                actual: r.actual,
                                error: r.error
                            }));
                        summary.failedByLanguage[lang]++;
                        console.log(`    ❌ ${lang}: ${testsPassed}/${testsRun} tests passed`);
                    } else {
                        summary.passedByLanguage[lang]++;
                        console.log(`    ✅ ${lang}: ${testsPassed}/${testsRun} tests passed`);
                    }

                    summary.results.push(testResult);
                } catch (error: any) {
                    console.log(`    ❌ ${lang}: Error - ${error.message}`);
                    summary.results.push({
                        topic: topicName,
                        problem: title,
                        language: lang,
                        passed: false,
                        testsRun: 0,
                        testsPassed: 0,
                        failedTests: [{ input: '', expected: '', actual: '', error: error.message }]
                    });
                    summary.failedByLanguage[lang]++;
                }
            }
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Problems: ${summary.totalProblems}`);
    console.log(`Problems With Config: ${summary.problemsWithConfig}`);
    console.log(`Problems Without Config: ${summary.problemsWithoutConfig.length}`);
    console.log('\nResults by Language:');
    for (const lang of SUPPORTED_LANGUAGES) {
        const passed = summary.passedByLanguage[lang];
        const failed = summary.failedByLanguage[lang];
        const total = passed + failed;
        console.log(`  ${lang}: ${passed}/${total} passed (${total > 0 ? Math.round(passed / total * 100) : 0}%)`);
    }

    if (summary.problemsWithoutConfig.length > 0) {
        console.log('\n⚠️ Problems without configuration:');
        summary.problemsWithoutConfig.slice(0, 20).forEach(p => console.log(`  - ${p}`));
        if (summary.problemsWithoutConfig.length > 20) {
            console.log(`  ... and ${summary.problemsWithoutConfig.length - 20} more`);
        }
    }

    // Save detailed results
    fs.writeFileSync(RESULTS_PATH, JSON.stringify(summary, null, 2));
    console.log(`\nDetailed results saved to: ${RESULTS_PATH}`);

    // Print failed tests summary
    const failedResults = summary.results.filter(r => !r.passed);
    if (failedResults.length > 0) {
        console.log(`\n❌ Failed tests summary (${failedResults.length} failures):`);
        failedResults.slice(0, 10).forEach(r => {
            console.log(`  - ${r.problem} (${r.language}): ${r.testsPassed}/${r.testsRun}`);
            if (r.failedTests && r.failedTests[0]) {
                const ft = r.failedTests[0];
                if (ft.error) {
                    console.log(`    Error: ${ft.error.substring(0, 100)}...`);
                } else {
                    console.log(`    Expected: ${ft.expected.substring(0, 50)}`);
                    console.log(`    Actual: ${ft.actual.substring(0, 50)}`);
                }
            }
        });
    }
}

main().catch(console.error);
