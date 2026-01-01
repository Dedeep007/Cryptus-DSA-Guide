/**
 * Comprehensive Problem Tester for mergerd-info.json
 * Tests all problems across all 5 languages with detailed reporting
 * 
 * Run with: npx tsx scripts/test-merged-problems.ts
 */

import fs from 'fs';
import path from 'path';
import { executeCode } from '../server/executor';

interface TestCase {
    input: string;
    output: string;
}

interface Solution {
    language: string;
    code: string;
}

interface Problem {
    title: string;
    description?: string;
    difficulty?: string;
    testCases: TestCase[];
    solutions: Solution[];
}

interface TopicData {
    topic: { title: string; slug: string };
    problems: Problem[];
    codeExamples?: any[];
}

interface TestResult {
    topic: string;
    problem: string;
    language: string;
    passed: boolean;
    testsPassed: number;
    testsTotal: number;
    error?: string;
    details?: any[];
}

interface Summary {
    totalProblems: number;
    totalTests: number;
    passedByLanguage: Record<string, number>;
    failedByLanguage: Record<string, number>;
    results: TestResult[];
}

const LANGUAGES = ['python', 'javascript', 'cpp', 'c', 'java'];

// Increased delay to avoid rate limiting (Piston API allows 1 req per 200ms)
const RATE_LIMIT_DELAY = 500; // 500ms between language tests

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testProblem(
    topic: string,
    problem: Problem,
    language: string
): Promise<TestResult> {
    const solution = problem.solutions?.find(s => s.language === language);

    if (!solution || !solution.code || solution.code.trim() === '') {
        return {
            topic,
            problem: problem.title,
            language,
            passed: false,
            testsPassed: 0,
            testsTotal: problem.testCases?.length || 0,
            error: 'No solution available'
        };
    }

    if (!problem.testCases || problem.testCases.length === 0) {
        return {
            topic,
            problem: problem.title,
            language,
            passed: false,
            testsPassed: 0,
            testsTotal: 0,
            error: 'No test cases available'
        };
    }

    try {
        const results = await executeCode(language, solution.code, problem.testCases);

        const passedCount = results.filter(r => r.passed).length;
        const allPassed = passedCount === results.length;

        const details = results.filter(r => !r.passed).map(r => ({
            input: r.input.substring(0, 100),
            expected: r.expected,
            actual: r.actual,
            error: r.error?.substring(0, 200)
        }));

        return {
            topic,
            problem: problem.title,
            language,
            passed: allPassed,
            testsPassed: passedCount,
            testsTotal: results.length,
            details: details.length > 0 ? details : undefined
        };
    } catch (error: any) {
        return {
            topic,
            problem: problem.title,
            language,
            passed: false,
            testsPassed: 0,
            testsTotal: problem.testCases.length,
            error: error.message?.substring(0, 300)
        };
    }
}

