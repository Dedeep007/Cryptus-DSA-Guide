/**
 * Problem-Specific Execution Configurations
 * 
 * This file defines explicit input parsing and output formatting rules for each problem.
 * Instead of relying on generic heuristics, each problem has its own configuration.
 */

export interface ProblemConfig {
    // Input parsing configuration
    inputFormat: InputFormat;
    // Output comparison configuration
    outputFormat: OutputFormat;
    // Wrapper generation hints per language
    wrapperHints?: WrapperHints;
}

export type InputFormat =
    | { type: 'n_then_array' }                           // "n\narr" - first line is size, second is space-separated array
    | { type: 'array_only' }                              // Just an array on a single line or multiple lines
    | { type: 'n_array_k' }                               // "n\narr\nk" - size, array, then target/k value
    | { type: 'two_arrays' }                              // "n\narr1\nm\narr2" - two arrays with sizes
    | { type: 'n_m_2d_matrix' }                           // "rows cols\nrow1\nrow2..." - 2D matrix
    | { type: 'n_m_array_target' }                        // "n target\narray" - size and target on first line
    | { type: 'single_number' }                           // Just a single number
    | { type: 'two_numbers_array' }                       // "m n\narr1\narr2" for merge sorted with sizes
    | { type: 'class_transaction' }                       // ["ClassName", "method1"...] / [[args1], [args2]...]
    | { type: 'custom', parser: string };                 // Custom parsing logic

export type OutputFormat =
    | { type: 'single_number' }                           // Just a number
    | { type: 'array_space_separated' }                   // Numbers separated by spaces
    | { type: 'array_json' }                              // [1, 2, 3] format
    | { type: 'array_2d_json' }                           // [[1,2],[3,4]] format
    | { type: 'array_2d_rows' }                           // Multiple rows, each space-separated
    | { type: 'boolean' }                                 // true/false
    | { type: 'string' }                                  // String output
    | { type: 'class_results' }                           // [null, true, false, 1, null...]
    | { type: 'void_array' }                              // Void return, print modified array
    | { type: 'unordered_array' };                        // Order doesn't matter

export interface WrapperHints {
    cpp?: {
        functionName: string;
        paramTypes: string[];
        returnType: string;
        isVoid?: boolean;
    };
    python?: {
        functionName: string;
        paramNames: string[];
    };
    java?: {
        functionName: string;
        className?: string;
    };
    javascript?: {
        functionName: string;
    };
    c?: {
        functionName: string;
        paramTypes: string[];
        returnType: string;
    };
}

/**
 * Problem configurations keyed by problem title (normalized lowercase)
 */
