/**
 * Problem-Specific Executor
 * 
 * Uses explicit per-problem configurations to parse input, generate wrappers, and validate output.
 * This replaces the generic heuristic-based executor with deterministic per-problem logic.
 */

import axios from 'axios';
import { getProblemConfig, ProblemConfig, InputFormat, OutputFormat, WrapperHints } from './problem-configs';

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

interface ParsedValues {
    array?: number[];
    array2?: number[];
    matrix?: number[][];
    n?: number;
    m?: number;
    k?: number;
    target?: number;
    commands?: string[];
    params?: any[][];
}

/**
 * Parse input based on problem-specific format
 */
function parseInput(inputStr: string, format: InputFormat): ParsedValues {
    const lines = inputStr.trim().split('\n').map(l => l.trim()).filter(Boolean);
    const result: ParsedValues = {};

    switch (format.type) {
        case 'n_then_array': {
            // Line 1: n, Line 2: space-separated array
            result.n = parseInt(lines[0]);
            if (lines[1]) {
                result.array = lines[1].split(/\s+/).map(Number);
            }
            break;
        }
        case 'array_only': {
            // Just an array
            if (lines[0].startsWith('[')) {
                result.array = JSON.parse(lines[0]);
            } else {
                result.array = lines[0].split(/\s+/).map(Number);
            }
            break;
        }
        case 'n_array_k': {
            // Line 1: n, Line 2: array, Line 3: k/target
            result.n = parseInt(lines[0]);
            if (lines[1]) {
                result.array = lines[1].split(/\s+/).map(Number);
            }
            if (lines[2]) {
                result.k = parseInt(lines[2]);
            }
            break;
        }
        case 'two_arrays': {
            // Line 1: n, Line 2: arr1, Line 3: m, Line 4: arr2
            result.n = parseInt(lines[0]);
            if (lines[1]) {
                result.array = lines[1].split(/\s+/).map(Number);
            }
            if (lines[2]) {
                result.m = parseInt(lines[2]);
            }
            if (lines[3]) {
                result.array2 = lines[3].split(/\s+/).map(Number);
            }
            break;
        }
        case 'n_m_2d_matrix': {
            // Line 1: rows cols, Lines 2+: matrix rows
            const [rows, cols] = lines[0].split(/\s+/).map(Number);
            result.n = rows;
            result.m = cols;
            result.matrix = [];
            for (let i = 1; i <= rows && i < lines.length; i++) {
                result.matrix.push(lines[i].split(/\s+/).map(Number));
            }
            break;
        }
        case 'n_m_array_target': {
            // Line 1: "n target", Line 2: array
            const [n, target] = lines[0].split(/\s+/).map(Number);
            result.n = n;
            result.target = target;
            if (lines[1]) {
                result.array = lines[1].split(/\s+/).map(Number);
            }
            break;
        }
        case 'single_number': {
            result.n = parseInt(lines[0]);
            break;
        }
        case 'two_numbers_array': {
            // Line 1: "m n", Line 2: nums1, Line 3: nums2
            const [m, n] = lines[0].split(/\s+/).map(Number);
            result.m = m;
            result.n = n;
            if (lines[1]) {
                result.array = lines[1].split(/\s+/).map(Number);
            }
            if (lines[2]) {
                result.array2 = lines[2].split(/\s+/).map(Number);
            }
            break;
        }
        case 'class_transaction': {
            // Line 1: ["ClassName", "method1", ...], Line 2: [[args1], [args2], ...]
            try {
                result.commands = JSON.parse(lines[0]);
                result.params = JSON.parse(lines[1]);
            } catch (e) {
                // Try parsing as raw values
            }
            break;
        }
    }

    return result;
}

// ==================== WRAPPER GENERATION ====================

/**
 * Generate language-specific wrapper code for a problem
 */
function generateProblemWrapper(
    language: string,
    code: string,
    input: ParsedValues,
    config: ProblemConfig
): string {
    switch (language) {
        case 'cpp':
            return generateCppProblemWrapper(code, input, config);
        case 'python':
            return generatePythonProblemWrapper(code, input, config);
        case 'javascript':
            return generateJsProblemWrapper(code, input, config);
        case 'java':
            return generateJavaProblemWrapper(code, input, config);
        case 'c':
            return generateCProblemWrapper(code, input, config);
        default:
            return code;
    }
}

