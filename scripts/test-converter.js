
import fs from 'fs';

function convertToMultiLang(input) {
    const lines = input.split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length === 2) {
        // Pattern: N, [Space separated vals]
        const n = parseInt(lines[0]);
        const vals = lines[1].split(/\s+/);
        if (!isNaN(n) && vals.length === n) {
            return `n = ${n}\narr = [${vals.join(', ')}]`;
        }
    }
    if (lines.length === 3) {
        // Pattern: N, [Space separated vals], Target
        const n = parseInt(lines[0]);
        const vals = lines[1].split(/\s+/);
        const target = lines[2];
        if (!isNaN(n) && vals.length === n) {
            return `n = ${n}\narr = [${vals.join(', ')}]\ntarget = ${target}`;
        }
    }
    return input;
}

const inputs = [
    "5\n1 2 3 4 5",
    "3\n10 20 30\n20",
    "just text"
];

inputs.forEach(i => console.log(`Input:\n${i}\nConverted:\n${convertToMultiLang(i)}\n---`));
