import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Find all topic files (excluding backups)
const files = fs.readdirSync(rootDir).filter(f =>
    f.endsWith('-topic.json') && !f.includes('backup')
);

console.log('Found topic files:', files.length);

const merged = [];

for (const file of files) {
    try {
        const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
        const data = JSON.parse(content);

        if (Array.isArray(data)) {
            merged.push(...data);
            console.log('Added:', file, '(' + data.length + ' topics)');
        } else {
            merged.push(data);
            console.log('Added:', file, '(1 topic)');
        }
    } catch (err) {
        console.error('Error with', file + ':', err.message);
    }
}

const outputPath = path.join(rootDir, 'curriculum-data.json');
fs.writeFileSync(outputPath, JSON.stringify(merged, null, 2), 'utf8');

console.log('\nMerge complete!');
console.log('Total topics:', merged.length);
console.log('Output file:', outputPath);

// Count problems from all possible structures
let totalProblems = 0;
for (const topic of merged) {
    if (topic.problems) {
        totalProblems += topic.problems.length;
    }
    if (topic.easy) {
        totalProblems += topic.easy.length;
    }
    if (topic.medium) {
        totalProblems += topic.medium.length;
    }
    if (topic.hard) {
        totalProblems += topic.hard.length;
    }
    if (topic.learning) {
        totalProblems += topic.learning.length;
    }
    // If it's a flat problem object with title (from array topics like dp-topic.json)
    if (topic.title && topic.solutions && !topic.problems && !topic.easy) {
        totalProblems += 1;
    }
}
console.log('Total problems:', totalProblems);