function generateCppProblemWrapper(code: string, input: ParsedValues, config: ProblemConfig): string {
    const hints = config.wrapperHints?.cpp;
    const funcName = hints?.functionName || 'solution';
    const isVoid = hints?.isVoid || false;

    let includes = `
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

// Helper to print vector
template<typename T>
void printVec(const vector<T>& v) {
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << " ";
        cout << v[i];
    }
}

// Helper to print 2D vector as JSON
template<typename T>
void printVec2D_JSON(const vector<vector<T>>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << ",";
        cout << "[";
        for (size_t j = 0; j < v[i].size(); j++) {
            if (j > 0) cout << ",";
            cout << v[i][j];
        }
        cout << "]";
    }
    cout << "]";
}

// Helper to print 2D vector as rows
template<typename T>
void printVec2D_Rows(const vector<vector<T>>& v) {
    for (size_t i = 0; i < v.size(); i++) {
        if (i > 0) cout << endl;
        for (size_t j = 0; j < v[i].size(); j++) {
            if (j > 0) cout << " ";
            cout << v[i][j];
        }
    }
}
`;

    let mainBody = '';

    // Declare variables based on input
    if (input.array) {
        mainBody += `    vector<int> arr = {${input.array.join(', ')}};\n`;
    }
    if (input.array2) {
        mainBody += `    vector<int> arr2 = {${input.array2.join(', ')}};\n`;
    }
    if (input.matrix) {
        const rows = input.matrix.map(row => `{${row.join(', ')}}`).join(', ');
        mainBody += `    vector<vector<int>> matrix = {${rows}};\n`;
    }
    if (input.n !== undefined) {
        mainBody += `    int n = ${input.n};\n`;
    }
    if (input.m !== undefined) {
        mainBody += `    int m = ${input.m};\n`;
    }
    if (input.k !== undefined) {
        mainBody += `    int k = ${input.k};\n`;
    }
    if (input.target !== undefined) {
        mainBody += `    int target = ${input.target};\n`;
    }

    // Generate function call based on input format
    const inputFormat = config.inputFormat.type;
    const outputFormat = config.outputFormat.type;

    let funcCall = '';
    let printResult = '';

    switch (inputFormat) {
        case 'n_then_array':
            if (hints?.paramTypes?.includes('int[]')) {
                funcCall = `${funcName}(arr.data(), n)`;
            } else if (hints?.paramTypes?.length === 1) {
                funcCall = `${funcName}(arr)`;
            } else {
                funcCall = `${funcName}(arr, n)`;
            }
            break;
        case 'n_array_k':
            if (hints?.isVoid) {
                funcCall = `${funcName}(arr, n, k)`;
            } else if (hints?.paramTypes?.includes('int[]')) {
                funcCall = `${funcName}(arr.data(), n, k)`;
            } else {
                funcCall = `${funcName}(arr, k)`;
            }
            break;
        case 'two_arrays':
            funcCall = `${funcName}(arr.data(), arr2.data(), n, m)`;
            break;
        case 'n_m_2d_matrix':
            funcCall = `${funcName}(matrix)`;
            break;
        case 'n_m_array_target':
            funcCall = `${funcName}(arr, target)`;
            break;
        case 'single_number':
            funcCall = `${funcName}(n)`;
            break;
        case 'two_numbers_array':
            funcCall = `${funcName}(arr, m, arr2, n)`;
            break;
        default:
            funcCall = `${funcName}(arr, n)`;
    }

    // Generate print based on output format
    if (isVoid) {
        mainBody += `    ${funcCall};\n`;
        switch (outputFormat) {
            case 'array_space_separated':
                if (input.matrix) {
                    mainBody += `    printVec2D_Rows(matrix);\n`;
                } else {
                    mainBody += `    printVec(arr);\n`;
                }
                break;
            case 'array_2d_rows':
                mainBody += `    printVec2D_Rows(matrix);\n`;
                break;
            default:
                mainBody += `    printVec(arr);\n`;
        }
    } else {
        mainBody += `    auto result = ${funcCall};\n`;
        switch (outputFormat) {
            case 'single_number':
                mainBody += `    cout << result;\n`;
                break;
            case 'boolean':
                mainBody += `    cout << (result ? "true" : "false");\n`;
                break;
            case 'array_space_separated':
                mainBody += `    printVec(result);\n`;
                break;
            case 'array_json':
                mainBody += `    cout << "["; for(size_t i=0;i<result.size();i++){if(i>0)cout<<",";cout<<result[i];}cout<<"]";\n`;
                break;
            case 'array_2d_json':
                mainBody += `    printVec2D_JSON(result);\n`;
                break;
            case 'array_2d_rows':
                mainBody += `    printVec2D_Rows(result);\n`;
                break;
            default:
                mainBody += `    cout << result;\n`;
        }
    }

    return `${includes}\n${code}\n\nint main() {\n${mainBody}    return 0;\n}`;
}

