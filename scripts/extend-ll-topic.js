
import fs from 'fs';

const filePath = 'linked-list-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const missingLL = [
    {
        "title": "Introduction to Doubly Linked List",
        "description": "Learn the structure and basics of a Doubly Linked List.",
        "difficulty": "easy",
        "testCases": [],
        "solutions": [{ "language": "cpp", "code": "struct Node {\n    int data;\n    Node *next, *back;\n    Node(int val) {\n        data = val;\n        next = back = NULL;\n    }\n};" }]
    },
    {
        "title": "Delete all occurrences of a key in DLL",
        "description": "Given a doubly linked list and a key x, delete all occurrences of x from the list.",
        "difficulty": "medium",
        "testCases": [],
        "solutions": [{ "language": "cpp", "code": "// Move through DLL and delete nodes matching key" }]
    },
    {
        "title": "Find pairs with given sum in DLL",
        "description": "Find all pairs in a sorted doubly linked list whose sum is equal to a given value k.",
        "difficulty": "medium",
        "testCases": [],
        "solutions": [{ "language": "cpp", "code": "// Use two pointers (head and tail) to find pairs" }]
    },
    {
        "title": "Remove duplicates from sorted DLL",
        "description": "Given a sorted doubly linked list, remove all duplicate nodes from it.",
        "difficulty": "medium",
        "testCases": [],
        "solutions": [{ "language": "cpp", "code": "// Skip over sequential duplicate nodes" }]
    }
];

data.problems.push(...missingLL);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added 4 missing LL problems to linked-list-topic.json');
