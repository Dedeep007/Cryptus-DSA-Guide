
import fs from 'fs';

function updateTestCases(filename, updates) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    const findAndReplace = (obj) => {
        let changed = false;
        const arrayKeys = ['problems', 'easy', 'medium', 'hard', 'learning'];
        for (const key of arrayKeys) {
            if (Array.isArray(obj[key])) {
                obj[key].forEach(p => {
                    const match = Object.keys(updates).find(u => u.trim() === p.title.trim());
                    if (match) {
                        p.testCases = updates[match];
                        console.log(`Updated test cases for: ${p.title} in ${filename}`);
                        changed = true;
                    }
                });
            }
        }
        return changed;
    };

    if (Array.isArray(data)) {
        data.forEach(item => findAndReplace(item));
    } else {
        findAndReplace(data);
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const btUpdates = {
    "Binary Tree Representation": [{ "input": "nodes = 7", "expectedOutput": "Tree with 7 nodes created" }],
    "All in One Traversal": [{ "input": "root = [1, 2, 3]", "expectedOutput": "In: [2,1,3], Pre: [1,2,3], Post: [2,3,1]" }]
};

const llUpdates = {
    "Introduction to Doubly Linked List": [{ "input": "arr = [1, 2, 3]", "expectedOutput": "1 <-> 2 <-> 3" }],
    "Delete all occurrences of a key in DLL": [{ "input": "arr = [1, 2, 3, 2, 4]\nkey = 2", "expectedOutput": "[1, 3, 4]" }],
    "Find pairs with given sum in DLL": [{ "input": "arr = [1, 2, 3, 4, 5]\nsum = 4", "expectedOutput": "[[1, 3]]" }],
    "Remove duplicates from sorted DLL": [{ "input": "arr = [1, 1, 2, 3, 3]", "expectedOutput": "[1, 2, 3]" }]
};

updateTestCases('binary-trees-topic.json', btUpdates);
updateTestCases('linked-list-topic.json', llUpdates);
