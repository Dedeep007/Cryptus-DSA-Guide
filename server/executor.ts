/**
 * Robust Code Executor
 * Handles functions, classes, and various data structures for DSA problems
 */

import axios from 'axios';

const PISTON_URL = 'https://emkc.org/api/v2/piston/execute';

export interface ExecutionResult {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    error?: string;
    isHidden?: boolean;
}

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    cpp: { language: 'cpp', version: '10.2.0' },
    c: { language: 'c', version: '10.2.0' },
    python: { language: 'python', version: '3.10.0' },
    java: { language: 'java', version: '15.0.2' },
    javascript: { language: 'javascript', version: '18.15.0' },
};

// ==================== INPUT PARSING ====================

interface ParsedInput {
    variables: Record<string, string>;
    rawValues: string[];
}

function parseTestInput(inputStr: string): ParsedInput {
    const variables: Record<string, string> = {};
    const rawValues: string[] = [];
    const lines = inputStr.trim().split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
        // Check for assignment: name = value or name: value
        const match = line.match(/^['"]?([a-zA-Z_][a-zA-Z0-9_]*)['"]?\s*(?:\[\])?\s*[:=]\s*(.+)$/);
        if (match) {
            const name = match[1];
            let value = match[2].trim();
            // Normalize arrays: {1,2,3} -> [1,2,3]
            if (value.startsWith('{') && value.endsWith('}')) {
                value = '[' + value.slice(1, -1) + ']';
            }
            variables[name] = value;
        } else if (line) {
            // Raw value - try to detect type
            if (line.startsWith('[') || line.startsWith('{')) {
                rawValues.push(line.startsWith('{') ? '[' + line.slice(1, -1) + ']' : line);
            } else if (/^-?\d+$/.test(line)) {
                rawValues.push(line); // Integer
            } else if (/^-?\d+\.\d+$/.test(line)) {
                rawValues.push(line); // Float
            } else if (line.split(/\s+/).every(p => /^-?\d+$/.test(p))) {
                // Space-separated numbers -> array
                rawValues.push('[' + line.split(/\s+/).join(', ') + ']');
            } else {
                if ((line.startsWith('"') && line.endsWith('"')) || (line.startsWith("'") && line.endsWith("'"))) {
                    rawValues.push(line);
                } else {
                    rawValues.push(`"${line}"`); // String
                }
            }
        }
    }

    return { variables, rawValues };
}

// ==================== CODE ANALYSIS ====================


interface CodeAnalysis {
    type: 'function' | 'class' | 'unknown';
    mainName: string; // Function name or Class name
    entryPoint: string; // Method to call (if class)
    methods: string[];
    hasTreeNode: boolean;
    hasListNode: boolean;
    hasCustomNode: boolean;
    returnType: string;
    params: { name: string; type: string }[];
    isVoid: boolean;
}

export function analyzeCode(code: string, language: string): CodeAnalysis {
    const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

    const analysis: CodeAnalysis = {
        type: 'unknown',
        mainName: '',
        entryPoint: '',
        methods: [],
        hasTreeNode: /\bTreeNode\b/.test(cleanCode),
        hasListNode: /\bListNode\b/.test(cleanCode),
        hasCustomNode: /\bNode\b/.test(cleanCode) && !/\bTreeNode\b/.test(cleanCode) && !/\bListNode\b/.test(cleanCode),
        returnType: 'auto',
        params: [],
        isVoid: false
    };

    if (language === 'cpp' || language === 'c') {
        const classMatches = [...cleanCode.matchAll(/class\s+(\w+)\s*\{/g)];
        if (classMatches.length > 0) {
            analysis.type = 'class';
            // Heuristic to pick the main class
            const names = classMatches.map(m => m[1]);
            let bestName = names[0];
            if (names.includes('Solution')) bestName = 'Solution';
            else if (names.includes('Trie')) bestName = 'Trie';
            else if (names.includes('MinStack')) bestName = 'MinStack';
            else if (names.includes('MyStack')) bestName = 'MyStack';
            else if (names.includes('MyQueue')) bestName = 'MyQueue';
            else {
                // filter out helper node classes
                const candidate = names.find(n => !n.endsWith('Node') && n !== 'ListNode' && n !== 'TreeNode');
                if (candidate) bestName = candidate;
            }
            analysis.mainName = bestName;
            // Find public methods to determine entry point
            // Regex to find method signature: type name(params)
            const methodMatches = [...cleanCode.matchAll(/(?:public\s*:\s*)?(?:virtual\s+)?(\w+(?:<[^>]+>)?)\s+(\w+)\s*\(([^)]*)\)/g)];

            for (const m of methodMatches) {
                const returnT = m[1];
                const methodName = m[2];
                const paramsS = m[3];

                if (!['if', 'while', 'for', 'switch', 'return', analysis.mainName].includes(methodName)) {
                    analysis.methods.push(methodName);
                    // Heuristic: The solution method usually returns something, or is the only public method that isn't a constructor
                    // We'll take the first non-constructor candidate as the entry point
                    if (!analysis.entryPoint && methodName !== analysis.mainName) {
                        analysis.entryPoint = methodName;
                        analysis.returnType = returnT;
                        analysis.isVoid = /\bvoid\b/.test(returnT);
                        analysis.params = parseParams(paramsS);
                    }
                }
            }
        } else {
            // Function
            // console.log("Analyze C/Cpp function...");
            analysis.type = 'function';
            const funcMatches = [...cleanCode.matchAll(/(\w+(?:<[^>]+>)?(?:\s*[*&])?)\s+(\w+)\s*\(([^)]*)\)\s*(?:const)?\s*\{/g)];
            // console.log("Func matches:", funcMatches.length);
            for (const m of funcMatches) {
                const name = m[2];
                if (!['if', 'while', 'for', 'switch', 'return', 'main', 'using'].includes(name)) {
                    analysis.methods.push(name);
                    if (!analysis.mainName) {
                        analysis.mainName = name;
                        analysis.entryPoint = name;
                        analysis.returnType = m[1];
                        analysis.isVoid = /\bvoid\b/.test(m[1]);
                        analysis.params = parseParams(m[3]);
                    }
                }
            }
        }
    } else if (language === 'python') {
        const classMatch = cleanCode.match(/class\s+(\w+)\s*[:(]/);
        if (classMatch) {
            analysis.type = 'class';
            analysis.mainName = classMatch[1];
            const methodMatches = [...cleanCode.matchAll(/def\s+(\w+)\s*\(([^)]*)\)/g)];
            for (const m of methodMatches) {
                const methodName = m[1];
                if (methodName !== '__init__') {
                    analysis.methods.push(methodName);
                    if (!analysis.entryPoint) {
                        analysis.entryPoint = methodName;
                        analysis.params = m[2].split(',').map(p => {
                            const name = p.trim().split(':')[0].trim();
                            return { name, type: 'any' };
                        }).filter(p => p.name && p.name !== 'self');
                    }
                }
            }
        } else {
            analysis.type = 'function';
            const funcMatch = cleanCode.match(/def\s+(\w+)\s*\(([^)]*)\)/);
            if (funcMatch) {
                analysis.mainName = funcMatch[1];
                analysis.entryPoint = funcMatch[1];
                analysis.params = funcMatch[2].split(',').map(p => {
                    const name = p.trim().split(':')[0].trim();
                    return { name, type: 'any' };
                }).filter(p => p.name && p.name !== 'self');
            }
        }
    } else if (language === 'javascript') {
        // Basic support for class in JS (if used)
        const classMatch = cleanCode.match(/class\s+(\w+)/);
        if (classMatch) {
            analysis.type = 'class';
            analysis.mainName = classMatch[1];
            // Very basic method finding for JS classes
            const methodMatches = [...cleanCode.matchAll(/^\s*(\w+)\s*\(([^)]*)\)\s*\{/gm)];
            for (const m of methodMatches) {
                if (m[1] !== 'constructor') {
                    analysis.entryPoint = m[1];
                    analysis.params = m[2].split(',').map(p => ({ name: p.trim(), type: 'any' })).filter(p => p.name);
                    break;
                }
            }
        } else {
            analysis.type = 'function';
            const funcMatch = cleanCode.match(/function\s+(\w+)\s*\(([^)]*)\)/);
            if (funcMatch) {
                analysis.mainName = funcMatch[1];
                analysis.entryPoint = funcMatch[1];
                analysis.params = funcMatch[2].split(',').map(p => ({ name: p.trim(), type: 'any' })).filter(p => p.name);
            } else {
                // Try arrow function const name = (...) =>
                const arrowMatch = cleanCode.match(/(?:const|var|let)\s+(\w+)\s*=\s*(?:async\s*)?\(([^)]*)\)/);
                if (arrowMatch) {
                    analysis.mainName = arrowMatch[1];
                    analysis.entryPoint = arrowMatch[1];
                    analysis.params = arrowMatch[2].split(',').map(p => ({ name: p.trim(), type: 'any' })).filter(p => p.name);
                }
            }
        }
    } else if (language === 'java') {
        // console.log("Clean code for Java analysis:", cleanCode);
        const classMatch = cleanCode.match(/class\s+(\w+)/);
        // console.log("Class match:", classMatch);
        if (classMatch) {
            analysis.type = 'class';
            analysis.mainName = classMatch[1];
            const methodMatches = cleanCode.matchAll(/(?:public|private|protected)?\s*(?:static)?\s*(\w+(?:<[^>]+>)?)\s+(\w+)\s*\(([^)]*)\)/g);
            for (const m of methodMatches) {
                if (!['if', 'while', 'for'].includes(m[2]) && m[2] !== classMatch[1]) {
                    analysis.methods.push(m[2]);
                    if (!analysis.entryPoint) {
                        analysis.entryPoint = m[2];
                        analysis.returnType = m[1];
                        analysis.isVoid = m[1] === 'void';
                        analysis.params = parseParams(m[3]);
                    }
                }
            }
        } else {
            // Standalone method?
            analysis.type = 'function';
            const methodMatch = cleanCode.match(/(?:public|private|protected)?\s*(?:static)?\s*([a-zA-Z0-9_<>\[\]]+)\s+(\w+)\s*\(([^)]*)\)\s*\{/);
            if (methodMatch) {
                analysis.mainName = methodMatch[2];
                analysis.entryPoint = methodMatch[2];
                analysis.returnType = methodMatch[1];
                analysis.isVoid = methodMatch[1] === 'void';
                analysis.params = parseParams(methodMatch[3]);
            }
        }
    }

    return analysis;
}

