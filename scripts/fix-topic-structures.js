
import fs from 'fs';

function wrapProblemsInTopic(filename, slug, title, description, codeExamples) {
    const rawData = JSON.parse(fs.readFileSync(filename, 'utf8'));
    let problems = [];

    if (Array.isArray(rawData)) {
        if (rawData.length > 0 && rawData[0].topic) {
            console.log(`${filename} already has correct structure.`);
            return;
        }
        problems = rawData;
    } else if (rawData.problems) {
        console.log(`${filename} already has correct structure.`);
        return;
    } else {
        problems = [rawData];
    }

    const wrapped = [
        {
            topic: {
                slug: slug,
                title: title,
                description: description
            },
            codeExamples: codeExamples,
            problems: problems
        }
    ];

    fs.writeFileSync(filename, JSON.stringify(wrapped, null, 2));
    console.log(`Successfully wrapped ${filename} and added metadata.`);
}

const dpExamples = [
    {
        language: "cpp",
        code: "#include <vector>\n#include <algorithm>\nusing namespace std;\n\n// Fibonacci with Memoization\nint fib(int n, vector<int>& memo) {\n    if (n <= 1) return n;\n    if (memo[n] != -1) return memo[n];\n    return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n}\n\n// Fibonacci with Tabulation\nint fibTab(int n) {\n    if (n <= 1) return n;\n    vector<int> dp(n + 1);\n    dp[0] = 0; dp[1] = 1;\n    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n    return dp[n];\n}",
        explanation: "Dynamic Programming often uses Memoization (Top-down) or Tabulation (Bottom-up) to store results of subproblems."
    },
    {
        language: "python",
        code: "def fib_memo(n, memo={}):\n    if n <= 1: return n\n    if n in memo: return memo[n]\n    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)\n    return memo[n]\n\ndef fib_tab(n):\n    if n <= 1: return n\n    dp = [0] * (n + 1)\n    dp[1] = 1\n    for i in range(2, n + 1):\n        dp[i] = dp[i-1] + dp[i-2]\n    return dp[n]",
        explanation: "Python implementation showing recursive memoization with a dictionary and iterative tabulation with an array."
    },
    {
        language: "java",
        code: "public class DPExample {\n    public int fibMemo(int n, int[] memo) {\n        if (n <= 1) return n;\n        if (memo[n] != -1) return memo[n];\n        return memo[n] = fibMemo(n-1, memo) + fibMemo(n-2, memo);\n    }\n\n    public int fibTab(int n) {\n        if (n <= 1) return n;\n        int[] dp = new int[n + 1];\n        dp[0] = 0; dp[1] = 1;\n        for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n        return dp[n];\n    }\n}",
        explanation: "Java implementation of the classic Fibonacci problem using both DP approaches."
    },
    {
        language: "c",
        code: "#include <stdio.h>\n\nint fibTab(int n) {\n    if (n <= 1) return n;\n    int dp[n + 1];\n    dp[0] = 0; dp[1] = 1;\n    for (int i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n    return dp[n];\n}",
        explanation: "Standard C implementation utilizing a fixed-size array for tabulation."
    },
    {
        language: "javascript",
        code: "function fibMemo(n, memo = {}) {\n    if (n <= 1) return n;\n    if (n in memo) return memo[n];\n    memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);\n    return memo[n];\n}\n\nfunction fibTab(n) {\n    if (n <= 1) return n;\n    const dp = [0, 1];\n    for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];\n    return dp[n];\n}",
        explanation: "JavaScript implementation of Fibonacci using memoization and tabulation."
    }
];

