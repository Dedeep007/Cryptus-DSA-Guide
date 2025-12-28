
import fs from 'fs';

const filePath = 'recursion-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newProblem = {
    "title": "Distinct Subsequences (Recursive)",
    "description": "Given a string consisting of lowercase English alphabets, find the number of distinct subsequences of the string. Return the answer modulo 10^9 + 7.",
    "difficulty": "medium",
    "testCases": [
        { "input": "\"gfg\"", "expectedOutput": "7" },
        { "input": "\"aba\"", "expectedOutput": "7" }
    ],
    "solutions": [
        { "language": "cpp", "code": "void solve(string& s, int index, string& temp, unordered_set<string>& st) {\n    if (index == s.size()) {\n        st.insert(temp);\n        return;\n    }\n    temp.push_back(s[index]);\n    solve(s, index + 1, temp, st);\n    temp.pop_back();\n    solve(s, index + 1, temp, st);\n}\nint distinctSubsequences(string s) {\n    unordered_set<string> st;\n    string temp = \"\";\n    solve(s, 0, temp, st);\n    return st.size() % (int)(1e9 + 7);\n}" },
        { "language": "c", "code": "// Recursive approach with backtracking to find all distinct subsequences." },
        { "language": "python", "code": "def distinctSubsequences(s):\n    st = set()\n    def solve(index, temp):\n        if index == len(s):\n            st.add(temp)\n            return\n        solve(index + 1, temp + s[index])\n        solve(index + 1, temp)\n    solve(0, \"\")\n    return len(st) % (10**9 + 7)" },
        { "language": "java", "code": "public int distinctSubsequences(String s) {\n    Set<String> st = new HashSet<>();\n    solve(s, 0, \"\", st);\n    return st.size() % (1000000007);\n}\nprivate void solve(String s, int index, String temp, Set<String> st) {\n    if (index == s.length()) {\n        st.add(temp);\n        return;\n    }\n    solve(s, index + 1, temp + s.charAt(index), st);\n    solve(s, index + 1, temp, st);\n}" },
        { "language": "javascript", "code": "function distinctSubsequences(s) {\n    let st = new Set();\n    function solve(index, temp) {\n        if (index === s.length) {\n            st.add(temp);\n            return;\n        }\n        solve(index + 1, temp + s[index]);\n        solve(index + 1, temp);\n    }\n    solve(0, \"\");\n    return st.size % (1000000007);\n}" }
    ]
};

data[0].problems.splice(6, 0, newProblem); // Insert at index 6 to match Striver's order
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added Distinct Subsequences to recursion-topic.json');
