
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

function parseInputs(inputStr: string) {
    const lines = inputStr.split(/[\n]/);
    const vars: Record<string, any> = {};
    lines.forEach(line => {
        if (line.includes('=')) {
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const val = parts.slice(1).join('=').trim();
                vars[key] = val;
            }
        }
    });
    return vars;
}

// Extract parameter names from the function signature
function extractParamOrder(userCode: string, language: string): string[] {
    const cleanCode = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

    // Find function signature and extract parameter names
    let paramMatch: RegExpMatchArray | null = null;

    if (language === 'python') {
        paramMatch = cleanCode.match(/def\s+\w+\s*\(([^)]*)\)/);
    } else if (language === 'javascript') {
        paramMatch = cleanCode.match(/function\s+\w+\s*\(([^)]*)\)/) ||
            cleanCode.match(/(?:const|let|var)\s+\w+\s*=\s*(?:function\s*)?\(([^)]*)\)/);
    } else {
        // C/C++/Java: match function signature
        paramMatch = cleanCode.match(/\w+\s+\w+\s*\(([^)]*)\)/);
    }

    if (!paramMatch || !paramMatch[1]) return [];

    const paramsStr = paramMatch[1];
    const params: string[] = [];

    // Parse each parameter to extract just the name
    paramsStr.split(',').forEach(param => {
        const trimmed = param.trim();
        if (!trimmed) return;

        // For C/C++/Java: "int arr[]" -> "arr", "int n" -> "n", "vector<int> nums" -> "nums"
        // For Python/JS: just the name
        const parts = trimmed.split(/\s+/);
        let name = parts[parts.length - 1];
        // Remove array brackets, pointers, references
        name = name.replace(/[\[\]*&]/g, '');
        if (name) params.push(name);
    });

    return params;
}

