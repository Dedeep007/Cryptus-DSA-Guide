import fs from 'fs';
const content = fs.readFileSync('server/executor.ts', 'utf-8');
let balance = 0;
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Ignore braces in strings/comments roughly
    const cleanLine = line.replace(/`[\s\S]*?`/g, '').replace(/'[^']*'/g, '').replace(/"[^"]*"/g, '').replace(/\/\/.*$/, '');

    for (const char of cleanLine) {
        if (char === '{') balance++;
        if (char === '}') balance--;
    }
    if ((i + 1) % 100 === 0) console.log(`Line ${i + 1}: Balance ${balance}`);
}
console.log(`Final: ${balance}`);
