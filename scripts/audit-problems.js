
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('curriculum-data.json', 'utf8'));
const expectedLangs = ['cpp', 'c', 'python', 'java', 'javascript'];

let totalProblems = 0;
let fullySolved = 0;
let partiallySolved = 0;
let unsolved = 0;

data.forEach(topic => {
    const problems = [];
    if (topic.problems) problems.push(...topic.problems);
    if (topic.easy) problems.push(...topic.easy);
    if (topic.medium) problems.push(...topic.medium);
    if (topic.hard) problems.push(...topic.hard);
    if (topic.learning) problems.push(...topic.learning);

    problems.forEach(p => {
        totalProblems++;
        const solutions = p.solutions || [];
        const langs = solutions.map(s => s.language.toLowerCase());
        const missing = expectedLangs.filter(l => !langs.includes(l));

        if (langs.length === 5 && missing.length === 0) {
            fullySolved++;
        } else if (langs.length > 0) {
            partiallySolved++;
            // console.log(`[PARTIAL] ${p.title} (${topic.topic.title}) missing: [${missing.join(', ')}]`);
        } else {
            unsolved++;
        }
    });
});

console.log(`--- Problem Solutions Audit ---`);
console.log(`Total Problems: ${totalProblems}`);
console.log(`Fully Solved (5 langs): ${fullySolved}`);
console.log(`Partially Solved: ${partiallySolved}`);
console.log(`Unsolved: ${unsolved}`);