function parseParams(paramStr: string): { name: string; type: string }[] {
    const params: { name: string; type: string }[] = [];
    const parts = paramStr.split(',');
    for (const part of parts) {
        const trimmed = part.trim();
        if (!trimmed) continue;

        // Find split between type and name
        const lastSpace = trimmed.lastIndexOf(' ');
        if (lastSpace !== -1) {
            let type = trimmed.substring(0, lastSpace).trim();
            let name = trimmed.substring(lastSpace + 1).replace(/[*&]/g, '').trim();

            // Handle C-style array syntax int arr[]
            if (name.endsWith('[]')) {
                name = name.slice(0, -2);
                type += '[]';
            }

            params.push({ type, name });
        }
    }
    return params;
}

// ==================== WRAPPER GENERATION ====================

export function generateWrapper(language: string, code: string, input: string): string {
    const parsed = parseTestInput(input);
    const analysis = analyzeCode(code, language);

    if (language === 'cpp') {
        return generateCppWrapper(code, parsed, analysis);
    } else if (language === 'python') {
        return generatePythonWrapper(code, parsed, analysis);
    } else if (language === 'javascript') {
        return generateJsWrapper(code, parsed, analysis);
    } else if (language === 'java') {
        return generateJavaWrapper(code, parsed, analysis);
    } else if (language === 'c') {
        return generateCWrapper(code, parsed, analysis);
    }

    return code;
}

