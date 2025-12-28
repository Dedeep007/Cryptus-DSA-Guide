/**
 * Test Runner for Problem Solutions
 * Runs all solutions against their test cases to validate the executor
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read curriculum data
const curriculumPath = path.join(__dirname, '../json_store/curriculum-data.json');

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
    difficulty: string;
    testCases: TestCase[];
    solutions: Solution[];
}

interface Topic {
    topic: { slug: string; title: string };
    problems: Problem[];
}

// Simple executor simulation - just parse and log what would be generated
function parseInputs(inputStr: string): Record<string, any> {
    const vars: Record<string, any> = {};
    const normalized = inputStr.trim();

    const segments: string[] = [];
    let depth = 0;
    let current = '';

    for (let i = 0; i < normalized.length; i++) {
        const char = normalized[i];
        if (char === '[' || char === '{' || char === '(') depth++;
        if (char === ']' || char === '}' || char === ')') depth--;

        if ((char === ',' || char === '\n') && depth === 0) {
            if (current.trim()) segments.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) segments.push(current.trim());

    const unnamedValues: string[] = [];

    segments.forEach(segment => {
        if (!segment) return;

        const match = segment.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*[:=]\s*(.+)$/);

        if (match) {
            vars[match[1].trim()] = match[2].trim();
        } else if (segment.startsWith('[') || segment.startsWith('{') ||
            !isNaN(Number(segment)) || segment.startsWith('"') || segment.startsWith("'")) {
            unnamedValues.push(segment);
        }
    });

    if (Object.keys(vars).length === 0 && unnamedValues.length > 0) {
        const defaultParamNames = ['root', 'head', 'nums', 'arr', 'n', 's', 'target', 'k'];
        unnamedValues.forEach((val, index) => {
            vars[defaultParamNames[index] || `arg${index}`] = val;
        });
    }

    return vars;
}

async function main() {
    if (!fs.existsSync(curriculumPath)) {
        console.error('Curriculum data not found at:', curriculumPath);
        process.exit(1);
    }

    const curriculum = JSON.parse(fs.readFileSync(curriculumPath, 'utf-8'));

    const results = {
        total: 0,
        parseSuccess: 0,
        parseFail: 0,
        problems: [] as { title: string; topic: string; testCase: number; input: string; parsed: any; issues: string[] }[]
    };

    console.log('='.repeat(70));
    console.log('PROBLEM TEST CASE ANALYSIS');
    console.log('='.repeat(70));

    for (const topicData of curriculum) {
        const topicName = topicData?.topic?.title || 'Unknown';
        const problems = topicData?.problems || [];

        if (!Array.isArray(problems)) continue;

        for (const problem of problems) {
            if (!problem || !problem.testCases) continue;

            const cppSolution = problem.solutions?.find((s: Solution) => s.language === 'cpp');

            for (let i = 0; i < problem.testCases.length; i++) {
                results.total++;
                const tc = problem.testCases[i];
                const parsed = parseInputs(tc.input);
                const varNames = Object.keys(parsed);
                const issues: string[] = [];

                // Check for parsing issues
                if (varNames.length === 0) {
                    issues.push('No variables parsed from input');
                }

                // Check for unusual formats
                if (tc.input.includes(':') && !tc.input.includes('=')) {
                    // Check if colon parsing worked
                    const colonMatches = tc.input.match(/([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g);
                    if (colonMatches) {
                        for (const match of colonMatches) {
                            const varName = match.replace(':', '').trim();
                            if (!varNames.includes(varName)) {
                                issues.push(`Colon-separated variable "${varName}" not parsed`);
                            }
                        }
                    }
                }

                // Check for TreeNode/ListNode in solution but no tree variable
                if (cppSolution) {
                    if (cppSolution.code.includes('TreeNode') && !varNames.some(v => v === 'root' || v.includes('tree'))) {
                        issues.push('TreeNode in solution but no "root" variable in parsed input');
                    }
                    if (cppSolution.code.includes('ListNode') && !varNames.some(v => v === 'head' || v.includes('list'))) {
                        issues.push('ListNode in solution but no "head" variable in parsed input');
                    }
                }

                // Check for void functions with output params
                if (cppSolution) {
                    const voidMatch = cppSolution.code.match(/void\s+\w+\s*\([^)]*vector\s*<[^>]+>\s*&\s*(\w+)/);
                    if (voidMatch && !varNames.includes(voidMatch[1])) {
                        // This is expected - we auto-create the output param
                    }
                }

                if (issues.length > 0) {
                    results.parseFail++;
                    results.problems.push({
                        title: problem.title,
                        topic: topicName,
                        testCase: i + 1,
                        input: tc.input,
                        parsed,
                        issues
                    });
                } else {
                    results.parseSuccess++;
                }
            }
        }
    }

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('SUMMARY');
    console.log('='.repeat(70));
    console.log(`Total test cases: ${results.total}`);
    console.log(`Successfully parsed: ${results.parseSuccess}`);
    console.log(`Issues found: ${results.parseFail}`);
    console.log(`Success rate: ${((results.parseSuccess / results.total) * 100).toFixed(1)}%`);

    if (results.problems.length > 0) {
        console.log('\n' + '='.repeat(70));
        console.log('PROBLEMS WITH ISSUES');
        console.log('='.repeat(70));

        for (const prob of results.problems.slice(0, 20)) { // Show first 20
            console.log(`\n[${prob.topic}] ${prob.title} - Test Case ${prob.testCase}`);
            console.log(`  Input: ${prob.input.substring(0, 100)}${prob.input.length > 100 ? '...' : ''}`);
            console.log(`  Parsed: ${JSON.stringify(prob.parsed)}`);
            console.log(`  Issues:`);
            for (const issue of prob.issues) {
                console.log(`    - ${issue}`);
            }
        }

        if (results.problems.length > 20) {
            console.log(`\n... and ${results.problems.length - 20} more problems with issues`);
        }
    }

    // Group issues by type
    console.log('\n' + '='.repeat(70));
    console.log('ISSUE BREAKDOWN');
    console.log('='.repeat(70));

    const issueTypes: Record<string, number> = {};
    for (const prob of results.problems) {
        for (const issue of prob.issues) {
            const key = issue.split('"')[0].trim(); // Get issue type
            issueTypes[key] = (issueTypes[key] || 0) + 1;
        }
    }

    for (const [type, count] of Object.entries(issueTypes).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${count}x: ${type}`);
    }
}

main().catch(console.error);
