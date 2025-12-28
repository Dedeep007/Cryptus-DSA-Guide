
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

function parseInputs(inputStr: string): Record<string, any> {
    const vars: Record<string, any> = {};
    const normalized = inputStr.trim();

    // Check if it's a raw matrix/grid format (multiple lines of space-separated numbers)
    // Only if it doesn't contain [ or { or = or :
    const lines = normalized.split('\n').map(l => l.trim()).filter(l => l);

    // A raw matrix should have multiple lines, and each line should have the same number of elements
    // or follow the [rows, cols] pattern.
    let isRawMatrix = false;
    if (lines.length > 1 && !normalized.includes('[') && !normalized.includes('{') && !normalized.includes('=') && !normalized.includes(':')) {
        const lineLengths = lines.map(l => l.split(/\s+/).length);
        const allDigits = lines.every(line => /^-?\d+(\s+-?\d+)*$/.test(line));

        if (allDigits) {
            // Case 1: rows cols \n grid...
            if (lineLengths[0] === 2 && lines.length === Number(lines[0].split(/\s+/)[0]) + 1) {
                isRawMatrix = true;
            }
            // Case 2: Pure matrix with consistent line lengths
            else if (lineLengths.length > 2 && lineLengths.every(len => len === lineLengths[0])) {
                isRawMatrix = true;
            }
        }
    }

    if (isRawMatrix) {
        // If the first line has 2 numbers and matches dimensions of the rest, it's a dimensions line
        const firstLineNums = lines[0].split(/\s+/).map(Number);
        if (firstLineNums.length === 2 && lines.length === firstLineNums[0] + 1) {
            vars['n'] = firstLineNums[0];
            vars['m'] = firstLineNums[1];
            vars['matrix'] = '[' + lines.slice(1).map(l => '[' + l.split(/\s+/).join(',') + ']').join(',') + ']';
            vars['grid'] = vars['matrix']; // Alias
            vars['arr'] = vars['matrix'];  // Alias
            return vars;
        }

        // General multi-line numbers -> 2D array
        vars['matrix'] = '[' + lines.map(l => '[' + l.split(/\s+/).join(',') + ']').join(',') + ']';
        vars['grid'] = vars['matrix'];
        vars['arr'] = vars['matrix'];
        return vars;
    }

    // Handle raw multi-line values that aren't necessarily a matrix (e.g. n \n arr \n m \n arr)
    if (lines.length > 1 && !normalized.includes('=') && !normalized.includes(':')) {
        // Just use sequential names, getWrapper will map them to actual parameters
        lines.forEach((line, index) => {
            const val = line.trim();
            const varName = `arg${index}`;
            if (val.startsWith('[') || val.startsWith('{')) {
                vars[varName] = val;
            } else if (val.split(/\s+/).length > 1) {
                // Space separated array
                vars[varName] = '[' + val.split(/\s+/).join(',') + ']';
            } else {
                vars[varName] = val;
            }
        });
        return vars;
    }

    // Split by comma but respect brackets
    const segments: string[] = [];
    let depth = 0;
    let current = '';

    for (let i = 0; i < normalized.length; i++) {
        const char = normalized[i];
        if (char === '[' || char === '{' || char === '(') depth++;
        if (char === ']' || char === '}' || char === ')') depth--;

        if ((char === ',' || char === '\n') && depth === 0) {
            if (current.trim()) segments.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    if (current.trim()) segments.push(current.trim());

    // Track unnamed values
    const unnamedValues: string[] = [];

    // Parse each segment - handle both "key = value" and "key: value"
    segments.forEach(segment => {
        if (!segment) return;

        const match = segment.match(/^([a-zA-Z_][a-zA-Z0-9_]*)(?:\[\])?\s*[:=]\s*(.+)$/);

        if (match) {
            const key = match[1].trim();
            let val = match[2].trim();
            if (val.startsWith('{') && val.endsWith('}')) {
                val = '[' + val.slice(1, -1) + ']';
            }
            vars[key] = val;
        } else if (segment.startsWith('[') || segment.startsWith('{') ||
            !isNaN(Number(segment.split(/\s+/)[0])) || segment.startsWith('"') || segment.startsWith("'")) {
            unnamedValues.push(segment);
        }
    });

    // Assign unnamed values to default param names
    if (Object.keys(vars).length === 0 && unnamedValues.length > 0) {
        const defaultParamNames = ['root', 'head', 'nums', 'arr', 'n', 's', 'target', 'k'];
        unnamedValues.forEach((val, index) => {
            vars[defaultParamNames[index] || `arg${index}`] = val;
        });
    } else if (unnamedValues.length > 0) {
        // Mix of named and unnamed - assign unnamed to remaining defaults
        const existingKeys = Object.keys(vars);
        const defaultParamNames = ['root', 'head', 'nums', 'arr', 'n', 's', 'target', 'k']
            .filter(n => !existingKeys.includes(n));
        unnamedValues.forEach((val, index) => {
            if (defaultParamNames[index]) vars[defaultParamNames[index]] = val;
        });
    }

    return vars;
}

// Extract parameter names from the function signature
function extractParamOrder(userCode: string, language: string): string[] {
    const cleanCode = userCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");

    if (language === 'python') {
        const match = cleanCode.match(/def\s+\w+\s*\(([^)]*)\)/);
        return match ? extractParamsFromStr(match[1]) : [];
    } else if (language === 'javascript') {
        const match = cleanCode.match(/function\s+\w+\s*\(([^)]*)\)/) ||
            cleanCode.match(/(?:const|let|var)\s+\w+\s*=\s*(?:function\s*)?\(([^)]*)\)/);
        return match ? extractParamsFromStr(match[1]) : [];
    } else {
        // C/C++/Java: match function signature (handle templates with <>)
        const match = cleanCode.match(/(?:[\w<>:*&]+\s+)+(\w+)\s*\(([^)]*)\)/);
        return match ? extractParamsFromStr(match[2]) : [];
    }
}