function generateCppWrapper(code: string, parsed: ParsedInput, analysis: CodeAnalysis): string {
    const includes = `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <climits>
#include <cmath>
#include <queue>
#include <stack>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <sstream>
using namespace std;
`;

    // Helper structs
    let structs = '';
    const needsTreeNode = analysis.hasTreeNode && !code.includes('struct TreeNode');
    const needsListNode = analysis.hasListNode && !code.includes('struct ListNode');

    if (needsTreeNode) {
        structs += `
struct TreeNode {
    int val;
    TreeNode *left, *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *l, TreeNode *r) : val(x), left(l), right(r) {}
};
`;
    }
    if (needsListNode) {
        structs += `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *n) : val(x), next(n) {}
};
`;
    }

    // Helper functions
    let helpers = `
// Helper: print vector
template<typename T>
void printVec(const vector<T>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << ", ";
        cout << v[i];
    }
    cout << "]";
}

// Helper: print 2D vector
template<typename T>
void printVec2D(const vector<vector<T>>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << ", ";
        printVec(v[i]);
    }
    cout << "]";
}
`;

    if (analysis.hasTreeNode) {
        helpers += `
// Helper: build tree from array
TreeNode* buildTree(vector<int>& v) {
    if (v.empty() || v[0] == -1001) return nullptr;
    TreeNode* root = new TreeNode(v[0]);
    queue<TreeNode*> q; q.push(root);
    int i = 1;
    while (!q.empty() && i < (int)v.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)v.size() && v[i] != -1001) {
            node->left = new TreeNode(v[i]);
            q.push(node->left);
        }
        i++;
        if (i < (int)v.size() && v[i] != -1001) {
            node->right = new TreeNode(v[i]);
            q.push(node->right);
        }
        i++;
    }
    return root;
}

// Helper: print tree (level order)
void printTree(TreeNode* root) {
    if (!root) { cout << "[]"; return; }
    vector<int> res;
    queue<TreeNode*> q; q.push(root);
    while (!q.empty()) {
        TreeNode* n = q.front(); q.pop();
        if (n) {
            res.push_back(n->val);
            q.push(n->left); q.push(n->right);
        } else res.push_back(-1001);
    }
    while (!res.empty() && res.back() == -1001) res.pop_back();
    cout << "[";
    for (size_t i = 0; i < res.size(); i++) {
        if (i > 0) cout << ", ";
        if (res[i] == -1001) cout << "null";
        else cout << res[i];
    }
    cout << "]";
}
`;
    }

    if (analysis.hasListNode) {
        helpers += `
// Helper: build list from array
ListNode* buildList(vector<int>& v) {
    if (v.empty()) return nullptr;
    ListNode* head = new ListNode(v[0]);
    ListNode* curr = head;
    for (int i = 1; i < (int)v.size(); i++) {
        curr->next = new ListNode(v[i]);
        curr = curr->next;
    }
    return head;
}

// Helper: print list
void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val;
        if (head->next) cout << ", ";
        head = head->next;
    }
    cout << "]";
}
`;
    }

    let mainBody = '';
    const varDecls: string[] = [];
    const allVars = { ...parsed.variables };

    if (Object.keys(allVars).length === 0 && parsed.rawValues.length > 0) {
        const mapped = mapValuesToParams(parsed.rawValues, analysis.params, 'cpp');
        Object.assign(allVars, mapped);
    }

    for (const [name, value] of Object.entries(allVars)) {
        const decl = generateCppVarDecl(name, value, analysis);
        if (decl) varDecls.push(decl);
    }
    mainBody += varDecls.join('\n    ');

    const args = analysis.params.map((p, i) => {
        const matchesType = (val: string, type: string) => {
            const isVector = type.includes('vector') || type.includes('[]') || type.includes('*');
            const isArrayStr = val.trim().startsWith('[');
            if (isVector && !isArrayStr) return false;
            if ((type.includes('vector') || type.includes('[]')) && !isArrayStr) return false;
            return true;
        };
        let argName = p.name;
        let found = false;
        if (allVars[p.name] && matchesType(allVars[p.name], p.type)) {
            argName = p.name;
            found = true;
        } else {
            const aliases: Record<string, string[]> = {
                'nums': ['arr', 'a', 'array'],
                'arr': ['nums', 'a', 'array'],
                'n': ['size', 'len', 'numsSize'],
                'target': ['k', 'sum', 'x'],
                's': ['str', 'string', 's1'],
                't': ['str2', 's2'],
            };
            for (const alias of (aliases[p.name] || [])) {
                if (allVars[alias] && matchesType(allVars[alias], p.type)) {
                    argName = alias;
                    found = true;
                    break;
                }
            }
            if (!found) {
                if (allVars[`arg${i}`] && matchesType(allVars[`arg${i}`], p.type)) {
                    argName = `arg${i}`;
                    found = true;
                }
            }
        }
        if (['n', 'm', 'size', 'len'].includes(p.name.toLowerCase()) && !found) {
            for (const [vn, vv] of Object.entries(allVars)) {
                if (vv.startsWith('[')) {
                    return `${vn}.size()`;
                }
            }
        }
        if ((p.type.includes('*') || p.type.includes('[]')) && allVars[argName] && allVars[argName].trim().startsWith('[')) {
            return `${argName}.data()`;
        }
        return argName;
    });

    if (analysis.type === 'class') {
        if (parsed.rawValues.length >= 2 && parsed.rawValues[0].startsWith('[') && parsed.rawValues[1].startsWith('[')) {
            let commands: string[] = [];
            let params: any[] = [];
            try {
                commands = JSON.parse(parsed.rawValues[0]);
                params = JSON.parse(parsed.rawValues[1]);
            } catch (e) { }

            if (commands.length > 0 && commands.length === params.length) {
                // Trust the test case! Use the first command as the class name.
                // This handles cases where helper classes (like TrieNode) appear before the main class (Trie).
                if (commands[0] !== analysis.mainName) {
                    console.log(`Switching mainName from ${analysis.mainName} to ${commands[0]}`);
                    analysis.mainName = commands[0];
                }

                console.log(`Checking matching: ${commands[0]} === ${analysis.mainName} -> ${commands[0] === analysis.mainName}`);

                if (commands[0] === analysis.mainName) {
                    mainBody += `\n    ${analysis.mainName} obj;`;
                    mainBody += `\n    vector<string> results;`;

                    for (let i = 0; i < commands.length; i++) {
                        const cmd = commands[i];
                        const argsIter = params[i];
                        if (i === 0) {
                            mainBody += `\n    results.push_back("null");`;
                            continue;
                        }

                        const methodRegex = new RegExp(`(?:val|void|int|bool|string|double|float|vector<[^>]+>|ListNode\\*|TreeNode\\*)\\s+${cmd}\\s*\\(`);
                        const match = code.match(methodRegex);
                        const isVoid = match ? match[0].includes('void') : (cmd === 'insert' || cmd === 'push' || cmd === 'pop' || cmd === 'update');

                        const formattedArgs = argsIter.map((a: any) => {
                            if (typeof a === 'string') return `"${a}"`;
                            if (Array.isArray(a)) return `{${a.join(',')}}`;
                            return a;
                        }).join(', ');

                        if (isVoid) {
                            mainBody += `\n    obj.${cmd}(${formattedArgs});`;
                            mainBody += `\n    results.push_back("null");`;
                        } else {
                            mainBody += `\n    auto res${i} = obj.${cmd}(${formattedArgs});`;
                            mainBody += `\n    stringstream ss${i};`;
                            mainBody += `\n    ss${i} << boolalpha << res${i};`;
                            mainBody += `\n    results.push_back(ss${i}.str());`;
                        }
                    }
                    mainBody += `\n    cout << "[";`;
                    mainBody += `\n    for(int i=0; i<results.size(); i++) {`;
                    mainBody += `\n        if(i>0) cout << ", ";`;
                    mainBody += `\n        if(results[i] == "null") cout << "null";`;
                    mainBody += `\n        else if(results[i] == "true" || results[i] == "false") cout << results[i];`;
                    mainBody += `\n        else cout << results[i];`;
                    mainBody += `\n    }`;
                    mainBody += `\n    cout << "]" << endl;`;

                    return `${includes}\n${structs}\n${helpers}\n${code}\n\nint main() {\n    ${mainBody}\n    return 0;\n}`;
                }
            }
        }

        const invocation = args.join(', ');
        mainBody += `\n    ${analysis.mainName} obj;`;
        if (analysis.isVoid) {
            mainBody += `\n    obj.${analysis.entryPoint}(${invocation});`;
            mainBody += `\n    cout << "Class method executed" << endl;`;
        } else {
            mainBody += `\n    auto result = obj.${analysis.entryPoint}(${invocation});`;
            if (analysis.returnType.includes('ListNode')) mainBody += `\n    printList(result);`;
            else if (analysis.returnType.includes('TreeNode')) mainBody += `\n    printTree(result);`;
            else if (analysis.returnType.includes('vector<vector')) mainBody += `\n    printVec2D(result);`;
            else if (analysis.returnType.includes('vector')) mainBody += `\n    printVec(result);`;
            else if (analysis.returnType.includes('bool')) mainBody += `\n    cout << (result ? "true" : "false") << endl;`;
            else mainBody += `\n    cout << result << endl;`;
        }
    } else {
        if (analysis.isVoid) {
            mainBody += `\n    ${analysis.mainName}(${args.join(', ')});`;
            const arrParam = analysis.params.find(p => p.type.includes('vector') || p.type.includes('[]'));
            if (arrParam && allVars[arrParam.name]) {
                mainBody += `\n    printVec(${arrParam.name});`;
            } else {
                mainBody += `\n    cout << "void" << endl;`;
            }
        } else {
            mainBody += `\n    auto result = ${analysis.mainName}(${args.join(', ')});`;
            if (analysis.returnType.includes('ListNode')) mainBody += `\n    printList(result);`;
            else if (analysis.returnType.includes('TreeNode')) mainBody += `\n    printTree(result);`;
            else if (analysis.returnType.includes('vector<vector')) mainBody += `\n    printVec2D(result);`;
            else if (analysis.returnType.includes('vector')) mainBody += `\n    printVec(result);`;
            else if (analysis.returnType.includes('bool')) mainBody += `\n    cout << (result ? "true" : "false") << endl;`;
            else mainBody += `\n    cout << result << endl;`;
        }
    }

    return `${includes}\n${structs}\n${helpers}\n${code}\n\nint main() {\n    ${mainBody}\n    return 0;\n}`;
}

