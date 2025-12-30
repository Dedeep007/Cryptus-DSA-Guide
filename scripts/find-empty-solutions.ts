import fs from 'fs';
import path from 'path';

interface Solution {
    language: string;
    code: string;
}

interface Problem {
    title: string;
    solutions: Solution[];
}

interface TopicData {
    topic: {
        slug: string;
        title: string;
    };
    problems: Problem[];
}

interface MergedTopicsData {
    [topicSlug: string]: TopicData;
}

const jsonPath = path.join(process.cwd(), 'json_store', 'topic-jsons', 'merged-topics copy.json');
const jsonData = fs.readFileSync(jsonPath, 'utf-8');
const mergedTopicsData: MergedTopicsData = JSON.parse(jsonData);

const emptyProblems: Array<{
    topic: string;
    problem: string;
    emptyLanguages: string[];
}> = [];

for (const [topicSlug, topicData] of Object.entries(mergedTopicsData)) {
    if (Array.isArray(topicData.problems)) {
        for (const problem of topicData.problems) {
            const emptyLanguages: string[] = [];

            if (Array.isArray(problem.solutions)) {
                for (const solution of problem.solutions) {
                    if (!solution.code || solution.code.trim() === '') {
                        emptyLanguages.push(solution.language || 'unknown');
                    }
                }
            }

            if (emptyLanguages.length > 0) {
                emptyProblems.push({
                    topic: topicData.topic.title,
                    problem: problem.title,
                    emptyLanguages
                });
            }
        }
    }
}

console.log(`\nFound ${emptyProblems.length} problems with empty solutions:\n`);
emptyProblems.forEach((item, index) => {
    console.log(`${index + 1}. Topic: ${item.topic}`);
    console.log(`   Problem: ${item.problem}`);
    console.log(`   Empty languages: ${item.emptyLanguages.join(', ')}\n`);
});

// Write to file
const outputPath = path.join(process.cwd(), 'empty-solutions-report.txt');
const report = emptyProblems.map((item, index) =>
    `${index + 1}. Topic: ${item.topic}\n   Problem: ${item.problem}\n   Empty languages: ${item.emptyLanguages.join(', ')}\n`
).join('\n');

fs.writeFileSync(outputPath, `Found ${emptyProblems.length} problems with empty solutions:\n\n${report}`);
console.log(`Report saved to: ${outputPath}`);