async function main() {
    console.log('='.repeat(70));
    console.log('  COMPREHENSIVE PROBLEM TESTER - mergerd-info.json');
    console.log('  Testing all problems across all 5 languages');
    console.log('='.repeat(70));
    console.log();

    const jsonPath = path.join(process.cwd(), 'json_store', 'topic-jsons', 'mergerd-info.json');

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ File not found:', jsonPath);
        return;
    }

    console.log('📖 Reading mergerd-info.json...');
    const data: Record<string, TopicData> = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

    const summary: Summary = {
        totalProblems: 0,
        totalTests: 0,
        passedByLanguage: {},
        failedByLanguage: {},
        results: []
    };

    // Initialize language counters
    for (const lang of LANGUAGES) {
        summary.passedByLanguage[lang] = 0;
        summary.failedByLanguage[lang] = 0;
    }

    // Count total problems
    let totalProblems = 0;
    for (const [slug, topicData] of Object.entries(data)) {
        if (topicData?.problems) {
            totalProblems += topicData.problems.length;
        }
    }
    summary.totalProblems = totalProblems;
    console.log(`📊 Found ${Object.keys(data).length} topics with ${totalProblems} total problems\n`);

    let problemIndex = 0;

    // Process each topic
    for (const [slug, topicData] of Object.entries(data)) {
        if (!topicData?.problems || !Array.isArray(topicData.problems)) {
            continue;
        }

        const topicName = topicData.topic?.title || slug;
        console.log(`\n${'─'.repeat(70)}`);
        console.log(`📁 TOPIC: ${topicName.toUpperCase()} (${topicData.problems.length} problems)`);
        console.log('─'.repeat(70));

        for (const problem of topicData.problems) {
            problemIndex++;
            console.log(`\n[${problemIndex}/${totalProblems}] 📝 ${problem.title}`);

            const langResults: string[] = [];

            for (const language of LANGUAGES) {
                // Rate limiting
                await sleep(RATE_LIMIT_DELAY);

                const result = await testProblem(topicName, problem, language);
                summary.results.push(result);
                summary.totalTests += result.testsTotal;

                if (result.passed) {
                    summary.passedByLanguage[language]++;
                    langResults.push(`✅ ${language}`);
                } else if (result.error === 'No solution available') {
                    langResults.push(`⚠️ ${language} (no code)`);
                    // Don't count as failed if no solution exists
                } else {
                    summary.failedByLanguage[language]++;
                    langResults.push(`❌ ${language} (${result.testsPassed}/${result.testsTotal})`);

                    // Show error details for failures
                    if (result.details && result.details.length > 0) {
                        console.log(`   └─ ${language}: ${result.details[0].error || `Expected: ${result.details[0].expected}, Got: ${result.details[0].actual}`}`);
                    } else if (result.error) {
                        console.log(`   └─ ${language}: ${result.error.substring(0, 100)}`);
                    }
                }
            }

            console.log(`   Results: ${langResults.join(' | ')}`);
        }
    }

    // Print Summary
    console.log('\n' + '═'.repeat(70));
    console.log('  FINAL SUMMARY');
    console.log('═'.repeat(70));
    console.log(`\n📊 Total Problems: ${summary.totalProblems}`);
    console.log(`📊 Total Test Executions: ${summary.totalTests}`);

    console.log('\n📈 Results by Language:');
    console.log('─'.repeat(40));
    for (const lang of LANGUAGES) {
        const passed = summary.passedByLanguage[lang];
        const failed = summary.failedByLanguage[lang];
        const total = passed + failed;
        const percentage = total > 0 ? ((passed / total) * 100).toFixed(1) : '0.0';
        const bar = '█'.repeat(Math.floor(Number(percentage) / 5)) + '░'.repeat(20 - Math.floor(Number(percentage) / 5));
        console.log(`  ${lang.padEnd(12)} ${bar} ${passed}/${total} (${percentage}%)`);
    }

    // List failed problems
    const failedResults = summary.results.filter(r => !r.passed && r.error !== 'No solution available');
    if (failedResults.length > 0) {
        console.log('\n❌ Failed Problems:');
        console.log('─'.repeat(40));

        // Group by problem
        const failedByProblem: Record<string, string[]> = {};
        for (const r of failedResults) {
            const key = `${r.topic} > ${r.problem}`;
            if (!failedByProblem[key]) {
                failedByProblem[key] = [];
            }
            failedByProblem[key].push(r.language);
        }

        for (const [problem, langs] of Object.entries(failedByProblem)) {
            console.log(`  ${problem}`);
            console.log(`    Failed in: ${langs.join(', ')}`);
        }
    }

    // Save detailed results
    const resultsPath = path.join(process.cwd(), 'scripts', 'merged-test-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(summary, null, 2));
    console.log(`\n💾 Detailed results saved to: scripts/merged-test-results.json`);

    // Create a compact summary file
    const compactSummary = {
        timestamp: new Date().toISOString(),
        totalProblems: summary.totalProblems,
        passedByLanguage: summary.passedByLanguage,
        failedByLanguage: summary.failedByLanguage,
        failedProblems: failedResults.map(r => ({
            topic: r.topic,
            problem: r.problem,
            language: r.language,
            error: r.error || (r.details?.[0] ? `Expected: ${r.details[0].expected}, Got: ${r.details[0].actual}` : 'Unknown')
        }))
    };

    const summaryPath = path.join(process.cwd(), 'scripts', 'test-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(compactSummary, null, 2));
    console.log(`💾 Compact summary saved to: scripts/test-summary.json`);

    console.log('\n' + '═'.repeat(70));
    console.log('  TESTING COMPLETE');
    console.log('═'.repeat(70));
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