function generateCppVarDecl(name: string, value: string, analysis: CodeAnalysis): string {
    const val = value.trim();

    // Handle null
    if (val === 'null' || val === 'nullptr') {
        return `auto ${name} = nullptr;`;
    }

    // Array/vector
    if (val.startsWith('[')) {
        const inner = val.slice(1, -1).trim();
        // 2D array
        if (inner.includes('[')) {
            const rows = val.match(/\[[^\[\]]*\]/g) || [];
            const formatted = rows.map(r => `{${r.slice(1, -1)}}`).join(', ');
            // Detect inner type
            if (formatted.includes('"')) {
                return `vector<vector<string>> ${name} = {${formatted}};`;
            } else if (formatted.includes("'")) {
                return `vector<vector<char>> ${name} = {${formatted}};`;
            }
            return `vector<vector<int>> ${name} = {${formatted}};`;
        }

        // Detect type from elements
        if (inner.includes('"')) {
            return `vector<string> ${name} = {${inner}};`;
        } else if (inner.includes("'")) {
            return `vector<char> ${name} = {${inner}};`;
        }

        // Check if building tree or list
        const param = analysis.params.find(p => p.name === name ||
            ['root', 'head', 'tree', 'list'].includes(name.toLowerCase()));
        if (param) {
            if (param.type.includes('TreeNode') || (analysis.hasTreeNode && name === 'root')) {
                return `vector<int> ${name}_arr = {${inner.replace(/null/gi, '-1001')}};\nTreeNode* ${name} = buildTree(${name}_arr);`;
            }
            if (param.type.includes('ListNode') || (analysis.hasListNode && name === 'head')) {
                return `vector<int> ${name}_arr = {${inner}};\nListNode* ${name} = buildList(${name}_arr);`;
            }
        }
        return `vector<int> ${name} = {${inner}};`;
    }

    // String
    if (val.startsWith('"') || val.startsWith("'")) {
        return `string ${name} = ${val.startsWith("'") ? '"' + val.slice(1, -1) + '"' : val};`;
    }

    // Boolean
    if (val === 'true' || val === 'false') {
        return `bool ${name} = ${val};`;
    }

    // Number
    if (!isNaN(Number(val))) {
        if (val.includes('.')) {
            return `double ${name} = ${val};`;
        }
        // Check if it's a large number
        if (Math.abs(Number(val)) > 2147483647) {
            return `long long ${name} = ${val}LL;`;
        }
        return `int ${name} = ${val};`;
    }

    return `auto ${name} = ${val};`;
}


