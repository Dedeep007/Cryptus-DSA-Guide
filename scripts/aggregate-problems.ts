import fs from 'fs';
import path from 'path';

const jsonStoreDir = path.join(process.cwd(), 'json_store');
const files = fs.readdirSync(jsonStoreDir).filter(f => f.endsWith('-topic.json'));

const allProblems: any[] = [];
const seenTitles = new Set<string>();

function addProblems(problems: any[], topicTitle: string) {
    if (!problems) return;
    problems.forEach(p => {
        const key = `${topicTitle}:${p.title}`;
        if (!seenTitles.has(key)) {
            allProblems.push({ ...p, topic: topicTitle });
            seenTitles.add(key);
        }
    });
}

files.forEach(file => {
    try {
        const content = JSON.parse(fs.readFileSync(path.join(jsonStoreDir, file), 'utf8'));
        const topicTitle = content.topic?.title || file;

        addProblems(content.problems, topicTitle);
        addProblems(content.learning, topicTitle);
        addProblems(content.easy, topicTitle);
        addProblems(content.medium, topicTitle);
        addProblems(content.hard, topicTitle);
    } catch (e) {
        console.error(`Error reading ${file}:`, e);
    }
});

// Also check curriculum-data.json
const curricPath = path.join(jsonStoreDir, 'curriculum-data.json');
if (fs.existsSync(curricPath)) {
    const curric = JSON.parse(fs.readFileSync(curricPath, 'utf8'));
    curric.forEach((t: any) => {
        const topicTitle = t.topic?.title || 'Unknown';
        addProblems(t.problems, topicTitle);
    });
}

console.log(`Total Unique Problems Found: ${allProblems.length}`);

// Group by topic
const topics: Record<string, number> = {};
allProblems.forEach(p => {
    topics[p.topic] = (topics[p.topic] || 0) + 1;
});

Object.entries(topics).sort((a, b) => b[1] - a[1]).forEach(([title, count]) => {
    console.log(`- ${title}: ${count}`);
});