function getWrapper(language: string, input: string, userCode: string) {
    const vars = parseInputs(input);
    const varNames = Object.keys(vars);

    // Find the function name
    let funcName = "";
    const cleanCode = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

    if (language === 'python') {
        const match = cleanCode.match(/def\s+(\w+)\s*\(/);
        if (match) funcName = match[1];
    } else if (language === 'javascript') {
        const match = cleanCode.match(/function\s+(\w+)\s*\(/) || cleanCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
        if (match) funcName = match[1];
    } else {
        const matches = [...cleanCode.matchAll(/([\w<>:*&]+)\s+(\w+)\s*\(/g)];
        if (matches.length > 0) {
            for (let i = matches.length - 1; i >= 0; i--) {
                const possibleName = matches[i][2];
                if (!['if', 'while', 'for', 'switch', 'return', 'using', 'std', 'main'].includes(possibleName)) {
                    funcName = possibleName;
                    break;
                }
            }
        }
    }

    // Get the parameter order from the function signature
    const paramOrder = extractParamOrder(userCode, language);

    // Match input variables to parameters by name
    let orderedArgs: string[] = [];
    if (paramOrder.length > 0) {
        // Try to match parameter names with input variable names
        orderedArgs = paramOrder.map(param => {
            // Find matching input variable (case-insensitive)
            const match = varNames.find(v => v.toLowerCase() === param.toLowerCase());
            return match || param;
        }).filter(v => varNames.includes(v));
    }

    // Fallback to input order if we couldn't match
    if (orderedArgs.length === 0) {
        orderedArgs = varNames;
    }

    const needsMain = (language === 'cpp' || language === 'c' || language === 'java') && !cleanCode.includes('main');

    if (!funcName && !needsMain) {
        return userCode;
    }

    switch (language) {
        case 'python':
            return `${userCode}\n\n${varNames.map(v => `${v} = ${vars[v]}`).join('\n')}\nresult = ${funcName}(${orderedArgs.join(', ')})\nif isinstance(result, list):\n    print('[' + ', '.join(map(str, result)) + ']')\nelif isinstance(result, bool):\n    print('true' if result else 'false')\nelse:\n    print(result)`;

        case 'javascript':
            return `${userCode}\n\n${varNames.map(v => `const ${v} = ${vars[v]};`).join('\n')}\nconst result = ${funcName}(${orderedArgs.join(', ')});\nif (Array.isArray(result)) {\n  console.log('[' + result.join(', ') + ']');\n} else if (typeof result === 'boolean') {\n  console.log(result ? 'true' : 'false');\n} else {\n  console.log(result);\n}`;

        case 'cpp': {
            // Detect what types the function uses
            const usesVectorInt = /vector\s*<\s*int\s*>/.test(cleanCode);
            const usesVectorLong = /vector\s*<\s*long\s*(long)?\s*>/.test(cleanCode);
            const usesVectorString = /vector\s*<\s*string\s*>/.test(cleanCode);
            const usesVector2D = /vector\s*<\s*vector/.test(cleanCode);
            const usesLongLong = /long\s+long/.test(cleanCode);
            const usesString = /\bstring\b/.test(cleanCode) && !usesVectorString;

            const cppDecls = varNames.map(v => {
                const val = vars[v];
                // Handle arrays/vectors
                if (val.startsWith('[') || val.startsWith('{')) {
                    const inner = val.replace(/[\[\]]/g, '').trim();
                    // Check for 2D arrays
                    if (val.includes('],[') || val.includes('], [')) {
                        // 2D array - parse it properly
                        const rows = val.replace(/^\[|\]$/g, '').split(/\],\s*\[/);
                        const formatted = rows.map(r => `{${r.replace(/[\[\]]/g, '')}}`).join(', ');
                        if (usesVector2D) {
                            return `vector<vector<int>> ${v} = {${formatted}};`;
                        }
                    }
                    // 1D array
                    if (usesVectorInt || usesVectorLong) {
                        const vecType = usesVectorLong ? 'vector<long long>' : 'vector<int>';
                        return `${vecType} ${v} = {${inner}};`;
                    } else {
                        // C-style array
                        const arrType = usesLongLong ? 'long long' : 'int';
                        return `${arrType} ${v}[] = {${inner}};`;
                    }
                }
                // Handle strings
                if (val.startsWith('"') || val.startsWith("'")) {
                    return `string ${v} = ${val};`;
                }
                // Handle numbers
                if (!isNaN(Number(val))) {
                    const numType = usesLongLong ? 'long long' : 'int';
                    return `${numType} ${v} = ${val};`;
                }
                // Handle booleans
                if (val === 'true' || val === 'false') {
                    return `bool ${v} = ${val};`;
                }
                return `auto ${v} = ${val};`;
            }).join('\n');

            const cppArgs = orderedArgs.join(', ');

            // Smart output handling
            let footer = "";
            if (funcName) {
                footer = `auto res = ${funcName}(${cppArgs});\n`;
                // Check return type from function signature
                if (/vector\s*</.test(cleanCode.split(funcName)[0]?.slice(-50) || '')) {
                    // Function returns a vector
                    footer += `cout << "["; for(int i=0; i<res.size(); i++) { if(i>0) cout << ", "; cout << res[i]; } cout << "]" << endl;`;
                } else if (/\bbool\b/.test(cleanCode.split(funcName)[0]?.slice(-20) || '')) {
                    footer += `cout << (res ? "true" : "false") << endl;`;
                } else {
                    footer += `cout << res << endl;`;
                }
            }

            // Common data structure definitions
            let structDefs = '';
            let helperFunctions = '';

            // TreeNode for binary tree problems
            const usesTreeNode = /TreeNode/.test(cleanCode);
            if (usesTreeNode) {
                structDefs += `
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};
`;
                helperFunctions += `
// Helper to build tree from level-order array
TreeNode* buildTree(vector<int>& nodes) {
    if (nodes.empty() || nodes[0] == -1001) return nullptr;
    TreeNode* root = new TreeNode(nodes[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (!q.empty() && i < nodes.size()) {
        TreeNode* curr = q.front();
        q.pop();
        if (i < nodes.size() && nodes[i] != -1001) {
            curr->left = new TreeNode(nodes[i]);
            q.push(curr->left);
        }
        i++;
        if (i < nodes.size() && nodes[i] != -1001) {
            curr->right = new TreeNode(nodes[i]);
            q.push(curr->right);
        }
        i++;
    }
    return root;
}

void printTree(TreeNode* root) {
    if (!root) { cout << "[]"; return; }
    vector<int> result;
    queue<TreeNode*> q;
    q.push(root);
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        if (node) {
            result.push_back(node->val);
            q.push(node->left);
            q.push(node->right);
        } else {
            result.push_back(-1001);
        }
    }
    while (!result.empty() && result.back() == -1001) result.pop_back();
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        if (i > 0) cout << ", ";
        if (result[i] == -1001) cout << "null";
        else cout << result[i];
    }
    cout << "]";
}
`;
            }

            // ListNode for linked list problems
            const usesListNode = /ListNode/.test(cleanCode);
            if (usesListNode) {
                structDefs += `
struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};
`;
                helperFunctions += `
// Helper to build linked list from array
ListNode* buildList(vector<int>& nodes) {
    if (nodes.empty()) return nullptr;
    ListNode* head = new ListNode(nodes[0]);
    ListNode* curr = head;
    for (int i = 1; i < nodes.size(); i++) {
        curr->next = new ListNode(nodes[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    bool first = true;
    while (head) {
        if (!first) cout << ", ";
        cout << head->val;
        first = false;
        head = head->next;
    }
    cout << "]";
}
`;
            }

            // Node for N-ary tree or graph problems
            if (/\bNode\b/.test(cleanCode) && !usesTreeNode && !usesListNode) {
                structDefs += `
struct Node {
    int val;
    vector<Node*> children;
    Node() : val(0) {}
    Node(int x) : val(x) {}
    Node(int x, vector<Node*> ch) : val(x), children(ch) {}
};
`;
            }

            // For tree/list problems, build the data structure from input
            let mainDecls = cppDecls;
            let mainFooter = footer;

            if (usesTreeNode || usesListNode) {
                // Transform variable declarations to build tree/list
                mainDecls = varNames.map(v => {
                    const val = vars[v];
                    if (val.startsWith('[') || val.startsWith('{')) {
                        const inner = val.replace(/[\[\]]/g, '').trim();
                        // Replace "null" with -1001 as marker
                        const processed = inner.replace(/null/gi, '-1001');
                        if (usesTreeNode && (v === 'root' || v.includes('tree') || v.includes('node'))) {
                            return `vector<int> ${v}_arr = {${processed}};\nTreeNode* ${v} = buildTree(${v}_arr);`;
                        }
                        if (usesListNode && (v === 'head' || v.includes('list') || v.includes('node'))) {
                            return `vector<int> ${v}_arr = {${processed}};\nListNode* ${v} = buildList(${v}_arr);`;
                        }
                        // Regular vector
                        return `vector<int> ${v} = {${inner}};`;
                    }
                    if (!isNaN(Number(val))) {
                        return `int ${v} = ${val};`;
                    }
                    if (val.startsWith('"') || val.startsWith("'")) {
                        return `string ${v} = ${val};`;
                    }
                    return `auto ${v} = ${val};`;
                }).join('\n');

                // Smart output for tree/list return types
                if (funcName) {
                    const beforeFunc = cleanCode.split(funcName)[0] || '';

                    // Check if it's a void function with output parameter (like ans, result)
                    const isVoidFunc = /\bvoid\b/.test(beforeFunc.slice(-10));
                    const funcSignature = cleanCode.match(new RegExp(`\\bvoid\\s+${funcName}\\s*\\(([^)]*)\\)`));

                    if (isVoidFunc && funcSignature) {
                        // Parse function parameters to find output vectors
                        const params = funcSignature[1];
                        const outputParamMatch = params.match(/vector\s*<\s*int\s*>\s*&\s*(\w+)/);

                        if (outputParamMatch) {
                            const outputParam = outputParamMatch[1];
                            // Create the output vector and call function
                            mainDecls += `\nvector<int> ${outputParam};`;

                            // Build the args list including the output param
                            const allParams = paramOrder.map(p => {
                                if (varNames.includes(p)) return p;
                                if (p === outputParam) return outputParam;
                                return p;
                            });

                            mainFooter = `${funcName}(${allParams.join(', ')});\ncout << "["; for(int i=0; i<${outputParam}.size(); i++) { if(i>0) cout << ", "; cout << ${outputParam}[i]; } cout << "]" << endl;`;
                        } else {
                            // Regular void function
                            mainFooter = `${funcName}(${cppArgs});\ncout << "void" << endl;`;
                        }
                    } else if (/TreeNode\s*\*/.test(beforeFunc.slice(-30))) {
                        mainFooter = `TreeNode* res = ${funcName}(${cppArgs});\nprintTree(res);\ncout << endl;`;
                    } else if (/ListNode\s*\*/.test(beforeFunc.slice(-30))) {
                        mainFooter = `ListNode* res = ${funcName}(${cppArgs});\nprintList(res);\ncout << endl;`;
                    } else if (/vector\s*</.test(beforeFunc.slice(-50))) {
                        mainFooter = `auto res = ${funcName}(${cppArgs});\ncout << "["; for(int i=0; i<res.size(); i++) { if(i>0) cout << ", "; cout << res[i]; } cout << "]" << endl;`;
                    } else if (/\bbool\b/.test(beforeFunc.slice(-20))) {
                        mainFooter = `bool res = ${funcName}(${cppArgs});\ncout << (res ? "true" : "false") << endl;`;
                    } else {
                        mainFooter = `auto res = ${funcName}(${cppArgs});\ncout << res << endl;`;
                    }
                }
            }

            return `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n#include <climits>\n#include <cmath>\n#include <queue>\n#include <stack>\n#include <unordered_map>\n#include <unordered_set>\nusing namespace std;\n${structDefs}\n${helperFunctions}\n${userCode}\n\nint main() {\n${mainDecls}\n${mainFooter}\nreturn 0;\n}`;
        }

        case 'c': {
            const cDecls = varNames.map(v => {
                const val = vars[v];
                if (val.startsWith('[') || val.startsWith('{')) {
                    const inner = val.replace(/[\[\]]/g, '').trim();
                    return `int ${v}[] = {${inner}}; int ${v}_size = sizeof(${v})/sizeof(${v}[0]);`;
                }
                if (val.startsWith('"') || val.startsWith("'")) {
                    return `char ${v}[] = ${val};`;
                }
                return `int ${v} = ${val};`;
            }).join('\n');

            const cArgs = orderedArgs.join(', ');
            const cFooter = funcName ? `printf("%d\\n", ${funcName}(${cArgs}));` : "";
            return `#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <stdbool.h>\n\n${userCode}\n\nint main() {\n${cDecls}\n${cFooter}\nreturn 0;\n}`;
        }

        case 'java': {
            // Detect what types Java function uses
            const usesArrayList = /ArrayList/.test(cleanCode);
            const usesList = /List\s*</.test(cleanCode);

            const javaDecls = varNames.map(v => {
                const val = vars[v];
                if (val.startsWith('[') || val.startsWith('{')) {
                    const inner = val.replace(/[\[\]]/g, '').trim();
                    if (usesArrayList || usesList) {
                        return `ArrayList<Integer> ${v} = new ArrayList<>(Arrays.asList(${inner.split(',').map(x => x.trim()).join(', ')}));`;
                    }
                    return `int[] ${v} = {${inner}};`;
                }
                if (val.startsWith('"')) return `String ${v} = ${val};`;
                if (val === 'true' || val === 'false') return `boolean ${v} = ${val};`;
                return `int ${v} = ${val};`;
            }).join('\n');
            const javaFooter = funcName ? `System.out.println(sol.${funcName}(${orderedArgs.join(', ')}));` : "";
            return `import java.util.*;\n\npublic class Solution {\n${userCode}\n\npublic static void main(String[] args) {\n    Solution sol = new Solution();\n${javaDecls}\n    ${javaFooter}\n}\n}`;
        }

        default:
            return userCode;
    }
}

async function requestWithRetry(config: any, retries = 2): Promise<any> {
    try {
        return await axios(config);
    } catch (err: any) {
        if (retries > 0 && (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED' || err.status === 429)) {
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

        try {
            const wrappedCode = getWrapper(language, tc.input, code);

            const response = await requestWithRetry({
                method: 'post',
                url: PISTON_URL,
                data: {
                    language: langConfig.language,
                    version: langConfig.version,
                    files: [{ content: wrappedCode }],
                },
                timeout: 12000,
            });

            const output = response.data.run.output?.trim() || "";
            const stderr = response.data.run.stderr || "";

            if (stderr) {
                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: output,
                    passed: false,
                    error: stderr,
                    isHidden
                });
            } else {
                // Comprehensive output normalization
                const normalizeOutput = (str: string): string => {
                    let normalized = str.trim().toLowerCase();

                    // Remove all whitespace for comparison
                    normalized = normalized.replace(/[\s\n\r]/g, "");

                    // Normalize array formatting: [1, 2, 3] and [1,2,3] should match
                    normalized = normalized.replace(/,\s*/g, ",");

                    // Handle trailing zeros in floats: 3.0 vs 3
                    if (/^\d+\.0+$/.test(normalized)) {
                        normalized = normalized.replace(/\.0+$/, "");
                    }

                    return normalized;
                };

                let normalizedActual = normalizeOutput(output);
                let normalizedExpected = normalizeOutput(tc.output);

                // Only convert 0/1 to true/false if the expected output is a boolean
                const expectedIsBoolean = normalizedExpected === 'true' || normalizedExpected === 'false';
                if (expectedIsBoolean) {
                    if (normalizedActual === '1') normalizedActual = 'true';
                    if (normalizedActual === '0') normalizedActual = 'false';
                }

                // Handle -1 as "not found" - both -1 and "notfound" should work
                if (normalizedExpected === '-1' || normalizedExpected === 'notfound') {
                    if (normalizedActual === '-1' || normalizedActual === 'notfound') {
                        normalizedActual = normalizedExpected;
                    }
                }

                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: output,
                    passed: normalizedActual === normalizedExpected,
                    isHidden
                });
            }
        } catch (err: any) {
            results.push({
                input: tc.input,
                expected: tc.output,
                actual: "",
                passed: false,
                error: (err.code === 'ETIMEDOUT' || err.code === 'ECONNABORTED')
                    ? "The code execution server is busy. Please wait a few seconds and try again."
                    : err.message,
                isHidden
            });
        }
    }

    return results;
}
