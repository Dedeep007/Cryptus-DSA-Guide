/**
 * Problem-Specific Execution Configurations
 * Each problem has explicit input parsing and output formatting rules.
 */

export interface ProblemConfig {
    inputFormat: InputFormat;
    outputFormat: OutputFormat;
    wrapperHints?: WrapperHints;
}

export type InputFormat =
    | { type: 'n_then_array' }
    | { type: 'array_only' }
    | { type: 'n_array_k' }
    | { type: 'two_arrays' }
    | { type: 'n_m_2d_matrix' }
    | { type: 'n_m_array_target' }
    | { type: 'single_number' }
    | { type: 'two_numbers_array' }
    | { type: 'class_transaction' }
    | { type: 'custom', parser: string };

export type OutputFormat =
    | { type: 'single_number' }
    | { type: 'array_space_separated' }
    | { type: 'array_json' }
    | { type: 'array_2d_json' }
    | { type: 'array_2d_rows' }
    | { type: 'boolean' }
    | { type: 'string' }
    | { type: 'class_results' }
    | { type: 'void_array' }
    | { type: 'unordered_array' };

export interface WrapperHints {
    cpp?: { functionName: string; paramTypes?: string[]; returnType?: string; isVoid?: boolean };
    python?: { functionName: string; paramNames?: string[]; isVoid?: boolean };
    java?: { functionName: string; className?: string; isVoid?: boolean };
    javascript?: { functionName: string; isVoid?: boolean };
    c?: { functionName: string; paramTypes?: string[]; returnType?: string; isVoid?: boolean };
}

// Helper to create common config patterns
// For C++/Python/Java/JS: function takes only array (uses .size()/.length)
// For C: function takes array and size
const arrayToNumber = (fn: string, pyParams?: string[]): ProblemConfig => ({
    inputFormat: { type: 'n_then_array' },
    outputFormat: { type: 'single_number' },
    wrapperHints: {
        cpp: { functionName: fn, paramTypes: ['vector<int>&'], returnType: 'int' },
        python: { functionName: fn, paramNames: pyParams || ['arr'] },
        javascript: { functionName: fn },
        java: { functionName: fn },
        c: { functionName: fn, paramTypes: ['int[]', 'int'], returnType: 'int' }
    }
});

const arrayVoidModify = (fn: string): ProblemConfig => ({
    inputFormat: { type: 'n_then_array' },
    outputFormat: { type: 'array_space_separated' },
    wrapperHints: {
        cpp: { functionName: fn, paramTypes: ['vector<int>&'], isVoid: true },
        python: { functionName: fn, paramNames: ['nums'], isVoid: true },
        javascript: { functionName: fn, isVoid: true },
        java: { functionName: fn, isVoid: true },
        c: { functionName: fn, paramTypes: ['int[]', 'int'], isVoid: true }
    }
});

const arrayToArray = (fn: string, pyParams?: string[]): ProblemConfig => ({
    inputFormat: { type: 'n_then_array' },
    outputFormat: { type: 'array_space_separated' },
    wrapperHints: {
        cpp: { functionName: fn, paramTypes: ['vector<int>&'], returnType: 'vector<int>' },
        python: { functionName: fn, paramNames: pyParams || ['arr'] },
        javascript: { functionName: fn },
        java: { functionName: fn },
        c: { functionName: fn, paramTypes: ['int[]', 'int'], returnType: 'int*' }
    }
});

const arrayKToNumber = (fn: string): ProblemConfig => ({
    inputFormat: { type: 'n_array_k' },
    outputFormat: { type: 'single_number' },
    wrapperHints: {
        cpp: { functionName: fn, paramTypes: ['vector<int>&', 'int'], returnType: 'int' },
        python: { functionName: fn, paramNames: ['arr', 'k'] },
        javascript: { functionName: fn },
        java: { functionName: fn },
        c: { functionName: fn, paramTypes: ['int[]', 'int', 'int'], returnType: 'int' }
    }
});

