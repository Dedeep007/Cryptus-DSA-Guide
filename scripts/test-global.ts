/**
 * COMPREHENSIVE execution test for ALL problems across ALL topics
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
// @ts-ignore
import { executeCode } from '../server/executor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonStoreDir = path.join(__dirname, '../json_store');

async function main() {
    const files = fs.readdirSync(jsonStoreDir).filter(f => f.endsWith('-topic.json'));

    console.log('='.repeat(80));
    console.log(`STARTING GLOBAL TEST SUITE: ${files.length} Topics Identified`);
    console.log('='.repeat(80));

    const globalSummary: any[] = [];
    let grandTotalPassed = 0;
    let grandTotalTC = 0;

    for (const file of files) {
        try {
            const content = JSON.parse(fs.readFileSync(path.join(jsonStoreDir, file), 'utf8'));
            const topicTitle = content.topic?.title || file;
            const topicProblems = [
                ...(content.problems || []),
                ...(content.learning || []),
                ...(content.easy || []),
                ...(content.medium || []),
                ...(content.hard || [])
            ];

            // Filter unique by title
            const uniqueProblems = Array.from(new Map(topicProblems.map((p: any) => [p.title, p])).values());

            if (uniqueProblems.length === 0) continue;

            console.log(`\nTesting Topic: [${topicTitle}] (${uniqueProblems.length} problems)`);

            let topicPassed = 0;
            let topicTotal = 0;
            let topicTCs = 0;
            let topicTCPassed = 0;

            for (const problem of uniqueProblems) {
                const cppSolution = (problem as any).solutions?.find((s: any) => s.language === 'cpp');
                if (!cppSolution) continue;

                topicTotal++;
                try {
                    const results = await executeCode('cpp', cppSolution.code, (problem as any).testCases);
                    const allPassed = results && results.length > 0 && results.every((r: any) => r.passed);

                    if (results && results.length > 0) {
                        topicTCs += results.length;
                        topicTCPassed += results.filter((r: any) => r.passed).length;
                    }

                    if (allPassed) {
                        topicPassed++;
                    }
                } catch (e) {
                    // Fail silently but count
                }
                // Small delay to be nice to API
                await new Promise(r => setTimeout(r, 100));
            }

            console.log(`Result: ${topicPassed}/${topicTotal} problems passed (${topicTCPassed}/${topicTCs} test cases)`);
            globalSummary.push({
                topic: topicTitle,
                passed: topicPassed,
                total: topicTotal,
                tcPassed: topicTCPassed,
                tcTotal: topicTCs
            });

            grandTotalPassed += topicPassed;
            grandTotalTC += topicTotal;

        } catch (e) {
            console.error(`Error processing topic ${file}:`, e);
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('FINAL GLOBAL FIX REPORT');
    console.log('='.repeat(80));
    console.log(`${'Topic'.padEnd(30)} | ${'Problems'.padEnd(10)} | ${'Success Rate'}`);
    console.log('-'.repeat(80));

    globalSummary.forEach(s => {
        const rate = s.total > 0 ? ((s.passed / s.total) * 100).toFixed(1) : 'N/A';
        console.log(`${s.topic.padEnd(30)} | ${String(s.passed + '/' + s.total).padEnd(10)} | ${rate}%`);
    });

    console.log('-'.repeat(80));
    console.log(`GRAND TOTAL: ${grandTotalPassed}/${grandTotalTC} problems passed`);
    console.log('='.repeat(80));
}

main().catch(console.error);