function generatePythonProblemWrapper(code: string, input: ParsedValues, config: ProblemConfig): string {
    const hints = config.wrapperHints?.python;
    const funcName = hints?.functionName || 'solution';
    const isVoid = hints?.isVoid || false;

    let wrapper = `import collections
from collections import deque, Counter, defaultdict
import heapq
import math
from typing import *

${code}

`;

    // Declare variables
    if (input.array) {
        wrapper += `arr = [${input.array.join(', ')}]\n`;
    }
    if (input.array2) {
        wrapper += `arr2 = [${input.array2.join(', ')}]\n`;
    }
    if (input.matrix) {
        const rows = input.matrix.map(row => `[${row.join(', ')}]`).join(', ');
        wrapper += `matrix = [${rows}]\n`;
    }
    if (input.n !== undefined) {
        wrapper += `n = ${input.n}\n`;
    }
    if (input.m !== undefined) {
        wrapper += `m = ${input.m}\n`;
    }
    if (input.k !== undefined) {
        wrapper += `k = ${input.k}\n`;
    }
    if (input.target !== undefined) {
        wrapper += `target = ${input.target}\n`;
    }

    const inputFormat = config.inputFormat.type;
    const outputFormat = config.outputFormat.type;

    let funcCall = '';
    switch (inputFormat) {
        case 'n_then_array':
            if (hints?.paramNames?.includes('n')) {
                funcCall = `${funcName}(arr, n)`;
            } else {
                funcCall = `${funcName}(arr)`;
            }
            break;
        case 'n_array_k':
            if (isVoid && hints?.paramNames?.includes('n')) {
                funcCall = `${funcName}(arr, n, k)`;
            } else {
                funcCall = `${funcName}(arr, k)`;
            }
            break;
        case 'two_arrays':
            funcCall = `${funcName}(arr, arr2, n, m)`;
            break;
        case 'n_m_2d_matrix':
            funcCall = `${funcName}(matrix)`;
            break;
        case 'n_m_array_target':
            funcCall = `${funcName}(arr, target)`;
            break;
        case 'single_number':
            funcCall = `${funcName}(n)`;
            break;
        case 'two_numbers_array':
            funcCall = `${funcName}(arr, m, arr2, n)`;
            break;
        default:
            funcCall = `${funcName}(arr)`;
    }

    if (isVoid) {
        wrapper += `${funcCall}\n`;
        switch (outputFormat) {
            case 'array_space_separated':
                if (input.matrix) {
                    wrapper += `for row in matrix: print(' '.join(map(str, row)))\n`;
                } else {
                    wrapper += `print(' '.join(map(str, arr)))\n`;
                }
                break;
            case 'array_2d_rows':
                wrapper += `for row in matrix: print(' '.join(map(str, row)))\n`;
                break;
            default:
                wrapper += `print(' '.join(map(str, arr)))\n`;
        }
    } else {
        wrapper += `result = ${funcCall}\n`;
        switch (outputFormat) {
            case 'single_number':
                wrapper += `print(result)\n`;
                break;
            case 'boolean':
                wrapper += `print('true' if result else 'false')\n`;
                break;
            case 'array_space_separated':
                wrapper += `print(' '.join(map(str, result)))\n`;
                break;
            case 'array_json':
                wrapper += `import json; print(json.dumps(result).replace(' ', ''))\n`;
                break;
            case 'array_2d_json':
                wrapper += `import json; print(json.dumps(result).replace(' ', ''))\n`;
                break;
            case 'array_2d_rows':
                wrapper += `for row in result: print(' '.join(map(str, row)))\n`;
                break;
            default:
                wrapper += `print(result)\n`;
        }
    }

    return wrapper;
}

