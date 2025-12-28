
import fs from 'fs';

let data = JSON.parse(fs.readFileSync('linked-list-topic.json', 'utf8'));
data.problems.forEach(p => {
    if (p.title.includes('Delete all occurrences')) {
        p.testCases = [{ "input": "arr = [1, 2, 3, 2, 4]\nkey = 2", "expectedOutput": "[1, 3, 4]" }];
        console.log('Updated Delete occurrences of a key in DLL');
    }
});
fs.writeFileSync('linked-list-topic.json', JSON.stringify(data, null, 2));