const greedyExamples = [
    {
        language: "cpp",
        code: "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint minCoins(vector<int>& coins, int amount) {\n    sort(coins.rbegin(), coins.rend());\n    int count = 0;\n    for (int coin : coins) {\n        while (amount >= coin) {\n            amount -= coin;\n            count++;\n        }\n    }\n    return amount == 0 ? count : -1;\n}",
        explanation: "The greedy approach for coin change works by always picking the largest coin possible (works for standard currency)."
    },
    {
        language: "python",
        code: "def min_coins(coins, amount):\n    coins.sort(reverse=True)\n    count = 0\n    for coin in coins:\n        while amount >= coin:\n            amount -= coin\n            count += 1\n    return count if amount == 0 else -1",
        explanation: "Greedy algorithm to find the minimum number of coins using Python."
    },
    {
        language: "java",
        code: "import java.util.*;\n\npublic class GreedyExample {\n    public int minCoins(int[] coins, int amount) {\n        Arrays.sort(coins);\n        int count = 0;\n        for (int i = coins.length - 1; i >= 0; i--) {\n            while (amount >= coins[i]) {\n                amount -= coins[i];\n                count++;\n            }\n        }\n        return amount == 0 ? count : -1;\n    }\n}",
        explanation: "Java implementation of a greedy coin change approach."
    },
    {
        language: "c",
        code: "#include <stdlib.h>\n#include <stdio.h>\n\nint compare(const void* a, const void* b) {\n    return (*(int*)b - *(int*)a);\n}\n\nint minCoins(int coins[], int n, int amount) {\n    qsort(coins, n, sizeof(int), compare);\n    int count = 0;\n    for (int i = 0; i < n; i++) {\n        while (amount >= coins[i]) {\n            amount -= coins[i];\n            count++;\n        }\n    }\n    return amount == 0 ? count : -1;\n}",
        explanation: "Using qsort in C to sort coins in descending order for the greedy strategy."
    },
    {
        language: "javascript",
        code: "function minCoins(coins, amount) {\n    coins.sort((a, b) => b - a);\n    let count = 0;\n    for (let coin of coins) {\n        while (amount >= coin) {\n            amount -= coin;\n            count++;\n        }\n    }\n    return amount === 0 ? count : -1;\n}",
        explanation: "JavaScript solution for greedy coin change."
    }
];

const trieExamples = [
    {
        language: "cpp",
        code: "#include <string>\n#include <unordered_map>\nusing namespace std;\n\nstruct TrieNode {\n    unordered_map<char, TrieNode*> children;\n    bool isEndOfWord = false;\n};\n\nclass Trie {\n    TrieNode* root = new TrieNode();\npublic:\n    void insert(string word) {\n        TrieNode* curr = root;\n        for (char c : word) {\n            if (!curr->children.count(c)) curr->children[c] = new TrieNode();\n            curr = curr->children[c];\n        }\n        curr->isEndOfWord = true;\n    }\n};",
        explanation: "C++ Trie node implementation using an unordered_map for children."
    },
    {
        language: "python",
        code: "class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end_of_word = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n\n    def insert(self, word):\n        curr = self.root\n        for char in word:\n            if char not in curr.children:\n                curr.children[char] = TrieNode()\n            curr = curr.children[char]\n        curr.is_end_of_word = True",
        explanation: "Python implementation of a Trie using nested dictionaries."
    },
    {
        language: "java",
        code: "import java.util.*;\n\nclass TrieNode {\n    Map<Character, TrieNode> children = new HashMap<>();\n    boolean isEndOfWord = false;\n}\n\npublic class Trie {\n    private TrieNode root = new TrieNode();\n\n    public void insert(String word) {\n        TrieNode curr = root;\n        for (char c : word.toCharArray()) {\n            curr.children.putIfAbsent(c, new TrieNode());\n            curr = curr.children.get(c);\n        }\n        curr.isEndOfWord = true;\n    }\n}",
        explanation: "Java implementation using HashMap for dynamic child nodes."
    },
    {
        language: "c",
        code: "#include <stdlib.h>\n#include <stdbool.h>\n\nstruct TrieNode {\n    struct TrieNode* children[26];\n    bool isEndOfWord;\n};\n\nstruct TrieNode* createNode() {\n    struct TrieNode* node = malloc(sizeof(struct TrieNode));\n    node->isEndOfWord = false;\n    for (int i = 0; i < 26; i++) node->children[i] = NULL;\n    return node;\n}",
        explanation: "C structure for Trie node with a fixed-size array for lowercase English letters."
    },
    {
        language: "javascript",
        code: "class TrieNode {\n    constructor() {\n        this.children = {};\n        this.isEndOfWord = false;\n    }\n}\n\nclass Trie {\n    constructor() {\n        this.root = new TrieNode();\n    }\n\n    insert(word) {\n        let curr = this.root;\n        for (let char of word) {\n            if (!curr.children[char]) curr.children[char] = new TrieNode();\n            curr = curr.children[char];\n        }\n        curr.isEndOfWord = true;\n    }\n}",
        explanation: "JavaScript implementation using objects for children."
    }
];

wrapProblemsInTopic('dp-topic.json', 'dp', 'Dynamic Programming', 'Dynamic Programming is an optimization technique used to solve complex problems by breaking them down into simpler subproblems.', dpExamples);
wrapProblemsInTopic('greedy-topic.json', 'greedy', 'Greedy Algorithms', 'Greedy algorithms make the locally optimal choice at each step with the hope of finding a global optimum.', greedyExamples);
wrapProblemsInTopic('tries-topic.json', 'tries', 'Tries', 'A Trie is a tree-like data structure used for efficient retrieval of keys in a dataset of strings.', trieExamples);
