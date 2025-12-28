
import fs from 'fs';

const filePath = 'binary-trees-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const representation = {
    "title": "Binary Tree Representation",
    "description": "Learn how to represent a binary tree in memory using nodes and pointers.",
    "difficulty": "easy",
    "testCases": [],
    "solutions": [{ "language": "cpp", "code": "struct Node {\n    int data;\n    struct Node *left, *right;\n    Node(int val) {\n        data = val;\n        left = right = NULL;\n    }\n};" }]
};

data.easy.push(representation);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added Binary Tree Representation to binary-trees-topic.json');