export const PROBLEM_CONFIGS: Record<string, ProblemConfig> = {
    // ========== ARRAYS ==========
    "largest element in array": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'largest', paramTypes: ['int[]', 'int'], returnType: 'int' },
            python: { functionName: 'largest', paramNames: ['arr', 'n'] },
            javascript: { functionName: 'largest' },
            java: { functionName: 'largest' },
            c: { functionName: 'largest', returnType: 'int' }
        }
    },
    "second largest element": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'print2largest', paramTypes: ['int[]', 'int'], returnType: 'int' },
            python: { functionName: 'print2largest', paramNames: ['arr', 'n'] },
            javascript: { functionName: 'print2largest' },
            java: { functionName: 'print2largest' },
            c: { functionName: 'print2largest', returnType: 'int' }
        }
    },
    "check if array is sorted and rotated": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'check', paramTypes: ['vector<int>&'], returnType: 'bool' },
            python: { functionName: 'check', paramNames: ['nums'] },
            javascript: { functionName: 'check' },
            java: { functionName: 'check' },
            c: { functionName: 'check', paramTypes: ['int[]', 'int'], returnType: 'bool' }
        }
    },
    "remove duplicates from sorted array": arrayToNumber('removeDuplicates', ['nums']),
    "rotate array left by one place": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'rotateArray', returnType: 'vector<int>' },
            python: { functionName: 'rotateArray', paramNames: ['arr', 'n'] },
            javascript: { functionName: 'rotateArray' },
            java: { functionName: 'rotateArray' },
            c: { functionName: 'rotateArray', isVoid: true }
        }
    },
    "rotate array by k places": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'rightRotate', isVoid: true },
            python: { functionName: 'rightRotate', paramNames: ['arr', 'n', 'k'], isVoid: true },
            javascript: { functionName: 'rightRotate', isVoid: true },
            java: { functionName: 'rightRotate', isVoid: true },
            c: { functionName: 'rightRotate', isVoid: true }
        }
    },
    "move zeros to end": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'moveZeroes', paramTypes: ['vector<int>&'], isVoid: true },
            python: { functionName: 'moveZeroes', paramNames: ['nums'], isVoid: true },
            javascript: { functionName: 'moveZeroes', isVoid: true },
            java: { functionName: 'moveZeroes', isVoid: true },
            c: { functionName: 'moveZeroes', paramTypes: ['int[]', 'int'], isVoid: true }
        }
    },
    "union of two sorted arrays": {
        inputFormat: { type: 'two_arrays' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'findUnion', returnType: 'vector<int>' },
            python: { functionName: 'findUnion', paramNames: ['arr1', 'arr2', 'n', 'm'] },
            javascript: { functionName: 'findUnion' },
            java: { functionName: 'findUnion' },
            c: { functionName: 'findUnion', returnType: 'int*' }
        }
    },
    "max consecutive ones": arrayToNumber('findMaxConsecutiveOnes', ['nums']),
    "longest subarray with given sum": arrayKToNumber('longestSubarrayWithSumK'),
    "single number": arrayToNumber('singleNumber', ['nums']),
    "linear search": arrayKToNumber('search'),
    "missing number": arrayToNumber('missingNumber', ['nums']),
    "two sum": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'twoSum', returnType: 'vector<int>' },
            python: { functionName: 'twoSum', paramNames: ['nums', 'target'] },
            javascript: { functionName: 'twoSum' },
            java: { functionName: 'twoSum' },
            c: { functionName: 'twoSum', returnType: 'int*' }
        }
    },
    "sort 0s, 1s, and 2s": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'sortColors', paramTypes: ['vector<int>&'], isVoid: true },
            python: { functionName: 'sortColors', paramNames: ['nums'], isVoid: true },
            javascript: { functionName: 'sortColors', isVoid: true },
            java: { functionName: 'sortColors', isVoid: true },
            c: { functionName: 'sortColors', paramTypes: ['int[]', 'int'], isVoid: true }
        }
    },
    "kadane's algorithm": arrayToNumber('maxSubArray', ['nums']),
    "best time to buy and sell stock": arrayToNumber('maxProfit', ['prices']),
    "rearrange array elements by sign": arrayToArray('rearrangeArray', ['nums']),
    "3sum": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'threeSum', returnType: 'vector<vector<int>>' },
            python: { functionName: 'threeSum', paramNames: ['nums'] },
            javascript: { functionName: 'threeSum' },
            java: { functionName: 'threeSum' },
            c: { functionName: 'threeSum', returnType: 'int**' }
        }
    },
    "maximum product subarray": arrayToNumber('maxProduct', ['nums']),
    "majority element": arrayToNumber('majorityElement', ['nums']),
    "number of subarrays with sum k": arrayKToNumber('subarraySum'),
    "leaders in an array": arrayToArray('leaders', ['a', 'n']),
    "longest consecutive subsequence": arrayToNumber('longestConsecutive', ['nums']),
    "set matrix zeroes": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_2d_rows' },
        wrapperHints: {
            cpp: { functionName: 'setZeroes', paramTypes: ['vector<vector<int>>&'], isVoid: true },
            python: { functionName: 'setZeroes', paramNames: ['matrix'], isVoid: true },
            javascript: { functionName: 'setZeroes', isVoid: true },
            java: { functionName: 'setZeroes', isVoid: true },
            c: { functionName: 'setZeroes', paramTypes: ['int**', 'int', 'int'], isVoid: true }
        }
    },
    "rotate matrix": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_2d_rows' },
        wrapperHints: {
            cpp: { functionName: 'rotate', paramTypes: ['vector<vector<int>>&'], isVoid: true },
            python: { functionName: 'rotate', paramNames: ['matrix'], isVoid: true },
            javascript: { functionName: 'rotate', isVoid: true },
            java: { functionName: 'rotate', isVoid: true },
            c: { functionName: 'rotate', paramTypes: ['int**', 'int'], isVoid: true }
        }
    },
    "spiral matrix": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'spiralOrder', returnType: 'vector<int>' },
            python: { functionName: 'spiralOrder', paramNames: ['matrix'] },
            javascript: { functionName: 'spiralOrder' },
            java: { functionName: 'spiralOrder' },
            c: { functionName: 'spiralOrder', returnType: 'int*' }
        }
    },
    "pascal's triangle": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'generate', returnType: 'vector<vector<int>>' },
            python: { functionName: 'generate', paramNames: ['numRows'] },
            javascript: { functionName: 'generate' },
            java: { functionName: 'generate' },
            c: { functionName: 'generate', returnType: 'int**' }
        }
    },
    "majority element ii": arrayToArray('majorityElement', ['nums']),
    "4sum": {
        inputFormat: { type: 'n_m_array_target' },
        outputFormat: { type: 'array_2d_json' },
        wrapperHints: {
            cpp: { functionName: 'fourSum', returnType: 'vector<vector<int>>' },
            python: { functionName: 'fourSum', paramNames: ['nums', 'target'] },
            javascript: { functionName: 'fourSum' },
            java: { functionName: 'fourSum' },
            c: { functionName: 'fourSum', returnType: 'int**' }
        }
    },
    "largest subarray with 0 sum": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'maxLen', returnType: 'int' },
            python: { functionName: 'maxLen', paramNames: ['arr', 'n'] },
            javascript: { functionName: 'maxLen' },
            java: { functionName: 'maxLen' },
            c: { functionName: 'maxLen', returnType: 'int' }
        }
    },
    "subarrays with xor k": {
        inputFormat: { type: 'n_m_array_target' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'solve', returnType: 'int' },
            python: { functionName: 'solve', paramNames: ['a', 'b'] },
            javascript: { functionName: 'solve' },
            java: { functionName: 'solve' },
            c: { functionName: 'solve', returnType: 'int' }
        }
    },
    "merge overlapping intervals": arrayToArray('merge', ['intervals']),
    "merge sorted array (in-place)": {
        inputFormat: { type: 'two_numbers_array' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'merge', isVoid: true },
            python: { functionName: 'merge', paramNames: ['nums1', 'm', 'nums2', 'n'], isVoid: true },
            javascript: { functionName: 'merge', isVoid: true },
            java: { functionName: 'merge', isVoid: true },
            c: { functionName: 'merge', isVoid: true }
        }
    },
    "repeating and missing numbers": arrayToArray('findMissingRepeating', ['arr', 'n']),
    "next permutation": arrayVoidModify('nextPermutation'),
    "count inversions": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'numberOfInversions', returnType: 'long long' },
            python: { functionName: 'numberOfInversions', paramNames: ['arr', 'n'] },
            javascript: { functionName: 'numberOfInversions' },
            java: { functionName: 'numberOfInversions' },
            c: { functionName: 'numberOfInversions', returnType: 'long long' }
        }
    },
    "reverse pairs": arrayToNumber('reversePairs', ['nums']),

    // ========== BINARY SEARCH ==========
    "binary search": arrayKToNumber('search'),
    "lower bound": arrayKToNumber('lowerBound'),
    "upper bound": arrayKToNumber('upperBound'),
    "search insert position": arrayKToNumber('searchInsert'),
    "check if array is sorted": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isSorted', returnType: 'bool' },
            python: { functionName: 'isSorted', paramNames: ['arr'] },
            javascript: { functionName: 'isSorted' },
            java: { functionName: 'isSorted' },
            c: { functionName: 'isSorted', returnType: 'bool' }
        }
    },
    "first and last position of element": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'searchRange', returnType: 'vector<int>' },
            python: { functionName: 'searchRange', paramNames: ['nums', 'target'] },
            javascript: { functionName: 'searchRange' },
            java: { functionName: 'searchRange' },
            c: { functionName: 'searchRange', returnType: 'int*' }
        }
    },
    "number of occurrences": arrayKToNumber('count'),
    "find peak element": arrayToNumber('findPeakElement', ['nums']),
    "search in rotated sorted array": arrayKToNumber('search'),
    "search in rotated sorted array with duplicates": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'search', returnType: 'bool' },
            python: { functionName: 'search', paramNames: ['nums', 'target'] },
            javascript: { functionName: 'search' },
            java: { functionName: 'search' },
            c: { functionName: 'search', returnType: 'bool' }
        }
    },
    "find minimum in rotated sorted array": arrayToNumber('findMin', ['nums']),
    "find single element in sorted array": arrayToNumber('singleNonDuplicate', ['nums']),
    "find how many times array is rotated": arrayToNumber('findKRotation', ['arr']),
    "square root of number": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'mySqrt', returnType: 'int' },
            python: { functionName: 'mySqrt', paramNames: ['x'] },
            javascript: { functionName: 'mySqrt' },
            java: { functionName: 'mySqrt' },
            c: { functionName: 'mySqrt', returnType: 'int' }
        }
    },
    "nth root of integer": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'NthRoot', returnType: 'int' },
            python: { functionName: 'NthRoot', paramNames: ['n', 'm'] },
            javascript: { functionName: 'NthRoot' },
            java: { functionName: 'NthRoot' },
            c: { functionName: 'NthRoot', returnType: 'int' }
        }
    },
    "koko eating bananas": arrayKToNumber('minEatingSpeed'),
    "minimum days to make bouquets": arrayKToNumber('minDays'),
    "find smallest divisor": arrayKToNumber('smallestDivisor'),
    "capacity to ship packages": arrayKToNumber('shipWithinDays'),
    "aggressive cows problem": arrayKToNumber('aggressiveCows'),
    "book allocation": arrayKToNumber('findPages'),
    "split array largest sum": arrayKToNumber('splitArray'),
    "kth missing number": arrayKToNumber('findKthPositive'),
    "median of two sorted arrays": {
        inputFormat: { type: 'two_arrays' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'findMedianSortedArrays', returnType: 'double' },
            python: { functionName: 'findMedianSortedArrays', paramNames: ['nums1', 'nums2'] },
            javascript: { functionName: 'findMedianSortedArrays' },
            java: { functionName: 'findMedianSortedArrays' },
            c: { functionName: 'findMedianSortedArrays', returnType: 'double' }
        }
    },

    // ========== LINKED LIST (basic structure) ==========
    "reverse linked list": arrayToArray('reverseList', ['head']),
    "middle of linked list": arrayToNumber('middleNode', ['head']),
    "detect cycle in linked list": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'hasCycle', returnType: 'bool' },
            python: { functionName: 'hasCycle', paramNames: ['head'] },
            javascript: { functionName: 'hasCycle' },
            java: { functionName: 'hasCycle' },
            c: { functionName: 'hasCycle', returnType: 'bool' }
        }
    },
    "merge two sorted lists": {
        inputFormat: { type: 'two_arrays' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'mergeTwoLists', returnType: 'ListNode*' },
            python: { functionName: 'mergeTwoLists', paramNames: ['list1', 'list2'] },
            javascript: { functionName: 'mergeTwoLists' },
            java: { functionName: 'mergeTwoLists' },
            c: { functionName: 'mergeTwoLists', returnType: 'ListNode*' }
        }
    },

    // ========== BIT MANIPULATION ==========
    "bit manipulation fundamentals": arrayToNumber('bitManipulation', ['n']),
    "check if kth bit is set": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'checkKthBit', returnType: 'bool' },
            python: { functionName: 'checkKthBit', paramNames: ['n', 'k'] },
            javascript: { functionName: 'checkKthBit' },
            java: { functionName: 'checkKthBit' },
            c: { functionName: 'checkKthBit', returnType: 'bool' }
        }
    },
    "check for odd or even": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'string' },
        wrapperHints: {
            cpp: { functionName: 'oddOrEven', returnType: 'string' },
            python: { functionName: 'oddOrEven', paramNames: ['n'] },
            javascript: { functionName: 'oddOrEven' },
            java: { functionName: 'oddOrEven' },
            c: { functionName: 'oddOrEven', returnType: 'char*' }
        }
    },
    "check if number is power of 2": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isPowerOfTwo', returnType: 'bool' },
            python: { functionName: 'isPowerOfTwo', paramNames: ['n'] },
            javascript: { functionName: 'isPowerOfTwo' },
            java: { functionName: 'isPowerOfTwo' },
            c: { functionName: 'isPowerOfTwo', returnType: 'bool' }
        }
    },
    "swap two numbers": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'swapNumbers', returnType: 'vector<int>' },
            python: { functionName: 'swapNumbers', paramNames: ['a', 'b'] },
            javascript: { functionName: 'swapNumbers' },
            java: { functionName: 'swapNumbers' },
            c: { functionName: 'swapNumbers', returnType: 'void', isVoid: true }
        }
    },
    "count set bits from 1 to n": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'countSetBits', returnType: 'int' },
            python: { functionName: 'countSetBits', paramNames: ['n'] },
            javascript: { functionName: 'countSetBits' },
            java: { functionName: 'countSetBits' },
            c: { functionName: 'countSetBits', returnType: 'int' }
        }
    },
    "sieve of eratosthenes": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'array_space_separated' },
        wrapperHints: {
            cpp: { functionName: 'sieveOfEratosthenes', returnType: 'vector<int>' },
            python: { functionName: 'sieveOfEratosthenes', paramNames: ['n'] },
            javascript: { functionName: 'sieveOfEratosthenes' },
            java: { functionName: 'sieveOfEratosthenes' },
            c: { functionName: 'sieveOfEratosthenes', returnType: 'int*' }
        }
    },

    // ========== RECURSION ==========
    "n-th fibonacci number": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'fib', returnType: 'int' },
            python: { functionName: 'fib', paramNames: ['n'] },
            javascript: { functionName: 'fib' },
            java: { functionName: 'fib' },
            c: { functionName: 'fib', returnType: 'int' }
        }
    },
    "climbing stairs": {
        inputFormat: { type: 'single_number' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'climbStairs', returnType: 'int' },
            python: { functionName: 'climbStairs', paramNames: ['n'] },
            javascript: { functionName: 'climbStairs' },
            java: { functionName: 'climbStairs' },
            c: { functionName: 'climbStairs', returnType: 'int' }
        }
    },
    "house robber": arrayToNumber('rob', ['nums']),
    "house robber ii": arrayToNumber('rob', ['nums']),
    "unique paths": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'uniquePaths', returnType: 'int' },
            python: { functionName: 'uniquePaths', paramNames: ['m', 'n'] },
            javascript: { functionName: 'uniquePaths' },
            java: { functionName: 'uniquePaths' },
            c: { functionName: 'uniquePaths', returnType: 'int' }
        }
    },
    "coin change": arrayKToNumber('coinChange'),
    "0/1 knapsack": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'knapsack', returnType: 'int' },
            python: { functionName: 'knapsack', paramNames: ['W', 'wt', 'val', 'n'] },
            javascript: { functionName: 'knapsack' },
            java: { functionName: 'knapsack' },
            c: { functionName: 'knapsack', returnType: 'int' }
        }
    },

    // ========== STACK AND QUEUES ==========
    "implement stack using array": {
        inputFormat: { type: 'class_transaction' },
        outputFormat: { type: 'class_results' },
        wrapperHints: {
            cpp: { functionName: 'Stack', returnType: 'class' },
            python: { functionName: 'Stack', paramNames: [] },
            javascript: { functionName: 'Stack' },
            java: { functionName: 'Stack', className: 'Stack' },
            c: { functionName: 'createStack', returnType: 'Stack*' }
        }
    },
    "valid parenthesis": {
        inputFormat: { type: 'array_only' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isValid', returnType: 'bool' },
            python: { functionName: 'isValid', paramNames: ['s'] },
            javascript: { functionName: 'isValid' },
            java: { functionName: 'isValid' },
            c: { functionName: 'isValid', returnType: 'bool' }
        }
    },
    "next greater element": arrayToArray('nextGreaterElement', ['nums']),
    "trapping rainwater": arrayToNumber('trap', ['height']),
    "largest rectangle in histogram": arrayToNumber('largestRectangleArea', ['heights']),

    // ========== GREEDY ==========
    "assign cookies": {
        inputFormat: { type: 'two_arrays' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'findContentChildren', returnType: 'int' },
            python: { functionName: 'findContentChildren', paramNames: ['g', 's'] },
            javascript: { functionName: 'findContentChildren' },
            java: { functionName: 'findContentChildren' },
            c: { functionName: 'findContentChildren', returnType: 'int' }
        }
    },
    "fractional knapsack": {
        inputFormat: { type: 'n_array_k' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'fractionalKnapsack', returnType: 'double' },
            python: { functionName: 'fractionalKnapsack', paramNames: ['W', 'arr', 'n'] },
            javascript: { functionName: 'fractionalKnapsack' },
            java: { functionName: 'fractionalKnapsack' },
            c: { functionName: 'fractionalKnapsack', returnType: 'double' }
        }
    },
    "jump game": {
        inputFormat: { type: 'n_then_array' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'canJump', returnType: 'bool' },
            python: { functionName: 'canJump', paramNames: ['nums'] },
            javascript: { functionName: 'canJump' },
            java: { functionName: 'canJump' },
            c: { functionName: 'canJump', returnType: 'bool' }
        }
    },
    "jump game ii": arrayToNumber('jump', ['nums']),

    // ========== STRINGS ==========
    "reverse string": {
        inputFormat: { type: 'array_only' },
        outputFormat: { type: 'string' },
        wrapperHints: {
            cpp: { functionName: 'reverseString', isVoid: true },
            python: { functionName: 'reverseString', paramNames: ['s'], isVoid: true },
            javascript: { functionName: 'reverseString', isVoid: true },
            java: { functionName: 'reverseString', isVoid: true },
            c: { functionName: 'reverseString', isVoid: true }
        }
    },
    "valid palindrome": {
        inputFormat: { type: 'array_only' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isPalindrome', returnType: 'bool' },
            python: { functionName: 'isPalindrome', paramNames: ['s'] },
            javascript: { functionName: 'isPalindrome' },
            java: { functionName: 'isPalindrome' },
            c: { functionName: 'isPalindrome', returnType: 'bool' }
        }
    },
    "longest palindromic substring": {
        inputFormat: { type: 'array_only' },
        outputFormat: { type: 'string' },
        wrapperHints: {
            cpp: { functionName: 'longestPalindrome', returnType: 'string' },
            python: { functionName: 'longestPalindrome', paramNames: ['s'] },
            javascript: { functionName: 'longestPalindrome' },
            java: { functionName: 'longestPalindrome' },
            c: { functionName: 'longestPalindrome', returnType: 'char*' }
        }
    },

    // ========== TRIES ==========
    "implement trie (prefix tree)": {
        inputFormat: { type: 'class_transaction' },
        outputFormat: { type: 'class_results' },
        wrapperHints: {
            cpp: { functionName: 'Trie', returnType: 'class' },
            python: { functionName: 'Trie', paramNames: [] },
            javascript: { functionName: 'Trie' },
            java: { functionName: 'Trie', className: 'Trie' },
            c: { functionName: 'trieCreate', returnType: 'Trie*' }
        }
    },
    "implement trie ii (prefix tree)": {
        inputFormat: { type: 'class_transaction' },
        outputFormat: { type: 'class_results' },
        wrapperHints: {
            cpp: { functionName: 'Trie', returnType: 'class' },
            python: { functionName: 'Trie', paramNames: [] },
            javascript: { functionName: 'Trie' },
            java: { functionName: 'Trie', className: 'Trie' },
            c: { functionName: 'trieCreate', returnType: 'Trie*' }
        }
    },

    // ========== GRAPHS ==========
    "count the number of provinces": arrayToNumber('findCircleNum', ['isConnected']),
    "rotten oranges": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'orangesRotting', returnType: 'int' },
            python: { functionName: 'orangesRotting', paramNames: ['grid'] },
            javascript: { functionName: 'orangesRotting' },
            java: { functionName: 'orangesRotting' },
            c: { functionName: 'orangesRotting', returnType: 'int' }
        }
    },
    "flood-fill algorithm": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'array_2d_rows' },
        wrapperHints: {
            cpp: { functionName: 'floodFill', returnType: 'vector<vector<int>>' },
            python: { functionName: 'floodFill', paramNames: ['image', 'sr', 'sc', 'color'] },
            javascript: { functionName: 'floodFill' },
            java: { functionName: 'floodFill' },
            c: { functionName: 'floodFill', returnType: 'int**' }
        }
    },
    "detect cycle in undirected graph": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isCycle', returnType: 'bool' },
            python: { functionName: 'isCycle', paramNames: ['V', 'adj'] },
            javascript: { functionName: 'isCycle' },
            java: { functionName: 'isCycle' },
            c: { functionName: 'isCycle', returnType: 'bool' }
        }
    },
    "detect cycle in directed graph": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'boolean' },
        wrapperHints: {
            cpp: { functionName: 'isCyclic', returnType: 'bool' },
            python: { functionName: 'isCyclic', paramNames: ['V', 'adj'] },
            javascript: { functionName: 'isCyclic' },
            java: { functionName: 'isCyclic' },
            c: { functionName: 'isCyclic', returnType: 'bool' }
        }
    },
    "topological sorting": arrayToArray('topoSort', ['V', 'adj']),
    "number of islands": {
        inputFormat: { type: 'n_m_2d_matrix' },
        outputFormat: { type: 'single_number' },
        wrapperHints: {
            cpp: { functionName: 'numIslands', returnType: 'int' },
            python: { functionName: 'numIslands', paramNames: ['grid'] },
            javascript: { functionName: 'numIslands' },
            java: { functionName: 'numIslands' },
            c: { functionName: 'numIslands', returnType: 'int' }
        }
    }
};

export function getProblemConfig(title: string): ProblemConfig | undefined {
    const normalizedTitle = title.toLowerCase().trim();
    return PROBLEM_CONFIGS[normalizedTitle];
}

export function normalizeTitle(title: string): string {
    return title.toLowerCase().trim();
}