function generateJsProblemWrapper(code: string, input: ParsedValues, config: ProblemConfig): string {
    const hints = config.wrapperHints?.javascript;
    const funcName = hints?.functionName || 'solution';
    const isVoid = hints?.isVoid || false;

    let wrapper = `${code}\n\n`;

    if (input.array) {
        wrapper += `const arr = [${input.array.join(', ')}];\n`;
    }
    if (input.array2) {
        wrapper += `const arr2 = [${input.array2.join(', ')}];\n`;
    }
    if (input.matrix) {
        const rows = input.matrix.map(row => `[${row.join(', ')}]`).join(', ');
        wrapper += `const matrix = [${rows}];\n`;
    }
    if (input.n !== undefined) {
        wrapper += `const n = ${input.n};\n`;
    }
    if (input.m !== undefined) {
        wrapper += `const m = ${input.m};\n`;
    }
    if (input.k !== undefined) {
        wrapper += `const k = ${input.k};\n`;
    }
    if (input.target !== undefined) {
        wrapper += `const target = ${input.target};\n`;
    }

    const inputFormat = config.inputFormat.type;
    const outputFormat = config.outputFormat.type;

    let funcCall = '';
    switch (inputFormat) {
        case 'n_then_array':
            funcCall = `${funcName}(arr, n)`;
            break;
        case 'n_array_k':
            if (isVoid) {
                funcCall = `${funcName}(arr, n, k)`;
            } else {
                funcCall = `${funcName}(arr, k)`;
            }
            break;
        case 'n_m_2d_matrix':
            funcCall = `${funcName}(matrix)`;
            break;
        case 'n_m_array_target':
            funcCall = `${funcName}(arr, target)`;
            break;
        case 'single_number':
            funcCall = `${funcName}(n)`;
            break;
        default:
            funcCall = `${funcName}(arr)`;
    }

    if (isVoid) {
        wrapper += `${funcCall};\n`;
        switch (outputFormat) {
            case 'array_space_separated':
                wrapper += `console.log(arr.join(' '));\n`;
                break;
            case 'array_2d_rows':
                wrapper += `matrix.forEach(row => console.log(row.join(' ')));\n`;
                break;
            default:
                wrapper += `console.log(arr.join(' '));\n`;
        }
    } else {
        wrapper += `const result = ${funcCall};\n`;
        switch (outputFormat) {
            case 'single_number':
                wrapper += `console.log(result);\n`;
                break;
            case 'boolean':
                wrapper += `console.log(result ? 'true' : 'false');\n`;
                break;
            case 'array_space_separated':
                wrapper += `console.log(result.join(' '));\n`;
                break;
            case 'array_json':
            case 'array_2d_json':
                wrapper += `console.log(JSON.stringify(result));\n`;
                break;
            default:
                wrapper += `console.log(result);\n`;
        }
    }

    return wrapper;
}

function generateJavaProblemWrapper(code: string, input: ParsedValues, config: ProblemConfig): string {
    const hints = config.wrapperHints?.java;
    const funcName = hints?.functionName || 'solution';
    const isVoid = hints?.isVoid || false;

    // Remove public from classes
    let cleanCode = code.replace(/public\s+class/g, 'class');

    let wrapper = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
`;

    if (input.array) {
        wrapper += `        int[] arr = {${input.array.join(', ')}};\n`;
    }
    if (input.array2) {
        wrapper += `        int[] arr2 = {${input.array2.join(', ')}};\n`;
    }
    if (input.matrix) {
        const rows = input.matrix.map(row => `{${row.join(', ')}}`).join(', ');
        wrapper += `        int[][] matrix = {${rows}};\n`;
    }
    if (input.n !== undefined) {
        wrapper += `        int n = ${input.n};\n`;
    }
    if (input.m !== undefined) {
        wrapper += `        int m = ${input.m};\n`;
    }
    if (input.k !== undefined) {
        wrapper += `        int k = ${input.k};\n`;
    }
    if (input.target !== undefined) {
        wrapper += `        int target = ${input.target};\n`;
    }

    wrapper += `        Main sol = new Main();\n`;

    const inputFormat = config.inputFormat.type;
    const outputFormat = config.outputFormat.type;

    let funcCall = '';
    switch (inputFormat) {
        case 'n_then_array':
            funcCall = `sol.${funcName}(arr, n)`;
            break;
        case 'n_array_k':
            funcCall = `sol.${funcName}(arr, k)`;
            break;
        case 'n_m_2d_matrix':
            funcCall = `sol.${funcName}(matrix)`;
            break;
        case 'single_number':
            funcCall = `sol.${funcName}(n)`;
            break;
        default:
            funcCall = `sol.${funcName}(arr)`;
    }

    if (isVoid) {
        wrapper += `        ${funcCall};\n`;
        wrapper += `        StringBuilder sb = new StringBuilder();\n`;
        wrapper += `        for (int i = 0; i < arr.length; i++) { if(i>0) sb.append(" "); sb.append(arr[i]); }\n`;
        wrapper += `        System.out.println(sb);\n`;
    } else {
        wrapper += `        var result = ${funcCall};\n`;
        wrapper += `        System.out.println(result);\n`;
    }

    wrapper += `    }\n`;
    wrapper += `\n${cleanCode}\n`;
    wrapper += `}\n`;

    return wrapper;
}

function generateCProblemWrapper(code: string, input: ParsedValues, config: ProblemConfig): string {
    const hints = config.wrapperHints?.c;
    const funcName = hints?.functionName || 'solution';
    const isVoid = hints?.isVoid || false;

    let wrapper = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <limits.h>

${code}

int main() {
`;

    if (input.array) {
        wrapper += `    int arr[] = {${input.array.join(', ')}};\n`;
        wrapper += `    int arrSize = ${input.array.length};\n`;
    }
    if (input.n !== undefined) {
        wrapper += `    int n = ${input.n};\n`;
    }
    if (input.k !== undefined) {
        wrapper += `    int k = ${input.k};\n`;
    }

    const inputFormat = config.inputFormat.type;
    const outputFormat = config.outputFormat.type;

    let funcCall = '';
    switch (inputFormat) {
        case 'n_then_array':
            funcCall = `${funcName}(arr, n)`;
            break;
        case 'n_array_k':
            funcCall = `${funcName}(arr, n, k)`;
            break;
        default:
            funcCall = `${funcName}(arr, n)`;
    }

    if (isVoid) {
        wrapper += `    ${funcCall};\n`;
        wrapper += `    for (int i = 0; i < n; i++) { if(i>0) printf(" "); printf("%d", arr[i]); }\n`;
    } else {
        if (hints?.returnType === 'int' || hints?.returnType === 'long long') {
            wrapper += `    printf("%d", ${funcCall});\n`;
        } else if (hints?.returnType === 'bool') {
            wrapper += `    printf("%s", ${funcCall} ? "true" : "false");\n`;
        } else {
            wrapper += `    printf("%d", ${funcCall});\n`;
        }
    }

    wrapper += `    return 0;\n`;
    wrapper += `}\n`;

    return wrapper;
}

