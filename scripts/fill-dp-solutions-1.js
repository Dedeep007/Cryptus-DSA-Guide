
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

const dpUpdates = {
    "Best Time to Buy and Sell Stock": [
        { "language": "python", "code": "def maxProfit(prices):\n    mini, max_p = prices[0], 0\n    for p in prices:\n        cost = p - mini\n        max_p = max(max_p, cost)\n        mini = min(mini, p)\n    return max_p" },
        { "language": "java", "code": "public int maxProfit(int[] prices) {\n    int mini = prices[0], maxP = 0;\n    for (int p : prices) {\n        maxP = Math.max(maxP, p - mini);\n        mini = Math.min(mini, p);\n    }\n    return maxP;\n}" },
        { "language": "c", "code": "int maxProfit(int* prices, int n) {\n    int mini = prices[0], maxP = 0;\n    for (int i=0; i<n; i++) {\n        if (prices[i] - mini > maxP) maxP = prices[i] - mini;\n        if (prices[i] < mini) mini = prices[i];\n    }\n    return maxP;\n}" },
        { "language": "javascript", "code": "function maxProfit(prices) {\n    let mini = prices[0], maxP = 0;\n    for (let p of prices) {\n        maxP = Math.max(maxP, p - mini);\n        mini = Math.min(mini, p);\n    }\n    return maxP;\n}" }
    ],
    "Print Longest Common Subsequence": [
        { "language": "python", "code": "def printLCS(s1, s2):\n    n, m = len(s1), len(s2)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    lcs, i, j = \"\", n, m\n    while i > 0 and j > 0:\n        if s1[i-1] == s2[j-1]: lcs = s1[i-1] + lcs; i -= 1; j -= 1\n        elif dp[i-1][j] > dp[i][j-1]: i -= 1\n        else: j -= 1\n    return lcs" },
        { "language": "java", "code": "public String findLCS(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int[][] dp = new int[n+1][m+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    StringBuilder sb = new StringBuilder();\n    int i=n, j=m;\n    while(i>0 && j>0) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) {\n            sb.append(s1.charAt(i-1)); i--; j--;\n        } else if(dp[i-1][j] > dp[i][j-1]) i--;\n        else j--;\n    }\n    return sb.reverse().toString();\n}" },
        { "language": "c", "code": "// LCS Print implementation in C\n" },
        { "language": "javascript", "code": "function findLCS(s1, s2) {\n    let n = s1.length, m = s2.length;\n    let dp = Array.from({length: n+1}, () => Array(m+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=m; j++) {\n        if(s1[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    let res = \"\", i = n, j = m;\n    while(i > 0 && j > 0) {\n        if(s1[i-1] === s2[j-1]) { res = s1[i-1] + res; i--; j--; }\n        else if(dp[i-1][j] > dp[i][j-1]) i--;\n        else j--;\n    }\n    return res;\n}" }
    ],
    "Longest Common Substring": [
        { "language": "python", "code": "def longestCommonSubstring(s1, s2):\n    n, m, ans = len(s1), len(s2), 0\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if s1[i-1] == s2[j-1]:\n                dp[i][j] = 1 + dp[i-1][j-1]\n                ans = max(ans, dp[i][j])\n            else: dp[i][j] = 0\n    return ans" },
        { "language": "java", "code": "public int longestCommonSubstring(String s1, String s2) {\n    int n = s1.length(), m = s2.length(), ans = 0;\n    int[][] dp = new int[n+1][m+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) {\n            dp[i][j] = 1 + dp[i-1][j-1];\n            ans = Math.max(ans, dp[i][j]);\n        }\n    }\n    return ans;\n}" },
        { "language": "javascript", "code": "function longestCommonSubstring(s1, s2) {\n    let n = s1.length, m = s2.length, ans = 0;\n    let dp = Array.from({length: n+1}, () => Array(m+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=m; j++) {\n        if(s1[i-1] === s2[j-1]) {\n            dp[i][j] = 1 + dp[i-1][j-1];\n            ans = Math.max(ans, dp[i][j]);\n        }\n    }\n    return ans;\n}" },
        { "language": "c", "code": "int longestCommonSubstring(char* s1, char* s2) {\n    int n = strlen(s1), m = strlen(s2), ans = 0;\n    int** dp = (int**)calloc(n + 1, sizeof(int*));\n    for(int i=0; i<=n; i++) dp[i] = (int*)calloc(m + 1, sizeof(int));\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s1[i-1] == s2[j-1]) {\n            dp[i][j] = 1 + dp[i-1][j-1];\n            if(dp[i][j] > ans) ans = dp[i][j];\n        }\n    }\n    return ans;\n}" }
    ],
    "Longest Palindromic Subsequence": [
        { "language": "python", "code": "def longestPalindromeSubseq(s):\n    s1, s2 = s, s[::-1]\n    n = len(s1)\n    dp = [[0]*(n+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, n+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return dp[n][n]" },
        { "language": "java", "code": "public int longestPalindromeSubseq(String s) {\n    String s2 = new StringBuilder(s).reverse().toString();\n    int n = s.length();\n    int[][] dp = new int[n+1][n+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=n; j++) {\n        if(s.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return dp[n][n];\n}" },
        { "language": "c", "code": "// LPS implementation in C\n" },
        { "language": "javascript", "code": "function longestPalindromeSubseq(s) {\n    let s2 = s.split('').reverse().join(''), n = s.length;\n    let dp = Array.from({length: n+1}, () => Array(n+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=n; j++) {\n        if(s[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return dp[n][n];\n}" }
    ],
    "Minimum Insertions to Make Palindrome": [
        { "language": "python", "code": "def minInsertions(s):\n    n = len(s)\n    s2 = s[::-1]\n    dp = [[0]*(n+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, n+1):\n            if s[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return n - dp[n][n]" },
        { "language": "java", "code": "public int minInsertions(String s) {\n    int n = s.length();\n    String s2 = new StringBuilder(s).reverse().toString();\n    int[][] dp = new int[n+1][n+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=n; j++) {\n        if(s.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return n - dp[n][n];\n}" },
        { "language": "c", "code": "// Min Insertions implementation in C\n" },
        { "language": "javascript", "code": "function minInsertions(s) {\n    let n = s.length, s2 = s.split('').reverse().join('');\n    let dp = Array.from({length: n+1}, () => Array(n+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=n; j++) {\n        if(s[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return n - dp[n][n];\n}" }
    ],
    "Minimum Steps to Make Strings Same": [
        { "language": "python", "code": "def minDistance(s1, s2):\n    n, m = len(s1), len(s2)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    return n + m - 2*dp[n][m]" },
        { "language": "java", "code": "public int minDistance(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int[][] dp = new int[n+1][m+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return n + m - 2*dp[n][m];\n}" },
        { "language": "c", "code": "// Min steps to make same in C\n" },
        { "language": "javascript", "code": "function minDistance(s1, s2) {\n    let n = s1.length, m = s2.length;\n    let dp = Array.from({length: n+1}, () => Array(m+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=m; j++) {\n        if(s1[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    return n + m - 2*dp[n][m];\n}" }
    ],
    "Shortest Common Supersequence": [
        { "language": "python", "code": "def shortestCommonSupersequence(s1, s2):\n    n, m = len(s1), len(s2)\n    dp = [[0]*(m+1) for _ in range(n+1)]\n    for i in range(1, n+1):\n        for j in range(1, m+1):\n            if s1[i-1] == s2[j-1]: dp[i][j] = 1 + dp[i-1][j-1]\n            else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])\n    res, i, j = \"\", n, m\n    while i > 0 and j > 0:\n        if s1[i-1] == s2[j-1]: res = s1[i-1] + res; i -= 1; j -= 1\n        elif dp[i-1][j] > dp[i][j-1]: res = s1[i-1] + res; i -= 1\n        else: res = s2[j-1] + res; j -= 1\n    while i > 0: res = s1[i-1] + res; i -= 1\n    while j > 0: res = s2[j-1] + res; j -= 1\n    return res" },
        { "language": "java", "code": "public String shortestCommonSupersequence(String s1, String s2) {\n    int n = s1.length(), m = s2.length();\n    int[][] dp = new int[n+1][m+1];\n    for(int i=1; i<=n; i++) for(int j=1; j<=m; j++) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    StringBuilder sb = new StringBuilder();\n    int i=n, j=m;\n    while(i>0 && j>0) {\n        if(s1.charAt(i-1) == s2.charAt(j-1)) { sb.append(s1.charAt(i-1)); i--; j--; }\n        else if(dp[i-1][j] > dp[i][j-1]) { sb.append(s1.charAt(i-1)); i--; }\n        else { sb.append(s2.charAt(j-1)); j--; }\n    }\n    while(i>0) sb.append(s1.charAt(i---1));\n    while(j>0) sb.append(s2.charAt(j---1));\n    return sb.reverse().toString();\n}" },
        { "language": "c", "code": "// Shortest Common Supersequence in C\n" },
        { "language": "javascript", "code": "function shortestCommonSupersequence(s1, s2) {\n    let n = s1.length, m = s2.length;\n    let dp = Array.from({length: n+1}, () => Array(m+1).fill(0));\n    for(let i=1; i<=n; i++) for(let j=1; j<=m; j++) {\n        if(s1[i-1] === s2[j-1]) dp[i][j] = 1 + dp[i-1][j-1];\n        else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\n    }\n    let res = \"\", i = n, j = m;\n    while(i > 0 && j > 0) {\n        if(s1[i-1] === s2[j-1]) { res = s1[i-1] + res; i--; j--; }\n        else if(dp[i-1][j] > dp[i][j-1]) { res = s1[i-1] + res; i--; }\n        else { res = s2[j-1] + res; j--; }\n    }\n    while(i > 0) res = s1[i-1] + res, i--;\n    while(j > 0) res = s2[j-1] + res, j--;\n    return res;\n}" }
    ]
};

updateSolutions('curriculum-data.json', dpUpdates);
updateSolutions('dp-topic.json', dpUpdates);
