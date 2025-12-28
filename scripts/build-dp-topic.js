import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to escape strings for JSON
const esc = (str) => JSON.stringify(str).slice(1, -1);

const dpProblems = [
    // ===== 1. Intro to DP =====
    {
        title: "Find the nth Fibonacci Number",
        description: "Find the nth Fibonacci number using dynamic programming with memoization, tabulation, and space-optimized approaches.",
        difficulty: "easy",
        testCases: [
            { input: "n = 5", expectedOutput: "5" },
            { input: "n = 10", expectedOutput: "55" },
            { input: "n = 0", expectedOutput: "0" }
        ],
        solutions: {
            cpp: `// Find the nth Fibonacci Number
// Time: O(N), Space: O(N) for memoization, O(1) for optimized

class Solution {
public:
    // Memoization
    int fibo(int n, vector<int>& dp) {
        if (n == 0 || n == 1) return dp[n] = n;
        if (dp[n] != -1) return dp[n];
        return dp[n] = fibo(n - 1, dp) + fibo(n - 2, dp);
    }
    
    // Tabulation
    int fiboTab(int n) {
        if (n <= 1) return n;
        vector<int> dp(n + 1);
        dp[0] = 0; dp[1] = 1;
        for (int i = 2; i <= n; i++) {
            dp[i] = dp[i - 1] + dp[i - 2];
        }
        return dp[n];
    }
    
    // Space optimized
    int fib(int n) {
        if (n <= 1) return n;
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
            c: `// Find the nth Fibonacci Number in C
// Time: O(N), Space: O(1) for optimized

int fib(int n) {
    if (n <= 1) return n;
    int prev2 = 0, prev1 = 1;
    for (int i = 2; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
            python: `# Find the nth Fibonacci Number
# Time: O(N), Space: O(1) for optimized

class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        prev2, prev1 = 0, 1
        for i in range(2, n + 1):
            curr = prev1 + prev2
            prev2 = prev1
            prev1 = curr
        return prev1`,
            java: `// Find the nth Fibonacci Number
// Time: O(N), Space: O(1) for optimized

class Solution {
    public int fib(int n) {
        if (n <= 1) return n;
        int prev2 = 0, prev1 = 1;
        for (int i = 2; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
            javascript: `/**
 * Find the nth Fibonacci Number
 * Time: O(N), Space: O(1)
 * @param {number} n
 * @return {number}
 */
var fib = function(n) {
    if (n <= 1) return n;
    let prev2 = 0, prev1 = 1;
    for (let i = 2; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
};`
        }
    },

    // ===== 2. 1D DP =====
    {
        title: "Climbing Stairs",
        description: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        difficulty: "easy",
        testCases: [
            { input: "n = 2", expectedOutput: "2" },
            { input: "n = 3", expectedOutput: "3" },
            { input: "n = 5", expectedOutput: "8" }
        ],
        solutions: {
            cpp: `// Climbing Stairs
// Time: O(N), Space: O(1)

class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
            c: `// Climbing Stairs in C
// Time: O(N), Space: O(1)

int climbStairs(int n) {
    if (n <= 2) return n;
    int prev2 = 1, prev1 = 2;
    for (int i = 3; i <= n; i++) {
        int curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
            python: `# Climbing Stairs
# Time: O(N), Space: O(1)

class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev2, prev1 = 1, 2
        for i in range(3, n + 1):
            curr = prev1 + prev2
            prev2 = prev1
            prev1 = curr
        return prev1`,
            java: `// Climbing Stairs
// Time: O(N), Space: O(1)

class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
            javascript: `/**
 * Climbing Stairs
 * Time: O(N), Space: O(1)
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if (n <= 2) return n;
    let prev2 = 1, prev1 = 2;
    for (let i = 3; i <= n; i++) {
        const curr = prev1 + prev2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
};`
        }
    },
    {
        title: "Frog Jump",
        description: "Geek wants to climb from the 0th stair to the (n-1)th stair. At a time, the Geek can climb either one or two steps. A height[N] array is also given. Whenever the geek jumps from stair i to stair j, the energy consumed in the jump is abs(height[i] - height[j]). Return the minimum energy that can be used by the Geek to jump from stair 0 to stair N-1.",
        difficulty: "easy",
        testCases: [
            { input: "heights = [10, 20, 30, 10]", expectedOutput: "20" },
            { input: "heights = [10, 50, 10]", expectedOutput: "0" }
        ],
        solutions: {
            cpp: `// Frog Jump
// Time: O(N), Space: O(1)

class Solution {
public:
    int minimumEnergy(vector<int>& height, int n) {
        int prev2 = 0, prev1 = 0;
        for (int i = 1; i < n; i++) {
            int s1 = prev1 + abs(height[i] - height[i-1]);
            int s2 = INT_MAX;
            if (i >= 2) s2 = prev2 + abs(height[i] - height[i-2]);
            int curr = min(s1, s2);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
            c: `// Frog Jump in C
// Time: O(N), Space: O(1)

#include <limits.h>
#include <stdlib.h>

int minimumEnergy(int* height, int n) {
    int prev2 = 0, prev1 = 0;
    for (int i = 1; i < n; i++) {
        int s1 = prev1 + abs(height[i] - height[i-1]);
        int s2 = INT_MAX;
        if (i >= 2) s2 = prev2 + abs(height[i] - height[i-2]);
        int curr = s1 < s2 ? s1 : s2;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
            python: `# Frog Jump
# Time: O(N), Space: O(1)

class Solution:
    def minimumEnergy(self, height, n):
        prev2, prev1 = 0, 0
        for i in range(1, n):
            s1 = prev1 + abs(height[i] - height[i-1])
            s2 = float('inf')
            if i >= 2:
                s2 = prev2 + abs(height[i] - height[i-2])
            curr = min(s1, s2)
            prev2 = prev1
            prev1 = curr
        return prev1`,
            java: `// Frog Jump
// Time: O(N), Space: O(1)

class Solution {
    public int minimumEnergy(int[] height, int n) {
        int prev2 = 0, prev1 = 0;
        for (int i = 1; i < n; i++) {
            int s1 = prev1 + Math.abs(height[i] - height[i-1]);
            int s2 = Integer.MAX_VALUE;
            if (i >= 2) s2 = prev2 + Math.abs(height[i] - height[i-2]);
            int curr = Math.min(s1, s2);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
            javascript: `/**
 * Frog Jump
 * Time: O(N), Space: O(1)
 */
var minimumEnergy = function(height) {
    const n = height.length;
    let prev2 = 0, prev1 = 0;
    for (let i = 1; i < n; i++) {
        const s1 = prev1 + Math.abs(height[i] - height[i-1]);
        let s2 = Infinity;
        if (i >= 2) s2 = prev2 + Math.abs(height[i] - height[i-2]);
        const curr = Math.min(s1, s2);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
};`
        }
    },
    {
        title: "Frog K Jumps",
        description: "Geek wants to climb from the 0th stair to the (n-1)th stair. At a time, the Geek can climb up to k steps. A height[N] array is also given. Whenever the geek jumps from stair i to stair j, the energy consumed in the jump is abs(height[i] - height[j]). Return the minimum energy that can be used by the Geek to jump from stair 0 to stair N-1.",
        difficulty: "medium",
        testCases: [
            { input: "n = 4, k = 2, heights = [10, 40, 30, 10]", expectedOutput: "40" },
            { input: "n = 3, k = 3, heights = [10, 20, 10]", expectedOutput: "0" }
        ],
        solutions: {
            cpp: `// Frog K Jumps
// Time: O(N*K), Space: O(N)

class Solution {
public:
    int minimizeCost(int n, int k, vector<int>& height) {
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 1; j <= k; j++) {
                if (i - j >= 0) {
                    dp[i] = min(dp[i], dp[i-j] + abs(height[i] - height[i-j]));
                }
            }
        }
        return dp[n-1];
    }
};`,
            c: `// Frog K Jumps in C
// Time: O(N*K), Space: O(N)

#include <limits.h>
#include <stdlib.h>

int minimizeCost(int n, int k, int* height) {
    int* dp = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < n; i++) dp[i] = INT_MAX;
    dp[0] = 0;
    for (int i = 1; i < n; i++) {
        for (int j = 1; j <= k; j++) {
            if (i - j >= 0) {
                int cost = dp[i-j] + abs(height[i] - height[i-j]);
                if (cost < dp[i]) dp[i] = cost;
            }
        }
    }
    int result = dp[n-1];
    free(dp);
    return result;
}`,
            python: `# Frog K Jumps
# Time: O(N*K), Space: O(N)

class Solution:
    def minimizeCost(self, n, k, height):
        dp = [float('inf')] * n
        dp[0] = 0
        for i in range(1, n):
            for j in range(1, k + 1):
                if i - j >= 0:
                    dp[i] = min(dp[i], dp[i-j] + abs(height[i] - height[i-j]))
        return dp[n-1]`,
            java: `// Frog K Jumps
// Time: O(N*K), Space: O(N)

class Solution {
    public int minimizeCost(int n, int k, int[] height) {
        int[] dp = new int[n];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        for (int i = 1; i < n; i++) {
            for (int j = 1; j <= k; j++) {
                if (i - j >= 0) {
                    dp[i] = Math.min(dp[i], dp[i-j] + Math.abs(height[i] - height[i-j]));
                }
            }
        }
        return dp[n-1];
    }
}`,
            javascript: `/**
 * Frog K Jumps
 * Time: O(N*K), Space: O(N)
 */
var minimizeCost = function(n, k, height) {
    const dp = Array(n).fill(Infinity);
    dp[0] = 0;
    for (let i = 1; i < n; i++) {
        for (let j = 1; j <= k; j++) {
            if (i - j >= 0) {
                dp[i] = Math.min(dp[i], dp[i-j] + Math.abs(height[i] - height[i-j]));
            }
        }
    }
    return dp[n-1];
};`
        }
    },
    {
        title: "House Robber",
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected. Return the maximum amount of money you can rob tonight without alerting the police.",
        difficulty: "medium",
        testCases: [
            { input: "nums = [1, 2, 3, 1]", expectedOutput: "4" },
            { input: "nums = [2, 7, 9, 3, 1]", expectedOutput: "12" }
        ],
        solutions: {
            cpp: `// House Robber
// Time: O(N), Space: O(1)

class Solution {
public:
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        int prev2 = 0, prev1 = nums[0];
        for (int i = 1; i < n; i++) {
            int take = nums[i] + prev2;
            int notake = prev1;
            int curr = max(take, notake);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
            c: `// House Robber in C
// Time: O(N), Space: O(1)

int rob(int* nums, int n) {
    if (n == 1) return nums[0];
    int prev2 = 0, prev1 = nums[0];
    for (int i = 1; i < n; i++) {
        int take = nums[i] + prev2;
        int notake = prev1;
        int curr = take > notake ? take : notake;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}`,
            python: `# House Robber
# Time: O(N), Space: O(1)

class Solution:
    def rob(self, nums):
        n = len(nums)
        if n == 1:
            return nums[0]
        prev2, prev1 = 0, nums[0]
        for i in range(1, n):
            take = nums[i] + prev2
            notake = prev1
            curr = max(take, notake)
            prev2 = prev1
            prev1 = curr
        return prev1`,
            java: `// House Robber
// Time: O(N), Space: O(1)

class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        int prev2 = 0, prev1 = nums[0];
        for (int i = 1; i < n; i++) {
            int take = nums[i] + prev2;
            int notake = prev1;
            int curr = Math.max(take, notake);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
}`,
            javascript: `/**
 * House Robber
 * Time: O(N), Space: O(1)
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    if (n === 1) return nums[0];
    let prev2 = 0, prev1 = nums[0];
    for (let i = 1; i < n; i++) {
        const take = nums[i] + prev2;
        const notake = prev1;
        const curr = Math.max(take, notake);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
};`
        }
    },
    {
        title: "House Robber 2",
        description: "You are a professional robber planning to rob houses along a street arranged in a circle. That means the first house is the neighbor of the last one. Adjacent houses have security systems connected. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
        difficulty: "medium",
        testCases: [
            { input: "nums = [2, 3, 2]", expectedOutput: "3" },
            { input: "nums = [1, 2, 3, 1]", expectedOutput: "4" }
        ],
        solutions: {
            cpp: `// House Robber 2
// Time: O(N), Space: O(1)

class Solution {
public:
    int robLinear(vector<int>& nums, int start, int end) {
        int prev2 = 0, prev1 = 0;
        for (int i = start; i <= end; i++) {
            int take = nums[i] + prev2;
            int notake = prev1;
            int curr = max(take, notake);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
    
    int rob(vector<int>& nums) {
        int n = nums.size();
        if (n == 1) return nums[0];
        return max(robLinear(nums, 0, n-2), robLinear(nums, 1, n-1));
    }
};`,
            c: `// House Robber 2 in C
// Time: O(N), Space: O(1)

int robLinear(int* nums, int start, int end) {
    int prev2 = 0, prev1 = 0;
    for (int i = start; i <= end; i++) {
        int take = nums[i] + prev2;
        int notake = prev1;
        int curr = take > notake ? take : notake;
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}

int rob(int* nums, int n) {
    if (n == 1) return nums[0];
    int a = robLinear(nums, 0, n-2);
    int b = robLinear(nums, 1, n-1);
    return a > b ? a : b;
}`,
            python: `# House Robber 2
# Time: O(N), Space: O(1)

class Solution:
    def rob(self, nums):
        n = len(nums)
        if n == 1:
            return nums[0]
        
        def robLinear(start, end):
            prev2, prev1 = 0, 0
            for i in range(start, end + 1):
                take = nums[i] + prev2
                notake = prev1
                curr = max(take, notake)
                prev2 = prev1
                prev1 = curr
            return prev1
        
        return max(robLinear(0, n-2), robLinear(1, n-1))`,
            java: `// House Robber 2
// Time: O(N), Space: O(1)

class Solution {
    private int robLinear(int[] nums, int start, int end) {
        int prev2 = 0, prev1 = 0;
        for (int i = start; i <= end; i++) {
            int take = nums[i] + prev2;
            int notake = prev1;
            int curr = Math.max(take, notake);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
    
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLinear(nums, 0, n-2), robLinear(nums, 1, n-1));
    }
}`,
            javascript: `/**
 * House Robber 2
 * Time: O(N), Space: O(1)
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    const n = nums.length;
    if (n === 1) return nums[0];
    
    const robLinear = (start, end) => {
        let prev2 = 0, prev1 = 0;
        for (let i = start; i <= end; i++) {
            const take = nums[i] + prev2;
            const notake = prev1;
            const curr = Math.max(take, notake);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    };
    
    return Math.max(robLinear(0, n-2), robLinear(1, n-1));
};`
        }
    },

    // ===== 3. 2D DP =====
    {
        title: "Unique Paths",
        description: "There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
        difficulty: "medium",
        testCases: [
            { input: "m = 3, n = 7", expectedOutput: "28" },
            { input: "m = 3, n = 2", expectedOutput: "3" }
        ],
        solutions: {
            cpp: `// Unique Paths
// Time: O(M*N), Space: O(N)

class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> prev(n, 1);
        for (int i = 1; i < m; i++) {
            vector<int> curr(n, 1);
            for (int j = 1; j < n; j++) {
                curr[j] = curr[j-1] + prev[j];
            }
            prev = curr;
        }
        return prev[n-1];
    }
};`,
            c: `// Unique Paths in C
// Time: O(M*N), Space: O(N)

int uniquePaths(int m, int n) {
    int* prev = (int*)malloc(n * sizeof(int));
    for (int j = 0; j < n; j++) prev[j] = 1;
    
    for (int i = 1; i < m; i++) {
        int* curr = (int*)malloc(n * sizeof(int));
        curr[0] = 1;
        for (int j = 1; j < n; j++) {
            curr[j] = curr[j-1] + prev[j];
        }
        free(prev);
        prev = curr;
    }
    int result = prev[n-1];
    free(prev);
    return result;
}`,
            python: `# Unique Paths
# Time: O(M*N), Space: O(N)

class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        prev = [1] * n
        for i in range(1, m):
            curr = [1] * n
            for j in range(1, n):
                curr[j] = curr[j-1] + prev[j]
            prev = curr
        return prev[n-1]`,
            java: `// Unique Paths
// Time: O(M*N), Space: O(N)

class Solution {
    public int uniquePaths(int m, int n) {
        int[] prev = new int[n];
        Arrays.fill(prev, 1);
        for (int i = 1; i < m; i++) {
            int[] curr = new int[n];
            curr[0] = 1;
            for (int j = 1; j < n; j++) {
                curr[j] = curr[j-1] + prev[j];
            }
            prev = curr;
        }
        return prev[n-1];
    }
}`,
            javascript: `/**
 * Unique Paths
 * Time: O(M*N), Space: O(N)
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    let prev = Array(n).fill(1);
    for (let i = 1; i < m; i++) {
        const curr = Array(n).fill(1);
        for (let j = 1; j < n; j++) {
            curr[j] = curr[j-1] + prev[j];
        }
        prev = curr;
    }
    return prev[n-1];
};`
        }
    },
    {
        title: "Minimum Path Sum",
        description: "Given a m x n grid filled with non-negative numbers, find a path from top left to bottom right, which minimizes the sum of all numbers along its path. You can only move either down or right at any point in time.",
        difficulty: "medium",
        testCases: [
            { input: "grid = [[1,3,1],[1,5,1],[4,2,1]]", expectedOutput: "7" },
            { input: "grid = [[1,2,3],[4,5,6]]", expectedOutput: "12" }
        ],
        solutions: {
            cpp: `// Minimum Path Sum
// Time: O(M*N), Space: O(N)

class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<int> prev(n);
        for (int i = 0; i < m; i++) {
            vector<int> curr(n);
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) {
                    curr[j] = grid[i][j];
                } else {
                    int top = (i > 0) ? prev[j] : 1e9;
                    int left = (j > 0) ? curr[j-1] : 1e9;
                    curr[j] = min(top, left) + grid[i][j];
                }
            }
            prev = curr;
        }
        return prev[n-1];
    }
};`,
            c: `// Minimum Path Sum in C
// Time: O(M*N), Space: O(N)

int minPathSum(int** grid, int m, int n) {
    int* prev = (int*)malloc(n * sizeof(int));
    for (int i = 0; i < m; i++) {
        int* curr = (int*)malloc(n * sizeof(int));
        for (int j = 0; j < n; j++) {
            if (i == 0 && j == 0) {
                curr[j] = grid[i][j];
            } else {
                int top = (i > 0) ? prev[j] : 1e9;
                int left = (j > 0) ? curr[j-1] : 1e9;
                curr[j] = (top < left ? top : left) + grid[i][j];
            }
        }
        free(prev);
        prev = curr;
    }
    int result = prev[n-1];
    free(prev);
    return result;
}`,
            python: `# Minimum Path Sum
# Time: O(M*N), Space: O(N)

class Solution:
    def minPathSum(self, grid):
        m, n = len(grid), len(grid[0])
        prev = [0] * n
        for i in range(m):
            curr = [0] * n
            for j in range(n):
                if i == 0 and j == 0:
                    curr[j] = grid[i][j]
                else:
                    top = prev[j] if i > 0 else float('inf')
                    left = curr[j-1] if j > 0 else float('inf')
                    curr[j] = min(top, left) + grid[i][j]
            prev = curr
        return prev[n-1]`,
            java: `// Minimum Path Sum
// Time: O(M*N), Space: O(N)

class Solution {
    public int minPathSum(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] prev = new int[n];
        for (int i = 0; i < m; i++) {
            int[] curr = new int[n];
            for (int j = 0; j < n; j++) {
                if (i == 0 && j == 0) {
                    curr[j] = grid[i][j];
                } else {
                    int top = (i > 0) ? prev[j] : (int)1e9;
                    int left = (j > 0) ? curr[j-1] : (int)1e9;
                    curr[j] = Math.min(top, left) + grid[i][j];
                }
            }
            prev = curr;
        }
        return prev[n-1];
    }
}`,
            javascript: `/**
 * Minimum Path Sum
 * Time: O(M*N), Space: O(N)
 * @param {number[][]} grid
 * @return {number}
 */
var minPathSum = function(grid) {
    const m = grid.length, n = grid[0].length;
    let prev = Array(n).fill(0);
    for (let i = 0; i < m; i++) {
        const curr = Array(n).fill(0);
        for (let j = 0; j < n; j++) {
            if (i === 0 && j === 0) {
                curr[j] = grid[i][j];
            } else {
                const top = i > 0 ? prev[j] : Infinity;
                const left = j > 0 ? curr[j-1] : Infinity;
                curr[j] = Math.min(top, left) + grid[i][j];
            }
        }
        prev = curr;
    }
    return prev[n-1];
};`
        }
    },
    {
        title: "0/1 Knapsack",
        description: "Given weights and values of N items, put these items in a knapsack of capacity W to get the maximum total value in the knapsack. Each item can either be picked completely or not at all (0-1 property).",
        difficulty: "medium",
        testCases: [
            { input: "N = 3, W = 4, values = [1, 2, 3], weight = [4, 5, 1]", expectedOutput: "3" },
            { input: "N = 3, W = 3, values = [1, 2, 3], weight = [4, 5, 6]", expectedOutput: "0" }
        ],
        solutions: {
            cpp: `// 0/1 Knapsack
// Time: O(N*W), Space: O(W)

class Solution {
public:
    int knapSack(int W, int wt[], int val[], int n) {
        vector<int> prev(W + 1, 0);
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= 0; w--) {
                if (wt[i] <= w) {
                    prev[w] = max(prev[w], val[i] + prev[w - wt[i]]);
                }
            }
        }
        return prev[W];
    }
};`,
            c: `// 0/1 Knapsack in C
// Time: O(N*W), Space: O(W)

int knapSack(int W, int wt[], int val[], int n) {
    int* prev = (int*)calloc(W + 1, sizeof(int));
    for (int i = 0; i < n; i++) {
        for (int w = W; w >= wt[i]; w--) {
            int take = val[i] + prev[w - wt[i]];
            if (take > prev[w]) prev[w] = take;
        }
    }
    int result = prev[W];
    free(prev);
    return result;
}`,
            python: `# 0/1 Knapsack
# Time: O(N*W), Space: O(W)

class Solution:
    def knapSack(self, W, wt, val, n):
        prev = [0] * (W + 1)
        for i in range(n):
            for w in range(W, wt[i] - 1, -1):
                prev[w] = max(prev[w], val[i] + prev[w - wt[i]])
        return prev[W]`,
            java: `// 0/1 Knapsack
// Time: O(N*W), Space: O(W)

class Solution {
    public int knapSack(int W, int[] wt, int[] val, int n) {
        int[] prev = new int[W + 1];
        for (int i = 0; i < n; i++) {
            for (int w = W; w >= wt[i]; w--) {
                prev[w] = Math.max(prev[w], val[i] + prev[w - wt[i]]);
            }
        }
        return prev[W];
    }
}`,
            javascript: `/**
 * 0/1 Knapsack
 * Time: O(N*W), Space: O(W)
 */
var knapSack = function(W, wt, val, n) {
    const prev = Array(W + 1).fill(0);
    for (let i = 0; i < n; i++) {
        for (let w = W; w >= wt[i]; w--) {
            prev[w] = Math.max(prev[w], val[i] + prev[w - wt[i]]);
        }
    }
    return prev[W];
};`
        }
    },
    {
        title: "Coin Change",
        description: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
        difficulty: "medium",
        testCases: [
            { input: "coins = [1, 2, 5], amount = 11", expectedOutput: "3" },
            { input: "coins = [2], amount = 3", expectedOutput: "-1" },
            { input: "coins = [1], amount = 0", expectedOutput: "0" }
        ],
        solutions: {
            cpp: `// Coin Change
// Time: O(N*amount), Space: O(amount)

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, 1e9);
        dp[0] = 0;
        for (int coin : coins) {
            for (int amt = coin; amt <= amount; amt++) {
                dp[amt] = min(dp[amt], 1 + dp[amt - coin]);
            }
        }
        return dp[amount] == 1e9 ? -1 : dp[amount];
    }
};`,
            c: `// Coin Change in C
// Time: O(N*amount), Space: O(amount)

#include <limits.h>

int coinChange(int* coins, int n, int amount) {
    int* dp = (int*)malloc((amount + 1) * sizeof(int));
    for (int i = 0; i <= amount; i++) dp[i] = INT_MAX;
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        for (int amt = coins[i]; amt <= amount; amt++) {
            if (dp[amt - coins[i]] != INT_MAX) {
                int val = 1 + dp[amt - coins[i]];
                if (val < dp[amt]) dp[amt] = val;
            }
        }
    }
    int result = dp[amount] == INT_MAX ? -1 : dp[amount];
    free(dp);
    return result;
}`,
            python: `# Coin Change
# Time: O(N*amount), Space: O(amount)

class Solution:
    def coinChange(self, coins, amount):
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for amt in range(coin, amount + 1):
                dp[amt] = min(dp[amt], 1 + dp[amt - coin])
        return dp[amount] if dp[amount] != float('inf') else -1`,
            java: `// Coin Change
// Time: O(N*amount), Space: O(amount)

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, (int)1e9);
        dp[0] = 0;
        for (int coin : coins) {
            for (int amt = coin; amt <= amount; amt++) {
                dp[amt] = Math.min(dp[amt], 1 + dp[amt - coin]);
            }
        }
        return dp[amount] == (int)1e9 ? -1 : dp[amount];
    }
}`,
            javascript: `/**
 * Coin Change
 * Time: O(N*amount), Space: O(amount)
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    const dp = Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    for (const coin of coins) {
        for (let amt = coin; amt <= amount; amt++) {
            dp[amt] = Math.min(dp[amt], 1 + dp[amt - coin]);
        }
    }
    return dp[amount] === Infinity ? -1 : dp[amount];
};`
        }
    },
    {
        title: "Unbounded Knapsack",
        description: "Given a set of N items, each with a weight and a value, represented by the arrays w[] and val[] respectively, and a knapsack with weight limit 'W', fill the knapsack to get the maximum profit. Each item can be taken any number of times.",
        difficulty: "medium",
        testCases: [
            { input: "N = 2, W = 3, val = [1, 1], wt = [2, 1]", expectedOutput: "3" },
            { input: "N = 3, W = 8, val = [1, 4, 5], wt = [3, 4, 5]", expectedOutput: "8" }
        ],
        solutions: {
            cpp: `// Unbounded Knapsack
// Time: O(N*W), Space: O(W)

class Solution {
public:
    int knapSack(int N, int W, int val[], int wt[]) {
        vector<int> dp(W + 1, 0);
        for (int i = 0; i < N; i++) {
            for (int w = wt[i]; w <= W; w++) {
                dp[w] = max(dp[w], val[i] + dp[w - wt[i]]);
            }
        }
        return dp[W];
    }
};`,
            c: `// Unbounded Knapsack in C
// Time: O(N*W), Space: O(W)

int knapSack(int N, int W, int val[], int wt[]) {
    int* dp = (int*)calloc(W + 1, sizeof(int));
    for (int i = 0; i < N; i++) {
        for (int w = wt[i]; w <= W; w++) {
            int take = val[i] + dp[w - wt[i]];
            if (take > dp[w]) dp[w] = take;
        }
    }
    int result = dp[W];
    free(dp);
    return result;
}`,
            python: `# Unbounded Knapsack
# Time: O(N*W), Space: O(W)

class Solution:
    def knapSack(self, N, W, val, wt):
        dp = [0] * (W + 1)
        for i in range(N):
            for w in range(wt[i], W + 1):
                dp[w] = max(dp[w], val[i] + dp[w - wt[i]])
        return dp[W]`,
            java: `// Unbounded Knapsack
// Time: O(N*W), Space: O(W)

class Solution {
    public int knapSack(int N, int W, int[] val, int[] wt) {
        int[] dp = new int[W + 1];
        for (int i = 0; i < N; i++) {
            for (int w = wt[i]; w <= W; w++) {
                dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
            }
        }
        return dp[W];
    }
}`,
            javascript: `/**
 * Unbounded Knapsack
 * Time: O(N*W), Space: O(W)
 */
var knapSack = function(N, W, val, wt) {
    const dp = Array(W + 1).fill(0);
    for (let i = 0; i < N; i++) {
        for (let w = wt[i]; w <= W; w++) {
            dp[w] = Math.max(dp[w], val[i] + dp[w - wt[i]]);
        }
    }
    return dp[W];
};`
        }
    },
    {
        title: "Rod Cutting Problem",
        description: "Given a rod of length 'N' inches and an array of prices 'price[]', where price[i] denotes the value of a piece of length 'i+1', determine the maximum value obtainable by cutting up the rod and selling the pieces.",
        difficulty: "medium",
        testCases: [
            { input: "N = 8, price[] = {1, 5, 8, 9, 10, 17, 17, 20}", expectedOutput: "22" },
            { input: "N = 5, price[] = {2, 5, 7, 8, 10}", expectedOutput: "12" }
        ],
        solutions: {
            cpp: `// Rod Cutting Problem
// Time: O(N^2), Space: O(N)

class Solution {
public:
    int cutRod(int price[], int n) {
        vector<int> dp(n + 1, 0);
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] = max(dp[i], price[j-1] + dp[i-j]);
            }
        }
        return dp[n];
    }
};`,
            c: `// Rod Cutting Problem in C
// Time: O(N^2), Space: O(N)

int cutRod(int price[], int n) {
    int* dp = (int*)calloc(n + 1, sizeof(int));
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; j++) {
            int val = price[j-1] + dp[i-j];
            if (val > dp[i]) dp[i] = val;
        }
    }
    int result = dp[n];
    free(dp);
    return result;
}`,
            python: `# Rod Cutting Problem
# Time: O(N^2), Space: O(N)

class Solution:
    def cutRod(self, price, n):
        dp = [0] * (n + 1)
        for i in range(1, n + 1):
            for j in range(1, i + 1):
                dp[i] = max(dp[i], price[j-1] + dp[i-j])
        return dp[n]`,
            java: `// Rod Cutting Problem
// Time: O(N^2), Space: O(N)

class Solution {
    public int cutRod(int[] price, int n) {
        int[] dp = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; j++) {
                dp[i] = Math.max(dp[i], price[j-1] + dp[i-j]);
            }
        }
        return dp[n];
    }
}`,
            javascript: `/**
 * Rod Cutting Problem
 * Time: O(N^2), Space: O(N)
 * @param {number[]} price
 * @param {number} n
 * @return {number}
 */
var cutRod = function(price, n) {
    const dp = Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= i; j++) {
            dp[i] = Math.max(dp[i], price[j-1] + dp[i-j]);
        }
    }
    return dp[n];
};`
        }
    }
];

// Generate the JSON array
const problemsArray = dpProblems.map(problem => ({
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty,
    testCases: problem.testCases,
    solutions: [
        { language: "cpp", code: problem.solutions.cpp },
        { language: "c", code: problem.solutions.c },
        { language: "python", code: problem.solutions.python },
        { language: "java", code: problem.solutions.java },
        { language: "javascript", code: problem.solutions.javascript }
    ]
}));

// Write to file
const outputPath = path.join(rootDir, 'dp-topic.json');
fs.writeFileSync(outputPath, JSON.stringify(problemsArray, null, 2));

console.log(`Successfully created dp-topic.json with ${problemsArray.length} problems!`);
problemsArray.forEach(p => console.log(`- ${p.title}`));
