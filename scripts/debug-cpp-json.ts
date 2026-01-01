import fs from 'fs';
import path from 'path';

const jsonPath = path.join(process.cwd(), 'json_store', 'topic-jsons', 'tries.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const problem = data.problems.find((p: any) => p.title === 'Implement Trie (Prefix Tree)');
const cppSol = problem.solutions.find((s: any) => s.language === 'cpp');
console.log("CPP Solution Code:", cppSol ? cppSol.code : "Solution not found");
console.log("Code Type:", typeof cppSol?.code);