function generatePythonWrapper(code: string, parsed: ParsedInput, analysis: CodeAnalysis): string {
    let wrapper = `import collections
from collections import deque, Counter, defaultdict
import heapq
import math
import json
from typing import *

`;

    // Add code
    wrapper += code + '\n\n';

    // DETECT TRANSACTION PATTERN
    if (parsed.rawValues.length >= 2 && parsed.rawValues[0].startsWith('[') && parsed.rawValues[1].startsWith('[')) {
        let commands: string[] = [];
        let params: any[] = [];
        try {
            commands = JSON.parse(parsed.rawValues[0]);
            params = JSON.parse(parsed.rawValues[1]);
        } catch (e) { }

        if (commands.length > 0 && commands.length === params.length) {
            // Ensure correct class name usage
            if (commands[0] !== analysis.mainName && new RegExp(`class\\s+${commands[0]}\\b`).test(code)) {
                analysis.mainName = commands[0];
            }

            if (commands[0] === analysis.mainName) {
                wrapper += `
results = []
obj = ${analysis.mainName}()
results.append("null")
`;
                wrapper += `commands = ${JSON.stringify(commands).replace(/"/g, "'")}\n`;
                wrapper += `params = ${JSON.stringify(params)}\n`;

                wrapper += `
for i in range(1, len(commands)):
    cmd = commands[i]
    args = params[i]
    if cmd == 'get' or cmd == 'search' or cmd == 'startsWith' or cmd == 'top' or cmd == 'peek' or cmd == 'empty' or cmd == 'hasNext' or cmd == 'next' or cmd == 'param_1':
        try:
            method = getattr(obj, cmd)
            res = method(*args)
            if res is True: results.append("true")
            elif res is False: results.append("false")
            elif res is None: results.append("null")
            else: results.append(str(res))
        except Exception as e:
            results.append("null")
    else:
        try:
            method = getattr(obj, cmd)
            method(*args)
            results.append("null")
        except Exception as e:
            results.append("null")

print("[" + ", ".join(results) + "]")
`;
                return wrapper;
            }
        }
    }

    // Build variables
    let allVars = { ...parsed.variables };
    if (Object.keys(allVars).length === 0) {
        if (parsed.rawValues.length > 0) {
            const mapped = mapValuesToParams(parsed.rawValues, analysis.params, 'python');
            allVars = { ...allVars, ...mapped };

            // If any params unmapped, fill remaining sequentially? mapValuesToParams handles fallback.
        }
    }

    for (const [name, value] of Object.entries(allVars)) {
        wrapper += `${name} = ${value}\n`;
    }

    // Call function
    if (analysis.type === 'function' && analysis.mainName) {
        const args = analysis.params.map(p => {
            if (allVars[p.name]) return p.name;
            return Object.keys(allVars).find(k => k.toLowerCase() === p.name.toLowerCase()) || p.name;
        });
        wrapper += `result = ${analysis.mainName}(${args.join(', ')})\n`;
        wrapper += `if isinstance(result, list):
    print('[' + ', '.join(str(x) for x in result) + ']')
elif isinstance(result, bool):
    print('true' if result else 'false')
else:
    print(result)
`;
    } else if (analysis.type === 'class') {
        wrapper += `obj = ${analysis.mainName}()\nprint('Class instantiated')`;
    }

    return wrapper;
}

function generateJsWrapper(code: string, parsed: ParsedInput, analysis: CodeAnalysis): string {
    let wrapper = code + '\n\n';

    // DETECT TRANSACTION PATTERN
    if (parsed.rawValues.length >= 2 && parsed.rawValues[0].startsWith('[') && parsed.rawValues[1].startsWith('[')) {
        let commands: string[] = [];
        let params: any[] = [];
        try {
            commands = JSON.parse(parsed.rawValues[0]);
            params = JSON.parse(parsed.rawValues[1]);
        } catch (e) { }

        if (commands.length > 0 && commands.length === params.length) {
            if (commands[0] !== analysis.mainName && new RegExp(`class\\s+${commands[0]}\\b`).test(code)) {
                analysis.mainName = commands[0];
            }

            if (commands[0] === analysis.mainName) {
                wrapper += `
const results = [];
const obj = new ${analysis.mainName}();
results.push("null");

const commands = ${JSON.stringify(commands)};
const params = ${JSON.stringify(params)};

for (let i = 1; i < commands.length; i++) {
    const cmd = commands[i];
    const args = params[i];
    
    // Check if method exists
    if (typeof obj[cmd] === 'function') {
        const res = obj[cmd](...args);
        
        if (res === undefined || res === null) {
            results.push("null");
        } else if (res === true) {
            results.push("true");
        } else if (res === false) {
            results.push("false");
        } else {
            results.push(res.toString());
        }
    } else {
        results.push("null");
    }
}

console.log("[" + results.join(", ") + "]");
`;
                return wrapper;
            }
        }
    }

    let allVars = { ...parsed.variables };
    if (Object.keys(allVars).length === 0) {
        if (parsed.rawValues.length > 0) {
            const mapped = mapValuesToParams(parsed.rawValues, analysis.params, 'javascript');
            allVars = { ...allVars, ...mapped };
        }
    }

    for (const [name, value] of Object.entries(allVars)) {
        wrapper += `const ${name} = ${value};\n`;
    }

    if (analysis.type === 'function' && analysis.mainName) {
        const args = analysis.params.map(p => allVars[p.name] ? p.name : Object.keys(allVars)[0] || p.name);
        wrapper += `const result = ${analysis.mainName}(${args.join(', ')});\n`;
        wrapper += `if (Array.isArray(result)) {
    console.log('[' + result.join(', ') + ']');
} else if (typeof result === 'boolean') {
    console.log(result ? 'true' : 'false');
} else {
    console.log(result);
}`;
    }

    return wrapper;
}