export const PROBLEM_CONFIGS: Record<string, ProblemConfig> = {
    // ========== ARRAYS TOPIC ==========
    "largest element in array": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'largest', paramTypes: ['int[]', 'int'], returnType: 'int' },
            python: { functionName: 'largest', paramNames: ['arr', 'n'] },
            java: { functionName: 'largest' },
            javascript: { functionName: 'largest' },
            c: { functionName: 'largest', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "second largest element": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'print2largest', paramTypes: ['int[]', 'int'], returnType: 'int' },
            python: { functionName: 'print2largest', paramNames: ['arr', 'n'] },
            java: { functionName: 'print2largest' },
            javascript: { functionName: 'print2largest' },
            c: { functionName: 'print2largest', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "check if array is sorted and rotated": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'check', paramTypes: ['vector<int>&'], returnType: 'bool' },
            python: { functionName: 'check', paramNames: ['nums'] },
            java: { functionName: 'check' },
            javascript: { functionName: 'check' },
            c: { functionName: 'check', paramTypes: ['int[]', 'int'], returnType: 'bool' }
        }
    },
    "remove duplicates from sorted array": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'removeDuplicates', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'removeDuplicates', paramNames: ['nums'] },
            java: { functionName: 'removeDuplicates' },
            javascript: { functionName: 'removeDuplicates' },
            c: { functionName: 'removeDuplicates', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "rotate array left by one place": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'rotateArray', paramTypes: ['vector<int>&', 'int'], returnType: 'vector<int>' },
            python: { functionName: 'rotateArray', paramNames: ['arr', 'n'] },
            java: { functionName: 'rotateArray' },
            javascript: { functionName: 'rotateArray' },
            c: { functionName: 'rotateArray', paramTypes: ['int[]', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "rotate array by k places": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'rightRotate', paramTypes: ['vector<int>&', 'int', 'int'], returnType: 'void', isVoid: true },
            python: { functionName: 'rightRotate', paramNames: ['arr', 'n', 'k'] },
            java: { functionName: 'rightRotate' },
            javascript: { functionName: 'rightRotate' },
            c: { functionName: 'rightRotate', paramTypes: ['int[]', 'int', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "move zeros to end": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'moveZeroes', paramTypes: ['vector<int>&'], returnType: 'void', isVoid: true },
            python: { functionName: 'moveZeroes', paramNames: ['nums'] },
            java: { functionName: 'moveZeroes' },
            javascript: { functionName: 'moveZeroes' },
            c: { functionName: 'moveZeroes', paramTypes: ['int[]', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "union of two sorted arrays": {
        inputFormat: { type: 'two_arrays' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'findUnion', paramTypes: ['int[]', 'int[]', 'int', 'int'], returnType: 'vector<int>' },
            python: { functionName: 'findUnion', paramNames: ['arr1', 'arr2', 'n', 'm'] },
            java: { functionName: 'findUnion' },
            javascript: { functionName: 'findUnion' },
            c: { functionName: 'findUnion', paramTypes: ['int[]', 'int[]', 'int', 'int', 'int*'], returnType: 'int*' }
        }
    },
    "max consecutive ones": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'findMaxConsecutiveOnes', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'findMaxConsecutiveOnes', paramNames: ['nums'] },
            java: { functionName: 'findMaxConsecutiveOnes' },
            javascript: { functionName: 'findMaxConsecutiveOnes' },
            c: { functionName: 'findMaxConsecutiveOnes', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "longest subarray with given sum": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'longestSubarrayWithSumK', paramTypes: ['vector<int>', 'long long'], returnType: 'int' },
            python: { functionName: 'longestSubarrayWithSumK', paramNames: ['a', 'k'] },
            java: { functionName: 'longestSubarrayWithSumK' },
            javascript: { functionName: 'longestSubarrayWithSumK' },
            c: { functionName: 'longestSubarrayWithSumK', paramTypes: ['int[]', 'int', 'long long'], returnType: 'int' }
        }
    },
    "single number": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'singleNumber', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'singleNumber', paramNames: ['nums'] },
            java: { functionName: 'singleNumber' },
            javascript: { functionName: 'singleNumber' },
            c: { functionName: 'singleNumber', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "linear search": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'search', paramTypes: ['vector<int>&', 'int'], returnType: 'int' },
            python: { functionName: 'search', paramNames: ['arr', 'x'] },
            java: { functionName: 'search' },
            javascript: { functionName: 'search' },
            c: { functionName: 'search', paramTypes: ['int[]', 'int', 'int'], returnType: 'int' }
        }
    },
    "missing number": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'missingNumber', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'missingNumber', paramNames: ['nums'] },
            java: { functionName: 'missingNumber' },
            javascript: { functionName: 'missingNumber' },
            c: { functionName: 'missingNumber', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "two sum": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'twoSum', paramTypes: ['vector<int>&', 'int'], returnType: 'vector<int>' },
            python: { functionName: 'twoSum', paramNames: ['nums', 'target'] },
            java: { functionName: 'twoSum' },
            javascript: { functionName: 'twoSum' },
            c: { functionName: 'twoSum', paramTypes: ['int[]', 'int', 'int', 'int*'], returnType: 'int*' }
        }
    },
    "sort 0s, 1s, and 2s": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'sortColors', paramTypes: ['vector<int>&'], returnType: 'void', isVoid: true },
            python: { functionName: 'sortColors', paramNames: ['nums'] },
            java: { functionName: 'sortColors' },
            javascript: { functionName: 'sortColors' },
            c: { functionName: 'sortColors', paramTypes: ['int[]', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "kadane's algorithm": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'maxSubArray', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'maxSubArray', paramNames: ['nums'] },
            java: { functionName: 'maxSubArray' },
            javascript: { functionName: 'maxSubArray' },
            c: { functionName: 'maxSubArray', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "best time to buy and sell stock": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'maxProfit', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'maxProfit', paramNames: ['prices'] },
            java: { functionName: 'maxProfit' },
            javascript: { functionName: 'maxProfit' },
            c: { functionName: 'maxProfit', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "rearrange array elements by sign": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'rearrangeArray', paramTypes: ['vector<int>&'], returnType: 'vector<int>' },
            python: { functionName: 'rearrangeArray', paramNames: ['nums'] },
            java: { functionName: 'rearrangeArray' },
            javascript: { functionName: 'rearrangeArray' },
            c: { functionName: 'rearrangeArray', paramTypes: ['int[]', 'int', 'int[]'], returnType: 'void', isVoid: true }
        }
    },
    "3sum": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'threeSum', paramTypes: ['vector<int>&'], returnType: 'vector<vector<int>>' },
            python: { functionName: 'threeSum', paramNames: ['nums'] },
            java: { functionName: 'threeSum' },
            javascript: { functionName: 'threeSum' },
            c: { functionName: 'threeSum', paramTypes: ['int*', 'int', 'int*', 'int**'], returnType: 'int**' }
        }
    },
    "maximum product subarray": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'maxProduct', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'maxProduct', paramNames: ['nums'] },
            java: { functionName: 'maxProduct' },
            javascript: { functionName: 'maxProduct' },
            c: { functionName: 'maxProduct', paramTypes: ['int[]', 'int'], returnType: 'int' }
        }
    },
    "majority element": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'majorityElement', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'majorityElement', paramNames: ['nums'] },
            java: { functionName: 'majorityElement' },
            javascript: { functionName: 'majorityElement' },
            c: { functionName: 'majorityElement', paramTypes: ['int*', 'int'], returnType: 'int' }
        }
    },
    "number of subarrays with sum k": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'subarraySum', paramTypes: ['vector<int>&', 'int'], returnType: 'int' },
            python: { functionName: 'subarraySum', paramNames: ['nums', 'k'] },
            java: { functionName: 'subarraySum' },
            javascript: { functionName: 'subarraySum' },
            c: { functionName: 'subarraySum', paramTypes: ['int*', 'int', 'int'], returnType: 'int' }
        }
    },
    "leaders in an array": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'leaders', paramTypes: ['int[]', 'int'], returnType: 'vector<int>' },
            python: { functionName: 'leaders', paramNames: ['a', 'n'] },
            java: { functionName: 'leaders' },
            javascript: { functionName: 'leaders' },
            c: { functionName: 'leaders', paramTypes: ['int[]', 'int', 'int*'], returnType: 'int*' }
        }
    },
    "longest consecutive subsequence": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'longestConsecutive', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'longestConsecutive', paramNames: ['nums'] },
            java: { functionName: 'longestConsecutive' },
            javascript: { functionName: 'longestConsecutive' },
            c: { functionName: 'longestConsecutive', paramTypes: ['int*', 'int'], returnType: 'int' }
        }
    },
    "set matrix zeroes": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_2d_rows' },
        wrapperHints: {
            cpp: { functionName: 'setZeroes', paramTypes: ['vector<vector<int>>&'], returnType: 'void', isVoid: true },
            python: { functionName: 'setZeroes', paramNames: ['matrix'] },
            java: { functionName: 'setZeroes' },
            javascript: { functionName: 'setZeroes' },
            c: { functionName: 'setZeroes', paramTypes: ['int**', 'int', 'int*'], returnType: 'void', isVoid: true }
        }
    },
    "rotate matrix": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_2d_rows' },
        wrapperHints: {
            cpp: { functionName: 'rotate', paramTypes: ['vector<vector<int>>&'], returnType: 'void', isVoid: true },
            python: { functionName: 'rotate', paramNames: ['matrix'] },
            java: { functionName: 'rotate' },
            javascript: { functionName: 'rotate' },
            c: { functionName: 'rotate', paramTypes: ['int**', 'int', 'int*'], returnType: 'void', isVoid: true }
        }
    },
    "spiral matrix": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'spiralOrder', paramTypes: ['vector<vector<int>>&'], returnType: 'vector<int>' },
            python: { functionName: 'spiralOrder', paramNames: ['matrix'] },
            java: { functionName: 'spiralOrder' },
            javascript: { functionName: 'spiralOrder' },
            c: { functionName: 'spiralOrder', paramTypes: ['int**', 'int', 'int*', 'int*'], returnType: 'int*' }
        }
    },
    "pascal's triangle": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'generate', paramTypes: ['int'], returnType: 'vector<vector<int>>' },
            python: { functionName: 'generate', paramNames: ['numRows'] },
            java: { functionName: 'generate' },
            javascript: { functionName: 'generate' },
            c: { functionName: 'generate', paramTypes: ['int', 'int*', 'int**'], returnType: 'int**' }
        }
    },
    "majority element ii": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'majorityElement', paramTypes: ['vector<int>&'], returnType: 'vector<int>' },
            python: { functionName: 'majorityElement', paramNames: ['nums'] },
            java: { functionName: 'majorityElement' },
            javascript: { functionName: 'majorityElement' },
            c: { functionName: 'majorityElement', paramTypes: ['int*', 'int', 'int*'], returnType: 'int*' }
        }
    },
    "4sum": {
        inputFormat: { type: 'n_m_array_target' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'fourSum', paramTypes: ['vector<int>&', 'int'], returnType: 'vector<vector<int>>' },
            python: { functionName: 'fourSum', paramNames: ['nums', 'target'] },
            java: { functionName: 'fourSum' },
            javascript: { functionName: 'fourSum' },
            c: { functionName: 'fourSum', paramTypes: ['int*', 'int', 'int', 'int*', 'int**'], returnType: 'int**' }
        }
    },
    "largest subarray with 0 sum": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'maxLen', paramTypes: ['vector<int>&', 'int'], returnType: 'int' },
            python: { functionName: 'maxLen', paramNames: ['arr', 'n'] },
            java: { functionName: 'maxLen' },
            javascript: { functionName: 'maxLen' },
            c: { functionName: 'maxLen', paramTypes: ['int*', 'int'], returnType: 'int' }
        }
    },
    "subarrays with xor k": {
        inputFormat: { type: 'n_m_array_target' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'solve', paramTypes: ['vector<int>&', 'int'], returnType: 'int' },
            python: { functionName: 'solve', paramNames: ['a', 'b'] },
            java: { functionName: 'solve' },
            javascript: { functionName: 'solve' },
            c: { functionName: 'solve', paramTypes: ['int*', 'int', 'int'], returnType: 'int' }
        }
    },
    "merge overlapping intervals": {
        inputFormat: { type: 'n_then_array' },  // n intervals on one line as pairs
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'merge', paramTypes: ['vector<vector<int>>&'], returnType: 'vector<vector<int>>' },
            python: { functionName: 'merge', paramNames: ['intervals'] },
            java: { functionName: 'merge' },
            javascript: { functionName: 'merge' },
            c: { functionName: 'merge', paramTypes: ['int**', 'int', 'int*', 'int*', 'int**'], returnType: 'int**' }
        }
    },
    "merge sorted array (in-place)": {
        inputFormat: { type: 'two_numbers_array' },  // "m n\nnums1\nnums2"
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'merge', paramTypes: ['vector<int>&', 'int', 'vector<int>&', 'int'], returnType: 'void', isVoid: true },
            python: { functionName: 'merge', paramNames: ['nums1', 'm', 'nums2', 'n'] },
            java: { functionName: 'merge' },
            javascript: { functionName: 'merge' },
            c: { functionName: 'merge', paramTypes: ['int*', 'int', 'int*', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "repeating and missing numbers": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'findMissingRepeating', paramTypes: ['vector<int>', 'int'], returnType: 'vector<int>' },
            python: { functionName: 'findMissingRepeating', paramNames: ['arr', 'n'] },
            java: { functionName: 'findMissingRepeating' },
            javascript: { functionName: 'findMissingRepeating' },
            c: { functionName: 'findMissingRepeating', paramTypes: ['int*', 'int'], returnType: 'int*' }
        }
    },
    "next permutation": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'nextPermutation', paramTypes: ['vector<int>&'], returnType: 'void', isVoid: true },
            python: { functionName: 'nextPermutation', paramNames: ['nums'] },
            java: { functionName: 'nextPermutation' },
            javascript: { functionName: 'nextPermutation' },
            c: { functionName: 'nextPermutation', paramTypes: ['int*', 'int'], returnType: 'void', isVoid: true }
        }
    },
    "count inversions": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'numberOfInversions', paramTypes: ['vector<int>&', 'int'], returnType: 'long long' },
            python: { functionName: 'numberOfInversions', paramNames: ['arr', 'n'] },
            java: { functionName: 'numberOfInversions' },
            javascript: { functionName: 'numberOfInversions' },
            c: { functionName: 'numberOfInversions', paramTypes: ['int*', 'int'], returnType: 'long long' }
        }
    },
    "reverse pairs": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'reversePairs', paramTypes: ['vector<int>&'], returnType: 'int' },
            python: { functionName: 'reversePairs', paramNames: ['nums'] },
            java: { functionName: 'reversePairs' },
            javascript: { functionName: 'reversePairs' },
            c: { functionName: 'reversePairs', paramTypes: ['int*', 'int'], returnType: 'int' }
        }
    },

    // ========== TRIES TOPIC ==========
    "implement trie (prefix tree)": {
        inputFormat: { type: 'class_transaction' },
        outputFormat: { type: 'class_results' },
        wrapperHints: {
            cpp: { functionName: 'Trie', paramTypes: [], returnType: 'class' },
            python: { functionName: 'Trie', paramNames: [] },
            java: { functionName: 'Trie', className: 'Trie' },
            javascript: { functionName: 'Trie' },
            c: { functionName: 'trieCreate', paramTypes: [], returnType: 'Trie*' }
        }
    },
    "implement trie ii (prefix tree)": {
        inputFormat: { type: 'class_transaction' },
        outputFormat: { type: 'class_results' },
        wrapperHints: {
            cpp: { functionName: 'Trie', paramTypes: [], returnType: 'class' },
            python: { functionName: 'Trie', paramNames: [] },
            java: { functionName: 'Trie', className: 'Trie' },
            javascript: { functionName: 'Trie' },
            c: { functionName: 'trieCreate', paramTypes: [], returnType: 'Trie*' }
        }
    }
};

/**
 * Get problem config by title (case-insensitive lookup)
 */
export function getProblemConfig(title: string): ProblemConfig | undefined {
    const normalizedTitle = title.toLowerCase().trim();
    return PROBLEM_CONFIGS[normalizedTitle];
}

/**
 * Normalize a problem title for lookup
 */
export function normalizeTitle(title: string): string {
    return title.toLowerCase().trim();
}