function extractParamsWithTypes(paramsStr: string): { name: string, type: string }[] {
    const params: { name: string, type: string }[] = [];
    paramsStr.split(',').forEach(param => {
        const trimmed = param.trim();
        if (!trimmed) return;
        const parts = trimmed.split(/\s+/);
        let name = parts[parts.length - 1];
        name = name.replace(/[\[\]*&]/g, '');
        const type = parts.slice(0, parts.length - 1).join(' ') + (parts[parts.length - 1].includes('[]') ? '[]' : '');
        if (name) params.push({ name, type });
    });
    return params;
}

function extractParamsFromStr(paramsStr: string): string[] {
    return extractParamsWithTypes(paramsStr).map(p => p.name);
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
            for (let i = 0; i < matches.length; i++) {
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

    // Match input variables to parameters by name or alias
    let orderedArgs: string[] = [];
    const aliases: Record<string, string[]> = {
        'nums': ['arr', 'a', 'nums1', 'arr1', 'nums2', 'arr2', 'prices', 'root', 'head'],
        'arr': ['nums', 'a', 'arr1', 'nums1', 'arr2', 'nums2', 'arr', 'prices', 'root', 'head'],
        'prices': ['arr', 'nums', 'prices'],
        'arr1': ['nums1', 'nums', 'arr', 'a'],
        'arr2': ['nums2', 'nums', 'arr', 'b'],
        'nums1': ['arr1', 'nums', 'arr'],
        'nums2': ['arr2', 'nums', 'arr'],
        'a': ['arr', 'nums', 'arr1', 'nums1'],
        'b': ['arr2', 'nums2', 'arr', 'nums'],
        'target': ['k', 'x', 'val', 'sum', 'target'],
        'k': ['target', 'x', 'val', 'sum', 'k'],
        'x': ['target', 'k', 'val', 'x'],
        'n': ['size', 'numsSize', 'm', 'len', 'n1', 'n'],
        'm': ['n', 'size', 'numsSize', 'len', 'n2', 'm'],
        'matrix': ['grid', 'arr', 'board'],
        'grid': ['matrix', 'arr', 'board']
    };

    const paramsUsed = new Set<string>();
    orderedArgs = paramOrder.map(param => {
        const p = param.toLowerCase();
        // 1. Direct match
        const directMatch = varNames.find(v => v.toLowerCase() === p && !paramsUsed.has(v));
        if (directMatch) {
            paramsUsed.add(directMatch);
            return directMatch;
        }

        // 2. Alias match
        const aliasList = aliases[p] || [];
        const aliasMatch = varNames.find(v => aliasList.includes(v.toLowerCase()) && !paramsUsed.has(v));
        if (aliasMatch) {
            paramsUsed.add(aliasMatch);
            return aliasMatch;
        }

        const isArrayParam = ['nums', 'arr', 'matrix', 'grid', 'board', 'a', 'b'].some(a => p.includes(a));
        const isNumParam = ['n', 'm', 'k', 'size', 'len', 'target', 'val', 'x', 'low', 'high', 'mid'].some(n => p === n || p.includes(n));
        const isStringParam = p.startsWith('s') || p.includes('str') || p.includes('word');

        const isDefaultNameMatch = (v: string) => {
            const defaultNames = ['root', 'head', 'nums', 'arr', 'n', 's', 'target', 'k'];
            return defaultNames.includes(v) || v.startsWith('arg');
        };

        const argMatch = varNames.find(v => {
            if (!isDefaultNameMatch(v) || paramsUsed.has(v)) return false;
            const val = String(vars[v]);
            const isArrayVal = val.startsWith('[') || val.startsWith('{');
            const isNumVal = !isNaN(Number(val));
            const isStringVal = val.startsWith('"') || val.startsWith("'");

            if (isArrayParam && isArrayVal) return true;
            if (isNumParam && isNumVal) return true;
            if (isStringParam && isStringVal) return true;
            return false;
        });

        if (argMatch) {
            paramsUsed.add(argMatch);
            return argMatch;
        }

        // 4. Final fallback - take the first unused default/arg if types are unclear
        const fallbackArg = varNames.find(v => isDefaultNameMatch(v) && !paramsUsed.has(v));
        if (fallbackArg) {
            paramsUsed.add(fallbackArg);
            return fallbackArg;
        }

        return param;
    }).filter(v => varNames.includes(v) || ['n', 'm', 'size', 'numssize', 'len', 'root', 'head', 'target', 'k'].includes(v.toLowerCase()));

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
            return `import math\nimport collections\nimport heapq\nimport bisect\nfrom typing import *\n\n${userCode}\n\n${varNames.map(v => `${v} = ${vars[v]}`).join('\n')}\nresult = ${funcName}(${orderedArgs.join(', ')})\nif isinstance(result, list):\n    print('[' + ', '.join(map(str, result)) + ']')\nelif isinstance(result, bool):\n    print('true' if result else 'false')\nelse:\n    print(result)`;

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

            let mainFooter = "";

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
            let mainDecls = "";
            helperFunctions += `
void __print_coll(int x) { cout << x; }
void __print_coll(long long x) { cout << x; }
void __print_coll(double x) { cout << x; }
void __print_coll(bool x) { cout << (x ? "true" : "false"); }
void __print_coll(const string& x) { cout << x; }
void __print_coll(char x) { cout << "'" << x << "'"; }

template<typename T>
void __print_coll(const vector<T>& v) {
    cout << "[";
    for(size_t i=0; i<v.size(); ++i) {
        if(i>0) cout << ", ";
        __print_coll(v[i]);
    }
    cout << "]";
}
`;

            // Get function signature info
            const funcSignature = cleanCode.match(new RegExp(`\\b(?:void|auto|\\w+|[\\w<>:*&]+)\\s+${funcName}\\s*\\(([^)]*)\\)`));
            const paramsStr = funcSignature ? funcSignature[1] : '';
            const paramsInfo = extractParamsWithTypes(paramsStr);
            const paramNames = paramsInfo.map(p => p.name);

            // Transform variable declarations
            mainDecls = varNames.map((v) => {
                const val = vars[v];
                if (val && (val.startsWith('[') || val.startsWith('{'))) {
                    // Convert [1,2,3] to {1,2,3} and [[1,2],[3,4]] to {{1,2},{3,4}}
                    const processed = val.replace(/\[/g, '{').replace(/\]/g, '}').replace(/null/gi, '-1001');

                    // Find parameter type for this variable
                    const targetIdx = orderedArgs.indexOf(v);
                    const pInfo = targetIdx !== -1 ? paramsInfo[targetIdx] : null;

                    // Heuristics for tree/list
                    const isListOnlyCode = usesListNode && !usesTreeNode;
                    const isTreeNodeVar = usesTreeNode && (v === 'root' || v.toLowerCase().includes('tree'));
                    const isListNodeVar = usesListNode && (v === 'head' || v.toLowerCase().includes('list') || (isListOnlyCode && v === 'root'));

                    if (isTreeNodeVar) {
                        const pureArr = val.replace(/[\[\]]/g, '').trim().replace(/null/gi, '-1001');
                        return `vector<int> ${v}_arr = {${pureArr}};\nTreeNode* ${v} = buildTree(${v}_arr);`;
                    }
                    if (isListNodeVar) {
                        const pureArr = val.replace(/[\[\]]/g, '').trim().replace(/null/gi, '-1001');
                        return `vector<int> ${v}_arr = {${pureArr}};\nListNode* ${v} = buildList(${v}_arr);`;
                    }

                    if (pInfo) {
                        let type = pInfo.type.replace(/&/g, '').trim();
                        if (type.includes('[]')) {
                            const baseType = type.replace('[]', '').trim();
                            return `${baseType} ${v}[] = ${processed};`;
                        }
                        if (type.includes('*') && !type.includes('**')) {
                            const baseType = type.replace('*', '').trim();
                            return `${baseType} ${v}[] = ${processed};`;
                        }
                        return `${type} ${v} = ${processed};`;
                    }

                    // Fallback heuristics
                    if (val.includes('[[')) {
                        return `vector<vector<int>> ${v} = ${processed};`;
                    }
                    return `vector<int> ${v} = ${processed};`;
                }
                if (val && !isNaN(Number(val))) return `int ${v} = ${val};`;
                if (val && (val.startsWith('"') || val.startsWith("'"))) return `string ${v} = ${val};`;
                if (val) return `auto ${v} = ${val};`;
                return '';
            }).filter(s => s).join('\n');

            // Handle missing size parameters in mainDecls
            orderedArgs.forEach((arg, idx) => {
                if (!varNames.includes(arg) && ['n', 'm', 'size', 'numssize', 'len'].includes(arg.toLowerCase())) {
                    // Try to find a preceding array/vector to infer size from
                    const prevArrayName = orderedArgs.slice(0, idx).find(a => {
                        const val = vars[a];
                        return val && (val.startsWith('[') || val.startsWith('{'));
                    });

                    if (prevArrayName) {
                        const prevTargetIdx = orderedArgs.indexOf(prevArrayName);
                        const prevPInfo = prevTargetIdx !== -1 ? paramsInfo[prevTargetIdx] : null;
                        const isCArr = prevPInfo && (prevPInfo.type.includes('[]') || prevPInfo.type.includes('*'));

                        if (isCArr) {
                            mainDecls += `\nint ${arg} = sizeof(${prevArrayName})/sizeof(${prevArrayName}[0]);`;
                        } else {
                            mainDecls += `\nint ${arg} = ${prevArrayName}.size();`;
                        }
                    } else {
                        mainDecls += `\nint ${arg} = 0;`;
                    }
                }
            });

            // Smart output handling
            mainFooter = "";
            if (funcName) {
                const beforeFunc = cleanCode.split(funcName)[0] || '';
                const isVoidFunc = /\bvoid\s*$/.test(beforeFunc.trim());

                if (isVoidFunc) {
                    const outputMatch = paramsStr.match(/(?:vector\s*<\s*\w+\s*>\s*&|int\s+\w+\[\]|int\s*\*)\s*(\w+)/);
                    const targetParamName = outputMatch ? outputMatch[1] : (paramNames.length > 0 ? paramNames[0] : null);

                    if (targetParamName) {
                        const targetIdx = paramNames.indexOf(targetParamName);
                        const actualArgName = (targetIdx !== -1 && orderedArgs[targetIdx]) ? orderedArgs[targetIdx] : targetParamName;

                        if (paramsStr.includes('vector')) {
                            mainFooter = `::${funcName}(${cppArgs});\n__print_coll(${actualArgName});\ncout << endl;`;
                        } else {
                            const sizeParamName = paramNames.find(p => ['n', 'm', 'size', 'numsSize', 'len'].includes(p.toLowerCase()));
                            const sizeIdx = sizeParamName ? paramNames.indexOf(sizeParamName) : -1;
                            const actualSizeName = (sizeIdx !== -1 && orderedArgs[sizeIdx]) ? orderedArgs[sizeIdx] : sizeParamName;

                            if (actualSizeName && varNames.includes(actualSizeName)) {
                                mainFooter = `::${funcName}(${cppArgs});\ncout << "["; for(int i=0; i<${actualSizeName}; i++) { if(i>0) cout << ", "; cout << ${actualArgName}[i]; } cout << "]" << endl;`;
                            } else {
                                mainFooter = `::${funcName}(${cppArgs});\ncout << "void" << endl;`;
                            }
                        }
                    } else {
                        mainFooter = `::${funcName}(${cppArgs});\ncout << "void" << endl;`;
                    }
                } else if (/TreeNode\s*\*/.test(beforeFunc.slice(-30))) {
                    mainFooter = `TreeNode* res = ::${funcName}(${cppArgs});\nprintTree(res);\ncout << endl;`;
                } else if (/ListNode\s*\*/.test(beforeFunc.slice(-30))) {
                    mainFooter = `ListNode* res = ::${funcName}(${cppArgs});\nprintList(res);\ncout << endl;`;
                } else if (/vector\s*</.test(beforeFunc.slice(-50))) {
                    mainFooter = `auto res = ::${funcName}(${cppArgs});\n__print_coll(res);\ncout << endl;`;
                } else if (/\bbool\b/.test(beforeFunc.slice(-20))) {
                    mainFooter = `bool res = ::${funcName}(${cppArgs});\ncout << (res ? "true" : "false") << endl;`;
                } else {
                    mainFooter = `auto res = ::${funcName}(${cppArgs});\ncout << res << endl;`;
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
            const usesLong = /long/.test(cleanCode);
            const usesDouble = /double/.test(cleanCode);
            const usesFloat = /float/.test(cleanCode);

            const javaDecls = varNames.map(v => {
                const val = vars[v];
                if (val.startsWith('[') || val.startsWith('{')) {
                    const inner = val.replace(/[\[\]]/g, '').trim();
                    if (usesArrayList || usesList) {
                        return `ArrayList<Integer> ${v} = new ArrayList<>(Arrays.asList(${inner.split(',').map(x => x.trim()).join(', ')}));`;
                    }
                    const type = usesLong ? 'long[]' : 'int[]';
                    return `${type} ${v} = {${inner}};`;
                }
                if (val && val.startsWith('"')) return `String ${v} = ${val};`;
                if (val === 'true' || val === 'false') return `boolean ${v} = ${val};`;
                if (val && !isNaN(Number(val))) {
                    if (val.includes('.') || usesDouble) return `double ${v} = ${val};`;
                    if (usesFloat) return `float ${v} = ${val};`;
                    if (usesLong) return `long ${v} = ${val};`;
                    return `int ${v} = ${val};`;
                }
                return `Object ${v} = ${val};`; // Fallback
            }).join('\n');

            // Extract imports from userCode to place them outside the class
            const importMatches = userCode.match(/^\s*import\s+.+;/gm) || [];
            const userCodeWithoutImports = userCode.replace(/^\s*import\s+.+;/gm, '');

            // If user already provided a class Solution or a main method, we have to be very careful.
            // For now, let's assume they might want to use our main if they didn't provide one.
            const hasMain = userCode.includes('public static void main');
            const hasSolutionClass = userCode.includes('class Solution');

            if (hasMain && hasSolutionClass) {
                return `import java.util.*;\n${importMatches.join('\n')}\n${userCodeWithoutImports}`;
            }

            const javaFooter = funcName ? `System.out.println(sol.${funcName}(${orderedArgs.join(', ')}));` : "";
            return `import java.util.*;\n${importMatches.join('\n')}\n\npublic class Solution {\n${userCodeWithoutImports}\n\npublic static void main(String[] args) {\n    Solution sol = new Solution();\n${javaDecls}\n    ${javaFooter}\n}\n}`;
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
                    // Remove all collection-related characters for robust comparison
                    normalized = normalized.replace(/[\[\]{},()]/g, "");

                    // Replace commas with empty space/remove them
                    normalized = normalized.replace(/,/g, "");

                    // Remove all whitespace
                    normalized = normalized.replace(/[\s\n\r]/g, "");

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

                let passed = normalizedActual === normalizedExpected;

                // Lenient comparison for 1D arrays: if they don't match, try sorting them
                if (!passed && output.startsWith('[') && output.endsWith(']') && !output.includes('[[')) {
                    try {
                        const sortOutput = (s: string) => {
                            const inner = s.replace(/[\[\]]/g, '').split(',')
                                .map(x => x.trim())
                                .filter(x => x)
                                .sort((a, b) => {
                                    const na = Number(a), nb = Number(b);
                                    if (!isNaN(na) && !isNaN(nb)) return na - nb;
                                    return a.localeCompare(b);
                                });
                            return inner.join(',');
                        };
                        if (sortOutput(output) === sortOutput(tc.output)) {
                            passed = true;
                        }
                    } catch (e) { }
                }

                results.push({
                    input: tc.input,
                    expected: tc.output,
                    actual: output,
                    passed: passed,
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