function generateJavaWrapper(code: string, parsed: ParsedInput, analysis: CodeAnalysis): string {
    // Remove public from classes to avoid file name issues
    let cleanCode = code.replace(/public\s+class/g, 'class');

    let wrapper = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
`;

    // DETECT TRANSACTION PATTERN
    let isTransaction = false;
    if (parsed.rawValues.length >= 2 && parsed.rawValues[0].startsWith('[') && parsed.rawValues[1].startsWith('[')) {
        let commands: string[] = [];
        let params: any[] = [];
        try {
            commands = JSON.parse(parsed.rawValues[0]);
            params = JSON.parse(parsed.rawValues[1]);
        } catch (e) { }

        if (commands.length > 0 && commands.length === params.length) {
            if (commands[0] === analysis.mainName || (commands[0] !== analysis.mainName && code.includes(`class ${commands[0]}`))) {
                // Update main name if it matches command
                if (commands[0] !== analysis.mainName && code.includes(`class ${commands[0]}`)) {
                    analysis.mainName = commands[0];
                }
                if (commands[0] === analysis.mainName) {
                    isTransaction = true;
                    wrapper += `        ${analysis.mainName} obj = new ${analysis.mainName}();\n`;
                    wrapper += `        List<String> results = new ArrayList<>();\n`;
                    wrapper += `        results.add("null");\n`;

                    for (let i = 1; i < commands.length; i++) {
                        const cmd = commands[i];
                        const args = params[i]; // Array of args

                        // Heuristic for return type: get/search/is -> print, others -> void
                        // Better: use 'isVoid' from analysis if we can find the method.
                        // But analysis.methods is just a list of names.

                        // Let's assume common void prefixes or assume void if not a query
                        const isQuery = cmd.startsWith('get') || cmd.startsWith('search') || cmd.startsWith('is') || cmd.startsWith('top') || cmd.startsWith('peek') || cmd.startsWith('param') || cmd.startsWith('startsWith');

                        const argsFormatted = args.map((a: any) => {
                            if (typeof a === 'string') return `"${a}"`;
                            if (Array.isArray(a)) return `{${a.join(',')}}`; // Java array init? No, usually arguments are primitives or objects.
                            // If arg is array, it might be messy.
                            return a;
                        }).join(', ');

                        if (isQuery) {
                            wrapper += `        results.add(String.valueOf(obj.${cmd}(${argsFormatted})));\n`;
                        } else {
                            wrapper += `        obj.${cmd}(${argsFormatted});\n`;
                            wrapper += `        results.add("null");\n`;
                        }
                    }

                    wrapper += `        System.out.print("[");\n`;
                    wrapper += `        for(int i=0; i<results.size(); i++) {\n`;
                    wrapper += `            if(i > 0) System.out.print(", ");\n`;
                    wrapper += `            String res = results.get(i);\n`;
                    wrapper += `            if(res.equals("true") || res.equals("false")) System.out.print(res);\n`;
                    wrapper += `            else if(res.equals("null")) System.out.print("null");\n`;
                    wrapper += `            else System.out.print(res);\n`;
                    wrapper += `        }\n`;
                    wrapper += `        System.out.println("]");\n`;

                    wrapper += `    }\n}`;
                    // Append user code at the end
                    wrapper += `\n${cleanCode}\n`;
                    return wrapper;
                }
            }
        }
    }

    let allVars = { ...parsed.variables };
    if (Object.keys(allVars).length === 0) {
        if (parsed.rawValues.length > 0) {
            const mapped = mapValuesToParams(parsed.rawValues, analysis.params, 'java');
            allVars = { ...allVars, ...mapped };
        }
    }

    for (const [name, value] of Object.entries(allVars)) {
        if (value.startsWith('[')) {
            const inner = value.slice(1, -1);
            wrapper += `        int[] ${name} = {${inner}};\n`;
        } else if (!isNaN(Number(value))) {
            wrapper += `        int ${name} = ${value};\n`;
        } else {
            wrapper += `        String ${name} = ${value};\n`;
        }
    }

    if (analysis.type === 'function' && analysis.mainName) {
        const args = analysis.params.map(p => p.name);
        wrapper += `        Main sol = new Main();\n`;
        wrapper += `        System.out.println(sol.${analysis.mainName}(${args.join(', ')}));\n`;
    }

    wrapper += `    }\n`; // Close main method

    if (analysis.type === 'function') {
        wrapper += `\n${cleanCode}\n`; // Inside Main class
        wrapper += `}`; // Close Main class
    } else {
        wrapper += `}\n`; // Close Main class
        wrapper += `\n${cleanCode}\n`; // Outside Main class
    }

    return wrapper;
}



function generateCWrapper(code: string, parsed: ParsedInput, analysis: CodeAnalysis): string {
    // Basic C wrapper, no transaction support added yet as it's complex
    let wrapper = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>

${code}

int main() {
`;

    let allVars = { ...parsed.variables };
    if (Object.keys(allVars).length === 0) {
        if (parsed.rawValues.length > 0) {
            const mapped = mapValuesToParams(parsed.rawValues, analysis.params, 'c');
            allVars = { ...allVars, ...mapped };
        }
    }

    for (const [name, value] of Object.entries(allVars)) {
        if (value.trim().startsWith('[')) {
            const inner = value.slice(1, -1);
            wrapper += `    int ${name}[] = {${inner}};\n`;
            wrapper += `    int ${name}_size = sizeof(${name})/sizeof(${name}[0]);\n`;
        } else if (!isNaN(Number(value))) {
            wrapper += `    int ${name} = ${value};\n`;
        } else {
            // String
            wrapper += `    char* ${name} = "${value}";\n`;
        }
    }

    // DETECT TRANSACTION PATTERN
    if (parsed.rawValues.length >= 2 && parsed.rawValues[0].startsWith('[') && parsed.rawValues[1].startsWith('[')) {
        let commands: string[] = [];
        let params: any[] = [];
        try {
            commands = JSON.parse(parsed.rawValues[0]);
            params = JSON.parse(parsed.rawValues[1]);
        } catch (e) { }

        if (commands.length > 0) {
            // Assume first command is constructor
            // The structure in C usually has:
            // Struct Name (e.g. Trie)
            // Create func (e.g. trieCreate)
            // Methods takes obj* as first arg (e.g. trieInsert(Trie* obj, ...))

            // Find create function
            // Or 'create' + ClassName, or just look for a function returning the Struct*
            // But usually LeetCode C style is: ClassName* classNameCreate()

            // We need to map "Trie" -> "trieCreate"
            // And "insert" -> "trieInsert"

            const className = commands[0];
            const objName = "obj";

            // Infer function names
            // Constructor: trieCreate or similar. 
            // We can look at analysis.mainName/methods if we had full C analysis, but we rely on standard conventions or brute force mapping.

            // Heuristic function to find the correct C function name
            const prefix = className.toLowerCase();
            const findMethod = (cmd: string): string => {
                const candidates = [
                    prefix + cmd.charAt(0).toUpperCase() + cmd.slice(1), // trieInsert
                    cmd, // countWordsEqualTo
                    prefix + '_' + cmd, // trie_insert (rare but possible)
                    prefix + cmd // trieinsert
                ];

                // If analysis.methods is available, use it to validate
                if (analysis.methods && analysis.methods.length > 0) {
                    for (const cand of candidates) {
                        if (analysis.methods.includes(cand)) return cand;
                    }
                    // Fuzzy match?
                    const lowerCmd = cmd.toLowerCase();
                    const match = analysis.methods.find(m => m.toLowerCase().endsWith(lowerCmd));
                    if (match) return match;
                }

                return candidates[0]; // Default to prefixed
            };

            let createFunc = findMethod('create');
            if (!createFunc) {
                // Try to guess: prefix + Create, or just 'create'
                const candidates = [prefix + 'Create', prefix + '_create', 'create'];
                for (const c of candidates) {
                    if (code.includes(c)) {
                        createFunc = c;
                        break;
                    }
                }
                if (!createFunc) createFunc = prefix + 'Create'; // Ultimate fallback
            }

            wrapper += `    // Transaction execution\n`;
            wrapper += `    printf("[");\n`;

            wrapper += `    ${className}* ${objName} = ${createFunc}();\n`;
            wrapper += `    printf("null");\n`; // Constructor result

            for (let i = 1; i < commands.length; i++) {
                const cmd = commands[i];
                const args = params[i];
                const method = findMethod(cmd);

                wrapper += `    printf(", ");\n`;

                // Generate args string
                const argStr = args.map((a: any) => {
                    if (typeof a === 'string') return `"${a}"`;
                    return a;
                }).join(', ');

                // Call method
                // We need to know return type.
                // Void returns "null".
                // Bool returns true/false.
                // Int returns number.

                // Simple regex check for return type of the method in the code
                const methodRegex = new RegExp(`(void|bool|int|double|char\\*|string)\\s+${method}\\s*\\(`);
                const match = code.match(methodRegex);
                const retType = match ? match[1] : (method === 'completeString' ? 'char*' : 'void'); // default to void if not found

                if (retType === 'void') {
                    wrapper += `    ${method}(${objName}${args.length > 0 ? ', ' + argStr : ''});\n`;
                    wrapper += `    printf("null");\n`;
                } else if (retType === 'bool') {
                    wrapper += `    printf("%s", ${method}(${objName}${args.length > 0 ? ', ' + argStr : ''}) ? "true" : "false");\n`;
                } else if (retType === 'int') {
                    wrapper += `    printf("%d", ${method}(${objName}${args.length > 0 ? ', ' + argStr : ''}));\n`;
                } else if (retType === 'char*' || retType === 'char *') {
                    // Strings in JSON output should be quoted if not null/true/false, but here we expect just the value if result check compares raw strings?
                    // Actually output comparison usually expects unquoted unless it's a string type in JSON
                    // But in executeCode we normalize.
                    // Let's print bare string first.
                    wrapper += `    printf("\\"%s\\"", ${method}(${objName}${args.length > 0 ? ', ' + argStr : ''}));\n`;
                } else {
                    // fallback
                    wrapper += `    ${method}(${objName}${args.length > 0 ? ', ' + argStr : ''});\n`;
                    wrapper += `    printf("null");\n`;
                }
            }

            wrapper += `    printf("]\\n");\n`;
            wrapper += `    return 0;\n`;
            wrapper += `}\n`;
            return wrapper;
        }
    }

    if (analysis.type === 'function' && analysis.mainName) {
        const args = analysis.params.map(p => {
            if (allVars[p.name]) return p.name;
            // Try to match strict size param
            if (p.name === 'n' || p.name === 'size' || p.name.includes('Size')) {
                // Find array param corresponding?
                // Or if we have mapped it already?
                // If mapValuesToParams worked, it should be in allVars.
                // But mapValuesToParams maps VALUES.
                // If 'n' was mapped to value '5', it returns 'n'.
                // If 'n' was NOT mapped (e.g. implicit size), we need to derive it.
                // But in C usually size IS passed.
                // Let's assume mapValuesToParams did its job.
            }
            return p.name; // Fallback
        });

        // Print result based on return type
        if (analysis.isVoid) {
            wrapper += `    ${analysis.mainName}(${args.join(', ')});\n`;
            // Check if we need to print arrays modified in place?
            // For now just void.
            wrapper += `    printf("void");\n`; // Or verify output
        } else {
            if (analysis.returnType.includes('char*') || analysis.returnType.includes('char *')) {
                wrapper += `    char* result = ${analysis.mainName}(${args.join(', ')});\n`;
                // For Complete String problem, output is string.
                wrapper += `    printf("%s", result);\n`;
            } else if (analysis.returnType === 'int') {
                wrapper += `    int result = ${analysis.mainName}(${args.join(', ')});\n`;
                wrapper += `    printf("%d", result);\n`;
            } else if (analysis.returnType === 'bool') {
                wrapper += `    bool result = ${analysis.mainName}(${args.join(', ')});\n`;
                wrapper += `    printf("%s", result ? "true" : "false");\n`;
            } else {
                wrapper += `    printf("Result");\n`; // Fallback
            }
        }
    }

    wrapper += `    return 0;
}`;

    return wrapper;
}

