
import fs from 'fs';

const filePath = 'dp-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newProblem = {
    "title": "Best Time to Buy and Sell Stock",
    "description": "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    "difficulty": "easy",
    "testCases": [
        { "input": "[7,1,5,3,6,4]", "expectedOutput": "5" }
    ],
    "solutions": [
        { "language": "cpp", "code": "int maxProfit(vector<int>& prices) {\n    int mini = prices[0], maxProfit = 0;\n    for (int i = 1; i < prices.size(); i++) {\n        int cost = prices[i] - mini;\n        maxProfit = max(maxProfit, cost);\n        mini = min(mini, prices[i]);\n    }\n    return maxProfit;\n}" }
    ]
};

data.push(newProblem);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added Best Time to Buy and Sell Stock to dp-topic.json to make it 50.');