// ==================== OUTPUT COMPARISON ====================

/**
 * Compare outputs based on the expected output format
 */
function compareOutputs(actual: string, expected: string, format: OutputFormat): boolean {
    const normActual = normalizeOutput(actual.trim());
    const normExpected = normalizeOutput(expected.trim());

    if (normActual === normExpected) return true;

    // Boolean conversion
    if ((normExpected === 'true' && (normActual === '1' || normActual === 'true')) ||
        (normExpected === 'false' && (normActual === '0' || normActual === 'false'))) {
        return true;
    }

    // For unordered arrays, sort and compare
    if (format.type === 'unordered_array' || format.type === 'array_space_separated') {
        const sortedActual = normActual.split(/\s+/).sort((a, b) => Number(a) - Number(b)).join(' ');
        const sortedExpected = normExpected.split(/\s+/).sort((a, b) => Number(a) - Number(b)).join(' ');
        if (sortedActual === sortedExpected) return true;
    }

    return false;
}

function normalizeOutput(str: string): string {
    let normalized = str.trim().toLowerCase();
    normalized = normalized.replace(/[\[\]{},()]/g, ' ');
    normalized = normalized.replace(/\s+/g, ' ').trim();
    if (/^\d+\.0+$/.test(normalized)) {
        normalized = normalized.replace(/\.0+$/, '');
    }
    return normalized;
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

/**
 * Execute code for a specific problem with per-problem configuration
 */
export async function executeProblemCode(
    problemTitle: string,
    language: string,
    code: string,
    testCases: { input: string; output: string }[],
    isHiddenMap: boolean[] = []
): Promise<ExecutionResult[]> {
    const langConfig = LANGUAGE_MAP[language];
    if (!langConfig) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const config = getProblemConfig(problemTitle);
    if (!config) {
        throw new Error(`No configuration found for problem: ${problemTitle}`);
    }

    const results: ExecutionResult[] = [];

    for (let i = 0; i < testCases.length; i++) {
        const tc = testCases[i];
        const isHidden = isHiddenMap[i] || false;

        // Rate limit buffer
        await new Promise(r => setTimeout(r, 300));

        try {
            // Parse input using problem-specific format
            const parsedInput = parseInput(tc.input, config.inputFormat);

            // Generate wrapper using problem-specific configuration
            const wrappedCode = generateProblemWrapper(language, code, parsedInput, config);

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
                const passed = compareOutputs(output, tc.output, config.outputFormat);
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

/**
 * Check if a problem has explicit configuration
 */
export function hasProblemConfig(title: string): boolean {
    return getProblemConfig(title) !== undefined;
}