// ==================== HELPER FUNCTIONS ====================

function mapValuesToParams(values: string[], params: { name: string, type: string }[], language: string): Record<string, string> {
    const map: Record<string, string> = {};
    const consumed = new Array(values.length).fill(false);

    // Heuristics
    const isArrayType = (type: string) => type.includes('[]') || type.includes('vector') || type.includes('List') || type.includes('Array');
    const isArrayVal = (val: string) => val.trim().startsWith('[');
    const isIntType = (type: string) => type === 'int' || type === 'long' || type === 'Integer' || type === 'size_t';
    const isIntVal = (val: string) => /^-?\d+$/.test(val.trim());

    for (const param of params) {
        let matchedIdx = -1;

        // 1. Precise Type Match (if typed)
        if (language === 'cpp' || language === 'java' || language === 'c') {
            if (isArrayType(param.type)) {
                matchedIdx = values.findIndex((v, i) => !consumed[i] && isArrayVal(v));
            } else if (isIntType(param.type)) {
                matchedIdx = values.findIndex((v, i) => !consumed[i] && isIntVal(v) && !isArrayVal(v)); // Ensure int doesn't match single element array if ambiguous, but isArrayVal checks start with [
            }
        }

        // 2. Name Heuristic (for untyped or fallback)
        if (matchedIdx === -1) {
            if (['arr', 'nums', 'list', 'vector', 'matrix'].some(s => param.name.toLowerCase().includes(s))) {
                matchedIdx = values.findIndex((v, i) => !consumed[i] && isArrayVal(v));
            } else if (['n', 'm', 'size', 'len', 'target', 'k', 'val'].some(s => param.name === s || param.name.toLowerCase().includes(s))) {
                matchedIdx = values.findIndex((v, i) => !consumed[i] && isIntVal(v));
            }
        }

        // 3. Fallback: First available
        if (matchedIdx === -1) {
            matchedIdx = values.findIndex((v, i) => !consumed[i]);
        }

        if (matchedIdx !== -1) {
            consumed[matchedIdx] = true;
            map[param.name] = values[matchedIdx];
        }
    }
    return map;
}

