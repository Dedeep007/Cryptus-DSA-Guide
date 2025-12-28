
import fs from 'fs';
import path from 'path';

function convertToMultiLang(input) {
    if (typeof input !== 'string') return input;
    const lines = input.split('\n').map(l => l.trim()).filter(l => l);

    // N, Array
    if (lines.length === 2) {
        const n = parseInt(lines[0]);
        const vals = lines[1].split(/\s+/);
        if (!isNaN(n) && vals.length === n && vals.every(v => !isNaN(parseFloat(v)))) {
            return `n = ${n}\narr = [${vals.join(', ')}]`;
        }
    }

    // N, Array, Target
    if (lines.length === 3) {
        const n = parseInt(lines[0]);
        const vals = lines[1].split(/\s+/);
        const target = lines[2];
        if (!isNaN(n) && vals.length === n && vals.every(v => !isNaN(parseFloat(v)))) {
            return `n = ${n}\narr = [${vals.join(', ')}]\ntarget = ${target}`;
        }
    }

    // Single number
    if (lines.length === 1 && !isNaN(parseFloat(lines[0])) && !lines[0].includes('=') && !lines[0].includes('[')) {
        return `n = ${lines[0]}`;
    }

    return input;
}

const files = fs.readdirSync('.').filter(f => f.endsWith('-topic.json') && !f.includes('backup'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let data = JSON.parse(content);
    let changed = false;

    const processObj = (obj) => {
        const arrayKeys = ['problems', 'easy', 'medium', 'hard', 'learning'];
        arrayKeys.forEach(key => {
            if (Array.isArray(obj[key])) {
                obj[key].forEach(p => {
                    if (p.testCases) {
                        p.testCases.forEach(tc => {
                            const newIn = convertToMultiLang(tc.input);
                            if (newIn !== tc.input) {
                                tc.input = newIn;
                                changed = true;
                            }
                        });
                    }
                });
            }
        });
    };

    if (Array.isArray(data)) {
        data.forEach(processObj);
    } else {
        processObj(data);
    }

    if (changed) {
        fs.writeFileSync(file, JSON.stringify(data, null, 2));
        console.log(`Converted test cases in ${file} to multi-language format.`);
    }
});
