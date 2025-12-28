
import fs from 'fs';

const filePath = 'curriculum-data.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('--- Topic Code Examples Audit ---');
const expectedLangs = ['cpp', 'c', 'python', 'java', 'javascript'];

data.forEach((topicObj, index) => {
    const title = topicObj.topic?.title || 'Unknown Topic';
    const ce = topicObj.codeExamples || [];
    const langs = ce.map(ex => ex.language.toLowerCase());

    const missing = expectedLangs.filter(l => !langs.includes(l));

    if (ce.length === 0) {
        console.log(`[MISSING] ${index + 1}. ${title}: No code examples found.`);
    } else if (missing.length > 0) {
        console.log(`[PARTIAL] ${index + 1}. ${title}: Has [${langs.join(', ')}]. Missing: [${missing.join(', ')}].`);
    } else {
        console.log(`[OK]      ${index + 1}. ${title}: All 5 languages present.`);
    }
});
