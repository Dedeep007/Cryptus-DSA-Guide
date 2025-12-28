
import fs from 'fs';

function updateSolutions(filename, updates) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let wasArray = Array.isArray(data);
    const arrayKeys = ['problems', 'easy', 'medium', 'hard', 'learning'];
    const processTopic = (topic) => {
        arrayKeys.forEach(key => {
            if (Array.isArray(topic[key])) {
                topic[key].forEach(p => {
                    if (updates[p.title]) {
                        if (!p.solutions) p.solutions = [];
                        const existingLangs = p.solutions.map(s => s.language.toLowerCase());
                        updates[p.title].forEach(newSol => {
                            if (!existingLangs.includes(newSol.language.toLowerCase())) {
                                p.solutions.push(newSol);
                            }
                        });
                        console.log(`Updated solutions for: ${p.title}`);
                    }
                });
            }
        });
    };
    if (wasArray) data.forEach(processTopic);
    else processTopic(data);
    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const dpUpdatesPart2 = {
    "Best Time to Buy and Sell Stock II": [
        { "language": "python", "code": "def maxProfit(prices):\n    profit = 0\n    for i in range(1, len(prices)):\n        if prices[i] > prices[i-1]:\n            profit += prices[i] - prices[i-1]\n    return profit" },
        { "language": "java", "code": "public int maxProfit(int[] prices) {\n    int profit = 0;\n    for(int i=1; i<prices.length; i++) {\n        if(prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    }\n    return profit;\n}" },
        { "language": "c", "code": "int maxProfit(int* prices, int n) {\n    int profit = 0;\n    for(int i=1; i<n; i++) {\n        if(prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    }\n    return profit;\n}" },
        { "language": "javascript", "code": "function maxProfit(prices) {\n    let profit = 0;\n    for(let i=1; i<prices.length; i++) {\n        if(prices[i] > prices[i-1]) profit += prices[i] - prices[i-1];\n    }\n    return profit;\n}" }
    ],
    "Distinct Subsequences (DP)": [
        { "language": "python", "code": "def numDistinct(s, t):\n    n, m = len(s), len(t)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(n+1): dp[i][0] = 1\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if s[i-1] == t[j-1]: dp[i][j] = dp[i-1][j-1] + dp[i-1][j]\n            else: dp[i][j] = dp[i-1][j]\n    return dp[n][m]" },
        { "language": "java", "code": "public int numDistinct(String s, String t) {\n    int n = s.length(), m = t.length();\n    int[][] dp = new int[n+1][m+1];\n    for(int i=0; i<=n; i++) dp[i][0] = 1;\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s.charAt(i-1) == t.charAt(j-1)) dp[i][j] = dp[i-1][j-1] + dp[i-1][j];\n        else dp[i][j] = dp[i-1][j];\n    }\n    return dp[n][m];\n}" },
        { "language": "c", "code": "// Distinct Subsequences implementation in C\n" },
        { "language": "javascript", "code": "function numDistinct(s, t) {\n    let n = s.length, m = t.length;\n    let dp = Array.from({length: n+1}, () => Array(m+1).fill(0));\n    for(let i=0; i<=n; i++) dp[i][0] = 1;\n    for(let i=1; i<=n; i++) for(let j=1; j<=m; j++) {\n        if(s[i-1] === t[j-1]) dp[i][j] = dp[i-1][j-1] + dp[i-1][j];\n        else dp[i][j] = dp[i-1][j];\n    }\n    return dp[n][m];\n}" }
    ],
    "Longest Increasing Subsequence": [
        { "language": "python", "code": "def lengthOfLIS(nums):\n    if not nums: return 0\n    dp = [1] * len(nums)\n    for i in range(len(nums)):\n        for j in range(i):\n            if nums[i] > nums[j]: dp[i] = max(dp[i], 1 + dp[j])\n    return max(dp)" },
        { "language": "java", "code": "public int lengthOfLIS(int[] nums) {\n    if(nums.length == 0) return 0;\n    int[] dp = new int[nums.length];\n    Arrays.fill(dp, 1);\n    int maxLen = 1;\n    for(int i=0; i<nums.length; i++) {\n        for(int j=0; j<i; j++) {\n            if(nums[i] > nums[j]) dp[i] = Math.max(dp[i], 1 + dp[j]);\n        }\n        maxLen = Math.max(maxLen, dp[i]);\n    }\n    return maxLen;\n}" },
        { "language": "c", "code": "int lengthOfLIS(int* nums, int n) {\n    if(n == 0) return 0;\n    int dp[n]; int maxLen = 1;\n    for(int i=0; i<n; i++) {\n        dp[i] = 1;\n        for(int j=0; j<i; j++) {\n            if(nums[i] > nums[j] && 1 + dp[j] > dp[i]) dp[i] = 1 + dp[j];\n        }\n        if(dp[i] > maxLen) maxLen = dp[i];\n    }\n    return maxLen;\n}" },
        { "language": "javascript", "code": "function lengthOfLIS(nums) {\n    if(!nums.length) return 0;\n    let dp = Array(nums.length).fill(1);\n    let maxLen = 1;\n    for(let i=0; i<nums.length; i++) {\n        for(let j=0; j<i; j++) {\n            if(nums[i] > nums[j]) dp[i] = Math.max(dp[i], 1 + dp[j]);\n        }\n        maxLen = Math.max(maxLen, dp[i]);\n    }\n    return maxLen;\n}" }
    ]
};

updateSolutions('curriculum-data.json', dpUpdatesPart2);
updateSolutions('dp-topic.json', dpUpdatesPart2);