// ==================== OUTPUT NORMALIZATION ====================

function normalizeOutput(str: string): string {
    let normalized = str.trim().toLowerCase();
    // Remove brackets and special chars for comparison
    normalized = normalized.replace(/[\[\]{},()]/g, '');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    // Handle trailing zeros
    if (/^\d+\.0+$/.test(normalized)) {
        normalized = normalized.replace(/\.0+$/, '');
    }
    return normalized;
}

function compareOutputs(actual: string, expected: string): boolean {
    const normActual = normalizeOutput(actual);
    const normExpected = normalizeOutput(expected);

    // Direct match
    if (normActual === normExpected) return true;

    // Boolean conversion
    if ((normExpected === 'true' && normActual === '1') ||
        (normExpected === 'false' && normActual === '0')) {
        return true;
    }

    // Sorted comparison for arrays (some problems have order-independent output)
    const sortStr = (s: string) => s.split(' ').sort((a, b) => Number(a) - Number(b)).join(' ');
    if (sortStr(normActual) === sortStr(normExpected)) return true;

    return false;
}

// ==================== MAIN EXECUTION ====================

async function requestWithRetry(config: any, retries = 2): Promise<any> {
    try {
        return await axios(config);
    } catch (err: any) {
        const isRateLimit = err.response?.status === 429 ||
            (err.response?.status === 400 && err.response?.data?.message?.includes('Requests limited'));

        if (retries > 0 && (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED' || isRateLimit)) {
            await new Promise(r => setTimeout(r, 2000));
            return requestWithRetry(config, retries - 1);
        }
        throw err;
    }
}

export async function executeCode(
    language: string,
    code: string,
    testCases: { input: string; output: string }[],
    isHiddenMap: boolean[] = []
): Promise<ExecutionResult[]> {
    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const results: ExecutionResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const isHidden = isHiddenMap[i] || false;

        // Rate limit buffer
        await new Promise(r => setTimeout(r, 300));

        try {
            const wrappedCode = generateWrapper(language, code, tc.input);

            if (process.env.DEBUG_EXECUTOR) {
                console.log("--- WRAPPED CODE ---");
                console.log(wrappedCode);
                console.log("--------------------");
            }

            const response = await requestWithRetry({
                method: 'post',
                url: PISTON_URL,
                data: {
                    language: langConfig.language,
                    version: langConfig.version,
                    files: [{ name: language === 'java' ? 'Main.java' : undefined, content: wrappedCode }],
                },
                timeout: 15000,
            });

            const output = response.data.run.output?.trim() || "";
            const stderr = response.data.run.stderr || "";
            const compileOutput = response.data.compile?.stderr || "";

            if (stderr || compileOutput) {
                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: output,
                    passed: false,
                    error: (compileOutput ? "COMPILE_ERR: " + compileOutput + "\n" : "") + (stderr ? "STDERR: " + stderr : ""),
                    isHidden
                });
            } else {
                const passed = compareOutputs(output, tc.output);
                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: output,
                    passed,
                    isHidden
                });
            }
        } catch (error: any) {
            results.push({
                input: tc.input,
                expected: tc.output,
                actual: '',
                passed: false,
                error: (error as Error).message,
                isHidden
            });
        }
    }

    return results;
}

