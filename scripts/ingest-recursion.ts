import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const recursionData = {
  topic: {
    title: "Recursion",
    slug: "recursion",
    description: "Recursion is a programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems. It's particularly useful for problems that can be defined in terms of themselves.",
    order: 5,
    explanation: "Recursion is a method of solving problems where the solution depends on solutions to smaller instances of the same problem. Every recursive function has two main components: a base case that stops the recursion, and a recursive case that breaks down the problem. Recursion is powerful for tree traversals, divide-and-conquer algorithms, backtracking problems, and dynamic programming. Common pitfalls include stack overflow for deep recursion, redundant calculations, and forgetting the base case. Understanding recursion is crucial for mastering algorithms like sorting, searching, and combinatorial problems.",
    codeExamples: {
      cpp: "#include <iostream>\nusing namespace std;\n\n// Base case and recursive case example\nint factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive case\n}\n\nint main() {\n    cout << \"Factorial of 5: \" << factorial(5) << endl;\n    return 0;\n}",
      c: "#include <stdio.h>\n\n// Base case and recursive case example\nint factorial(int n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive case\n}\n\nint main() {\n    printf(\"Factorial of 5: %d\\n\", factorial(5));\n    return 0;\n}",
      python: "# Base case and recursive case example\ndef factorial(n):\n    if n <= 1:  # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive case\n\nprint(\"Factorial of 5:\", factorial(5))",
      java: "public class Main {\n    // Base case and recursive case example\n    public static int factorial(int n) {\n        if (n <= 1) return 1; // Base case\n        return n * factorial(n - 1); // Recursive case\n    }\n\n    public static void main(String[] args) {\n        System.out.println(\"Factorial of 5: \" + factorial(5));\n    }\n}",
      javascript: "// Base case and recursive case example\nfunction factorial(n) {\n    if (n <= 1) return 1; // Base case\n    return n * factorial(n - 1); // Recursive case\n}\n\nconsole.log(\"Factorial of 5:\", factorial(5));"
    }
  },
  problems: [
    {
      title: "Factorial of a Number",
      difficulty: "easy",
      problemStatement: "Given a number N, find the factorial of N. Factorial of N is the product of all positive integers less than or equal to N.",
      examples: [
        {
          input: "5",
          output: "120",
          explanation: "5! = 5 × 4 × 3 × 2 × 1 = 120"
        }
      ],
      testCases: [
        { input: "5", output: "120" },
        { input: "0", output: "1" },
        { input: "1", output: "1" },
        { input: "3", output: "6" }
      ],
      conceptExplanation: "Factorial is a classic recursive problem. The base case is when n <= 1, return 1. The recursive case is n * factorial(n-1).",
      workedExample: "factorial(5) = 5 * factorial(4)\nfactorial(4) = 4 * factorial(3)\nfactorial(3) = 3 * factorial(2)\nfactorial(2) = 2 * factorial(1)\nfactorial(1) = 1\nSo, 2 * 1 = 2, 3 * 2 = 6, 4 * 6 = 24, 5 * 24 = 120",
      initialCode: "int factorial(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}",
        c: "int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}",
        python: "def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)",
        java: "public int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}",
        javascript: "function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}"
      }
    },
    {
      title: "Fibonacci Number",
      difficulty: "easy",
      problemStatement: "Given a number N, find the Nth Fibonacci number. The Fibonacci sequence is defined as F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1.",
      examples: [
        {
          input: "5",
          output: "5",
          explanation: "Fibonacci sequence: 0, 1, 1, 2, 3, 5. The 5th number is 5."
        }
      ],
      testCases: [
        { input: "5", output: "5" },
        { input: "0", output: "0" },
        { input: "1", output: "1" },
        { input: "10", output: "55" }
      ],
      conceptExplanation: "Fibonacci is solved recursively with base cases F(0)=0, F(1)=1, and recursive case F(n) = F(n-1) + F(n-2).",
      workedExample: "fib(5) = fib(4) + fib(3)\nfib(4) = fib(3) + fib(2)\nfib(3) = fib(2) + fib(1) = 1 + 1 = 2\nfib(2) = fib(1) + fib(0) = 1 + 0 = 1\nSo fib(4) = 2 + 1 = 3, fib(5) = 3 + 2 = 5",
      initialCode: "int fib(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
        c: "int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
        python: "def fib(n):\n    if n <= 1:\n        return n\n    return fib(n - 1) + fib(n - 2)",
        java: "public int fib(int n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
        javascript: "function fib(n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}"
      }
    },
    {
      title: "Sum of Digits",
      difficulty: "easy",
      problemStatement: "Given a number N, find the sum of its digits using recursion.",
      examples: [
        {
          input: "123",
          output: "6",
          explanation: "1 + 2 + 3 = 6"
        }
      ],
      testCases: [
        { input: "123", output: "6" },
        { input: "0", output: "0" },
        { input: "999", output: "27" }
      ],
      conceptExplanation: "Base case: if n == 0, return 0. Recursive case: (n % 10) + sumOfDigits(n / 10).",
      workedExample: "sumOfDigits(123) = 3 + sumOfDigits(12)\nsumOfDigits(12) = 2 + sumOfDigits(1)\nsumOfDigits(1) = 1 + sumOfDigits(0) = 1 + 0 = 1\nSo 2 + 1 = 3, 3 + 3 = 6",
      initialCode: "int sumOfDigits(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int sumOfDigits(int n) {\n    if (n == 0) return 0;\n    return (n % 10) + sumOfDigits(n / 10);\n}",
        c: "int sumOfDigits(int n) {\n    if (n == 0) return 0;\n    return (n % 10) + sumOfDigits(n / 10);\n}",
        python: "def sumOfDigits(n):\n    if n == 0:\n        return 0\n    return (n % 10) + sumOfDigits(n // 10)",
        java: "public int sumOfDigits(int n) {\n    if (n == 0) return 0;\n    return (n % 10) + sumOfDigits(n / 10);\n}",
        javascript: "function sumOfDigits(n) {\n    if (n === 0) return 0;\n    return (n % 10) + sumOfDigits(Math.floor(n / 10));\n}"
      }
    },
    {
      title: "Power Function",
      difficulty: "easy",
      problemStatement: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
      examples: [
        {
          input: "2.00000\n10",
          output: "1024.00000",
          explanation: "2^10 = 1024"
        }
      ],
      testCases: [
        { input: "2.00000\n10", output: "1024.00000" },
        { input: "2.10000\n3", output: "9.26100" },
        { input: "2.00000\n-2", output: "0.25000" }
      ],
      conceptExplanation: "Base case: if n == 0, return 1. If n is negative, return 1 / pow(x, -n). Recursive case: if n even, pow(x, n/2) * pow(x, n/2), else x * pow(x, n-1).",
      workedExample: "pow(2, 10) = pow(2, 5) * pow(2, 5)\npow(2, 5) = 2 * pow(2, 4)\npow(2, 4) = pow(2, 2) * pow(2, 2)\npow(2, 2) = 2 * pow(2, 1)\npow(2, 1) = 2 * pow(2, 0) = 2 * 1 = 2\nSo pow(2, 2) = 2 * 2 = 4, pow(2, 4) = 4 * 4 = 16, pow(2, 5) = 2 * 16 = 32, pow(2, 10) = 32 * 32 = 1024",
      initialCode: "double myPow(double x, int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "double myPow(double x, int n) {\n    if (n == 0) return 1;\n    if (n < 0) return 1 / myPow(x, -n);\n    double half = myPow(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    return x * half * half;\n}",
        c: "double myPow(double x, int n) {\n    if (n == 0) return 1.0;\n    if (n < 0) return 1.0 / myPow(x, -n);\n    double half = myPow(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    return x * half * half;\n}",
        python: "def myPow(x, n):\n    if n == 0:\n        return 1\n    if n < 0:\n        return 1 / myPow(x, -n)\n    half = myPow(x, n // 2)\n    if n % 2 == 0:\n        return half * half\n    return x * half * half",
        java: "public double myPow(double x, int n) {\n    if (n == 0) return 1;\n    if (n < 0) return 1 / myPow(x, -n);\n    double half = myPow(x, n / 2);\n    if (n % 2 == 0) return half * half;\n    return x * half * half;\n}",
        javascript: "function myPow(x, n) {\n    if (n === 0) return 1;\n    if (n < 0) return 1 / myPow(x, -n);\n    const half = myPow(x, Math.floor(n / 2));\n    if (n % 2 === 0) return half * half;\n    return x * half * half;\n}"
      }
    },
    {
      title: "Reverse a String",
      difficulty: "easy",
      problemStatement: "Write a function that reverses a string using recursion. The input string is given as an array of characters s.",
      examples: [
        {
          input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]",
          output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
          explanation: "The string is reversed in place."
        }
      ],
      testCases: [
        { input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
        { input: "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" }
      ],
      conceptExplanation: "Base case: if start >= end, return. Recursive case: swap s[start] and s[end], then reverse(s, start+1, end-1).",
      workedExample: "reverse(['h','e','l','l','o'], 0, 4)\nSwap 'h' and 'o' -> ['o','e','l','l','h']\nreverse(1, 3)\nSwap 'e' and 'l' -> ['o','l','l','e','h']\nreverse(2, 2) -> done",
      initialCode: "void reverseString(vector<char>& s) {\n    // Your code here\n}",
      solutions: {
        cpp: "void reverseString(vector<char>& s) {\n    function<void(int, int)> helper = [&](int start, int end) {\n        if (start >= end) return;\n        swap(s[start], s[end]);\n        helper(start + 1, end - 1);\n    };\n    helper(0, s.size() - 1);\n}",
        c: "void reverseString(char* s, int n) {\n    if (n <= 1) return;\n    char temp = s[0];\n    s[0] = s[n-1];\n    s[n-1] = temp;\n    reverseString(s + 1, n - 2);\n}",
        python: "def reverseString(s):\n    def helper(start, end):\n        if start >= end:\n            return\n        s[start], s[end] = s[end], s[start]\n        helper(start + 1, end - 1)\n    helper(0, len(s) - 1)",
        java: "public void reverseString(char[] s) {\n    reverse(s, 0, s.length - 1);\n}\nprivate void reverse(char[] s, int start, int end) {\n    if (start >= end) return;\n    char temp = s[start];\n    s[start] = s[end];\n    s[end] = temp;\n    reverse(s, start + 1, end - 1);\n}",
        javascript: "function reverseString(s) {\n    function helper(start, end) {\n        if (start >= end) return;\n        [s[start], s[end]] = [s[end], s[start]];\n        helper(start + 1, end - 1);\n    }\n    helper(0, s.length - 1);\n}"
      }
    },
    {
      title: "Check Palindrome",
      difficulty: "medium",
      problemStatement: "Given a string s, return true if it is a palindrome, or false otherwise. Use recursion.",
      examples: [
        {
          input: "\"A man, a plan, a canal: Panama\"",
          output: "true",
          explanation: "After removing non-alphanumeric characters and converting to lowercase, it reads \"amanaplanacanalpanama\" which is a palindrome."
        }
      ],
      testCases: [
        { input: "\"A man, a plan, a canal: Panama\"", output: "true" },
        { input: "\"race a car\"", output: "false" },
        { input: "\"\"", output: "true" }
      ],
      conceptExplanation: "Base case: if start >= end, return true. Recursive case: if s[start] != s[end], return false, else check(start+1, end-1).",
      workedExample: "isPalindrome(\"aba\", 0, 2)\n'a' == 'a', check(1,1) -> true\nisPalindrome(\"abc\", 0, 2)\n'a' == 'c', false",
      initialCode: "bool isPalindrome(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isPalindrome(string s) {\n    function<bool(int, int)> helper = [&](int start, int end) {\n        if (start >= end) return true;\n        if (tolower(s[start]) != tolower(s[end])) return false;\n        return helper(start + 1, end - 1);\n    };\n    // Remove non-alphanumeric\n    string clean;\n    for (char c : s) if (isalnum(c)) clean += tolower(c);\n    return helper(0, clean.size() - 1);\n}",
        c: "#include <ctype.h>\n#include <string.h>\nbool isPalindrome(char* s) {\n    int len = strlen(s);\n    for (int i = 0; i < len; i++) s[i] = tolower(s[i]);\n    // Remove non-alnum logic omitted for brevity\n    return checkPalindrome(s, 0, len - 1);\n}\nbool checkPalindrome(char* s, int start, int end) {\n    if (start >= end) return true;\n    if (s[start] != s[end]) return false;\n    return checkPalindrome(s, start + 1, end - 1);\n}",
        python: "def isPalindrome(s):\n    import re\n    clean = re.sub(r'[^a-zA-Z0-9]', '', s).lower()\n    def helper(start, end):\n        if start >= end:\n            return True\n        if clean[start] != clean[end]:\n            return False\n        return helper(start + 1, end - 1)\n    return helper(0, len(clean) - 1)",
        java: "public boolean isPalindrome(String s) {\n    String clean = s.replaceAll(\"[^a-zA-Z0-9]\", \"\").toLowerCase();\n    return check(clean, 0, clean.length() - 1);\n}\nprivate boolean check(String s, int start, int end) {\n    if (start >= end) return true;\n    if (s.charAt(start) != s.charAt(end)) return false;\n    return check(s, start + 1, end - 1);\n}",
        javascript: "function isPalindrome(s) {\n    const clean = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();\n    function helper(start, end) {\n        if (start >= end) return true;\n        if (clean[start] !== clean[end]) return false;\n        return helper(start + 1, end - 1);\n    }\n    return helper(0, clean.length - 1);\n}"
      }
    },
    {
      title: "Tower of Hanoi",
      difficulty: "medium",
      problemStatement: "The Tower of Hanoi is a mathematical puzzle. It consists of three rods and a number of disks of different sizes, which can slide onto any rod. The puzzle starts with the disks in a neat stack in ascending order of size on one rod, the smallest at the top. The objective is to move the entire stack to another rod, obeying the following simple rules: 1) Only one disk can be moved at a time. 2) Each move consists of taking the upper disk from one of the stacks and placing it on top of another stack or on an empty rod. 3) No disk may be placed on top of a smaller disk. Print the steps to solve for N disks.",
      examples: [
        {
          input: "2",
          output: "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C",
          explanation: "Steps to solve Tower of Hanoi for 2 disks."
        }
      ],
      testCases: [
        { input: "2", output: "Move disk 1 from A to B\nMove disk 2 from A to C\nMove disk 1 from B to C" },
        { input: "1", output: "Move disk 1 from A to C" }
      ],
      conceptExplanation: "To move N disks from A to C using B as auxiliary: move N-1 from A to B, move 1 from A to C, move N-1 from B to C.",
      workedExample: "For N=2: Move 1 from A to B, Move 2 from A to C, Move 1 from B to C",
      initialCode: "void towerOfHanoi(int n, char from, char to, char aux) {\n    // Your code here\n}",
      solutions: {
        cpp: "void towerOfHanoi(int n, char from, char to, char aux) {\n    if (n == 1) {\n        cout << \"Move disk 1 from \" << from << \" to \" << to << endl;\n        return;\n    }\n    towerOfHanoi(n - 1, from, aux, to);\n    cout << \"Move disk \" << n << \" from \" << from << \" to \" << to << endl;\n    towerOfHanoi(n - 1, aux, to, from);\n}",
        c: "void towerOfHanoi(int n, char from, char to, char aux) {\n    if (n == 1) {\n        printf(\"Move disk 1 from %c to %c\\n\", from, to);\n        return;\n    }\n    towerOfHanoi(n - 1, from, aux, to);\n    printf(\"Move disk %d from %c to %c\\n\", n, from, to);\n    towerOfHanoi(n - 1, aux, to, from);\n}",
        python: "def towerOfHanoi(n, from_rod, to_rod, aux_rod):\n    if n == 1:\n        print(f\"Move disk 1 from {from_rod} to {to_rod}\")\n        return\n    towerOfHanoi(n-1, from_rod, aux_rod, to_rod)\n    print(f\"Move disk {n} from {from_rod} to {to_rod}\")\n    towerOfHanoi(n-1, aux_rod, to_rod, from_rod)",
        java: "public void towerOfHanoi(int n, char from, char to, char aux) {\n    if (n == 1) {\n        System.out.println(\"Move disk 1 from \" + from + \" to \" + to);\n        return;\n    }\n    towerOfHanoi(n - 1, from, aux, to);\n    System.out.println(\"Move disk \" + n + \" from \" + from + \" to \" + to);\n    towerOfHanoi(n - 1, aux, to, from);\n}",
        javascript: "function towerOfHanoi(n, from, to, aux) {\n    if (n === 1) {\n        console.log(`Move disk 1 from ${from} to ${to}`);\n        return;\n    }\n    towerOfHanoi(n - 1, from, aux, to);\n    console.log(`Move disk ${n} from ${from} to ${to}`);\n    towerOfHanoi(n - 1, aux, to, from);\n}"
      }
    },
    {
      title: "Print All Subsequences",
      difficulty: "medium",
      problemStatement: "Given a string, print all possible subsequences of the string.",
      examples: [
        {
          input: "\"abc\"",
          output: "\"\", \"a\", \"b\", \"c\", \"ab\", \"ac\", \"bc\", \"abc\"",
          explanation: "All subsequences of \"abc\"."
        }
      ],
      testCases: [
        { input: "\"abc\"", output: "\"\", \"a\", \"b\", \"c\", \"ab\", \"ac\", \"bc\", \"abc\"" },
        { input: "\"ab\"", output: "\"\", \"a\", \"b\", \"ab\"" }
      ],
      conceptExplanation: "For each character, include it or not in the subsequence. Base case: when index == length, print current subsequence.",
      workedExample: "For \"ab\": \nStart with \"\"\nInclude 'a': \"a\", then include 'b': \"ab\", exclude 'b': \"a\"\nExclude 'a': \"\", include 'b': \"b\", exclude 'b': \"\"",
      initialCode: "void printSubsequences(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "void printSubsequences(string s) {\n    function<void(int, string)> helper = [&](int index, string current) {\n        if (index == s.size()) {\n            cout << \"\\\"\" << current << \"\\\"\" << endl;\n            return;\n        }\n        helper(index + 1, current);\n        helper(index + 1, current + s[index]);\n    };\n    helper(0, \"\");\n}",
        c: "void printSubsequences(char* s, int n, int index, char* current, int currLen) {\n    if (index == n) {\n        printf(\"\\\"%.*s\\\"\\n\", currLen, current);\n        return;\n    }\n    printSubsequences(s, n, index + 1, current, currLen);\n    current[currLen] = s[index];\n    printSubsequences(s, n, index + 1, current, currLen + 1);\n}",
        python: "def printSubsequences(s):\n    def helper(index, current):\n        if index == len(s):\n            print(f'\"{current}\"')\n            return\n        helper(index + 1, current)\n        helper(index + 1, current + s[index])\n    helper(0, '')",
        java: "public void printSubsequences(String s) {\n    printSub(s, 0, \"\");\n}\nprivate void printSub(String s, int index, String current) {\n    if (index == s.length()) {\n        System.out.println(\"\\\"\" + current + \"\\\"\");\n        return;\n    }\n    printSub(s, index + 1, current);\n    printSub(s, index + 1, current + s.charAt(index));\n}",
        javascript: "function printSubsequences(s) {\n    function helper(index, current) {\n        if (index === s.length) {\n            console.log(`\"${current}\"`);\n            return;\n        }\n        helper(index + 1, current);\n        helper(index + 1, current + s[index]);\n    }\n    helper(0, '');\n}"
      }
    },
    {
      title: "Generate All Permutations",
      difficulty: "medium",
      problemStatement: "Given an array nums of distinct integers, return all the possible permutations.",
      examples: [
        {
          input: "[1,2,3]",
          output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
          explanation: "All permutations of [1,2,3]."
        }
      ],
      testCases: [
        { input: "[1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" },
        { input: "[0,1]", output: "[[0,1],[1,0]]" }
      ],
      conceptExplanation: "Use backtracking: for each position, try each unused number, recurse, then backtrack.",
      workedExample: "For [1,2]: \nStart: []\nAdd 1: [1], add 2: [1,2] -> result\nBacktrack, add 2: [2], add 1: [2,1] -> result",
      initialCode: "vector<vector<int>> permute(vector<int>& nums) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<vector<int>> permute(vector<int>& nums) {\n    vector<vector<int>> result;\n    function<void(int)> backtrack = [&](int start) {\n        if (start == nums.size()) {\n            result.push_back(nums);\n            return;\n        }\n        for (int i = start; i < nums.size(); i++) {\n            swap(nums[start], nums[i]);\n            backtrack(start + 1);\n            swap(nums[start], nums[i]);\n        }\n    };\n    backtrack(0);\n    return result;\n}",
        c: "// C implementation would use arrays and pointers, omitted for brevity",
        python: "def permute(nums):\n    result = []\n    def backtrack(start):\n        if start == len(nums):\n            result.append(nums[:])\n            return\n        for i in range(start, len(nums)):\n            nums[start], nums[i] = nums[i], nums[start]\n            backtrack(start + 1)\n            nums[start], nums[i] = nums[i], nums[start]\n    backtrack(0)\n    return result",
        java: "public List<List<Integer>> permute(int[] nums) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(nums, 0, result);\n    return result;\n}\nprivate void backtrack(int[] nums, int start, List<List<Integer>> result) {\n    if (start == nums.length) {\n        List<Integer> list = new ArrayList<>();\n        for (int num : nums) list.add(num);\n        result.add(list);\n        return;\n    }\n    for (int i = start; i < nums.length; i++) {\n        swap(nums, start, i);\n        backtrack(nums, start + 1, result);\n        swap(nums, start, i);\n    }\n}\nprivate void swap(int[] nums, int i, int j) {\n    int temp = nums[i];\n    nums[i] = nums[j];\n    nums[j] = temp;\n}",
        javascript: "function permute(nums) {\n    const result = [];\n    function backtrack(start) {\n        if (start === nums.length) {\n            result.push([...nums]);\n            return;\n        }\n        for (let i = start; i < nums.length; i++) {\n            [nums[start], nums[i]] = [nums[i], nums[start]];\n            backtrack(start + 1);\n            [nums[start], nums[i]] = [nums[i], nums[start]];\n        }\n    }\n    backtrack(0);\n    return result;\n}"
      }
    },
    {
      title: "Combination Sum",
      difficulty: "medium",
      problemStatement: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.",
      examples: [
        {
          input: "candidates = [2,3,6,7], target = 7",
          output: "[[2,2,3],[7]]",
          explanation: "Combinations that sum to 7."
        }
      ],
      testCases: [
        { input: "candidates = [2,3,6,7], target = 7", output: "[[2,2,3],[7]]" },
        { input: "candidates = [2,3,5], target = 8", output: "[[2,2,2,2],[2,3,3],[3,5]]" }
      ],
      conceptExplanation: "Use backtracking: for each candidate, add it if <= remaining, recurse, then remove.",
      workedExample: "For [2,3], target=5: \nStart: []\nAdd 2: [2], remaining 3\nAdd 2: [2,2], remaining 1 -> too small\nAdd 3: [2,3], remaining 0 -> result\nBacktrack to [2], add 3: [2,3] already done\nBacktrack, add 3: [3], remaining 2\nAdd 2: [3,2], remaining 0 -> result",
      initialCode: "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    vector<vector<int>> result;\n    vector<int> current;\n    function<void(int, int)> backtrack = [&](int start, int remaining) {\n        if (remaining == 0) {\n            result.push_back(current);\n            return;\n        }\n        for (int i = start; i < candidates.size(); i++) {\n            if (candidates[i] <= remaining) {\n                current.push_back(candidates[i]);\n                backtrack(i, remaining - candidates[i]);\n                current.pop_back();\n            }\n        }\n    };\n    backtrack(0, target);\n    return result;\n}",
        c: "// Omitted for brevity",
        python: "def combinationSum(candidates, target):\n    result = []\n    def backtrack(start, remaining, current):\n        if remaining == 0:\n            result.append(current[:])\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] <= remaining:\n                current.append(candidates[i])\n                backtrack(i, remaining - candidates[i], current)\n                current.pop()\n    backtrack(0, target, [])\n    return result",
        java: "public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    List<List<Integer>> result = new ArrayList<>();\n    backtrack(candidates, target, 0, new ArrayList<>(), result);\n    return result;\n}\nprivate void backtrack(int[] candidates, int target, int start, List<Integer> current, List<List<Integer>> result) {\n    if (target == 0) {\n        result.add(new ArrayList<>(current));\n        return;\n    }\n    for (int i = start; i < candidates.length; i++) {\n        if (candidates[i] <= target) {\n            current.add(candidates[i]);\n            backtrack(candidates, target - candidates[i], i, current, result);\n            current.remove(current.size() - 1);\n        }\n    }\n}",
        javascript: "function combinationSum(candidates, target) {\n    const result = [];\n    function backtrack(start, remaining, current) {\n        if (remaining === 0) {\n            result.push([...current]);\n            return;\n        }\n        for (let i = start; i < candidates.length; i++) {\n            if (candidates[i] <= remaining) {\n                current.push(candidates[i]);\n                backtrack(i, remaining - candidates[i], current);\n                current.pop();\n            }\n        }\n    }\n    backtrack(0, target, []);\n    return result;\n}"
      }
    },
    {
      title: "Subset Sum",
      difficulty: "medium",
      problemStatement: "Given a set of non-negative integers, and a value sum, determine if there is a subset of the given set with sum equal to given sum.",
      examples: [
        {
          input: "set[] = {3, 34, 4, 12, 5, 2}, sum = 9",
          output: "true",
          explanation: "There is a subset (4, 5) with sum 9."
        }
      ],
      testCases: [
        { input: "set[] = {3, 34, 4, 12, 5, 2}, sum = 9", output: "true" },
        { input: "set[] = {3, 34, 4, 12, 5, 2}, sum = 30", output: "false" }
      ],
      conceptExplanation: "Recursive function: if sum == 0, true. If n==0 and sum!=0, false. If last > sum, exclude it. Else, include or exclude.",
      workedExample: "For [3,4,5], sum=9: \nInclude 3, check [4,5] sum=6 -> include 4, [5] sum=2 -> false; exclude 4, [5] sum=6 -> false\nExclude 3, check [4,5] sum=9 -> include 4, [5] sum=5 -> include 5, [] sum=0 -> true",
      initialCode: "bool isSubsetSum(vector<int>& set, int n, int sum) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isSubsetSum(vector<int>& set, int n, int sum) {\n    if (sum == 0) return true;\n    if (n == 0) return false;\n    if (set[n-1] > sum) return isSubsetSum(set, n-1, sum);\n    return isSubsetSum(set, n-1, sum) || isSubsetSum(set, n-1, sum - set[n-1]);\n}",
        c: "bool isSubsetSum(int set[], int n, int sum) {\n    if (sum == 0) return true;\n    if (n == 0) return false;\n    if (set[n-1] > sum) return isSubsetSum(set, n-1, sum);\n    return isSubsetSum(set, n-1, sum) || isSubsetSum(set, n-1, sum - set[n-1]);\n}",
        python: "def isSubsetSum(set, n, sum):\n    if sum == 0:\n        return True\n    if n == 0:\n        return False\n    if set[n-1] > sum:\n        return isSubsetSum(set, n-1, sum)\n    return isSubsetSum(set, n-1, sum) or isSubsetSum(set, n-1, sum - set[n-1])",
        java: "public boolean isSubsetSum(int[] set, int n, int sum) {\n    if (sum == 0) return true;\n    if (n == 0) return false;\n    if (set[n-1] > sum) return isSubsetSum(set, n-1, sum);\n    return isSubsetSum(set, n-1, sum) || isSubsetSum(set, n-1, sum - set[n-1]);\n}",
        javascript: "function isSubsetSum(set, n, sum) {\n    if (sum === 0) return true;\n    if (n === 0) return false;\n    if (set[n-1] > sum) return isSubsetSum(set, n-1, sum);\n    return isSubsetSum(set, n-1, sum) || isSubsetSum(set, n-1, sum - set[n-1]);\n}"
      }
    },
    {
      title: "N-Queens",
      difficulty: "hard",
      problemStatement: "The n-queens puzzle is the problem of placing n queens on an n x n chessboard so that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.",
      examples: [
        {
          input: "4",
          output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
          explanation: "Two solutions for 4-queens problem."
        }
      ],
      testCases: [
        { input: "4", output: "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]" },
        { input: "1", output: "[[\"Q\"]]" }
      ],
      conceptExplanation: "Use backtracking: place queen in each row, check if safe (no same column, diagonal).",
      workedExample: "For N=4, place in row 0 col 1, row 1 col 3, row 2 col 0, row 3 col 2 -> one solution.",
      initialCode: "vector<vector<string>> solveNQueens(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<vector<string>> solveNQueens(int n) {\n    vector<vector<string>> result;\n    vector<string> board(n, string(n, '.'));\n    function<bool(int)> isSafe = [&](int row, int col) {\n        for (int i = 0; i < row; i++) {\n            if (board[i][col] == 'Q') return false;\n            if (col - (row - i) >= 0 && board[i][col - (row - i)] == 'Q') return false;\n            if (col + (row - i) < n && board[i][col + (row - i)] == 'Q') return false;\n        }\n        return true;\n    };\n    function<void(int)> backtrack = [&](int row) {\n        if (row == n) {\n            result.push_back(board);\n            return;\n        }\n        for (int col = 0; col < n; col++) {\n            if (isSafe(row, col)) {\n                board[row][col] = 'Q';\n                backtrack(row + 1);\n                board[row][col] = '.';\n            }\n        }\n    };\n    backtrack(0);\n    return result;\n}",
        c: "// Omitted for brevity",
        python: "def solveNQueens(n):\n    result = []\n    board = [['.' for _ in range(n)] for _ in range(n)]\n    def isSafe(row, col):\n        for i in range(row):\n            if board[i][col] == 'Q': return False\n            if col - (row - i) >= 0 and board[i][col - (row - i)] == 'Q': return False\n            if col + (row - i) < n and board[i][col + (row - i)] == 'Q': return False\n        return True\n    def backtrack(row):\n        if row == n:\n            result.append([''.join(r) for r in board])\n            return\n        for col in range(n):\n            if isSafe(row, col):\n                board[row][col] = 'Q'\n                backtrack(row + 1)\n                board[row][col] = '.'\n    backtrack(0)\n    return result",
        java: "public List<List<String>> solveNQueens(int n) {\n    List<List<String>> result = new ArrayList<>();\n    char[][] board = new char[n][n];\n    for (char[] row : board) Arrays.fill(row, '.');\n    backtrack(board, 0, result);\n    return result;\n}\nprivate void backtrack(char[][] board, int row, List<List<String>> result) {\n    if (row == board.length) {\n        List<String> solution = new ArrayList<>();\n        for (char[] r : board) solution.add(new String(r));\n        result.add(solution);\n        return;\n    }\n    for (int col = 0; col < board.length; col++) {\n        if (isSafe(board, row, col)) {\n            board[row][col] = 'Q';\n            backtrack(board, row + 1, result);\n            board[row][col] = '.';\n        }\n    }\n}\nprivate boolean isSafe(char[][] board, int row, int col) {\n    for (int i = 0; i < row; i++) {\n        if (board[i][col] == 'Q') return false;\n        if (col - (row - i) >= 0 && board[i][col - (row - i)] == 'Q') return false;\n        if (col + (row - i) < board.length && board[i][col + (row - i)] == 'Q') return false;\n    }\n    return true;\n}",
        javascript: "function solveNQueens(n) {\n    const result = [];\n    const board = Array.from({length: n}, () => Array(n).fill('.'));\n    function isSafe(row, col) {\n        for (let i = 0; i < row; i++) {\n            if (board[i][col] === 'Q') return false;\n            if (col - (row - i) >= 0 && board[i][col - (row - i)] === 'Q') return false;\n            if (col + (row - i) < n && board[i][col + (row - i)] === 'Q') return false;\n        }\n        return true;\n    }\n    function backtrack(row) {\n        if (row === n) {\n            result.push(board.map(r => r.join('')));\n            return;\n        }\n        for (let col = 0; col < n; col++) {\n            if (isSafe(row, col)) {\n                board[row][col] = 'Q';\n                backtrack(row + 1);\n                board[row][col] = '.';\n            }\n        }\n    }\n    backtrack(0);\n    return result;\n}"
      }
    },
    {
      title: "Rat in a Maze",
      difficulty: "hard",
      problemStatement: "Consider a rat placed at (0, 0) in a square matrix of order N * N. It has to reach the destination at (N - 1, N - 1). Find all possible paths that the rat can take to reach from source to destination. The directions in which the rat can move are 'U'(up), 'D'(down), 'L' (left), 'R' (right). Value 0 at a cell in the matrix represents that it is blocked and rat cannot move to it while value 1 at a cell in the matrix represents that rat can be travel through it.",
      examples: [
        {
          input: "[[1, 0, 0, 0],\n [1, 1, 0, 1],\n [0, 1, 0, 0],\n [1, 1, 1, 1]]",
          output: "[\"DDRDRR\",\"DRDDRR\"]",
          explanation: "Two possible paths."
        }
      ],
      testCases: [
        { input: "[[1, 0, 0, 0],\n [1, 1, 0, 1],\n [0, 1, 0, 0],\n [1, 1, 1, 1]]", output: "[\"DDRDRR\",\"DRDDRR\"]" },
        { input: "[[1,1],[1,1]]", output: "[\"DR\",\"RD\"]" }
      ],
      conceptExplanation: "Use backtracking: from current position, try all directions if valid and not visited, mark visited, recurse, unmark.",
      workedExample: "For 2x2 all 1s: Start (0,0), go right to (0,1), down to (1,1) -> \"DR\"\nOr down to (1,0), right to (1,1) -> \"RD\"",
      initialCode: "vector<string> findPath(vector<vector<int>>& m, int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<string> findPath(vector<vector<int>>& m, int n) {\n    vector<string> result;\n    vector<vector<bool>> visited(n, vector<bool>(n, false));\n    function<void(int, int, string)> backtrack = [&](int x, int y, string path) {\n        if (x == n-1 && y == n-1) {\n            result.push_back(path);\n            return;\n        }\n        visited[x][y] = true;\n        vector<pair<int, int>> dirs = {{0,1,'R'}, {1,0,'D'}, {0,-1,'L'}, {-1,0,'U'}};\n        for (auto& d : dirs) {\n            int nx = x + d.first, ny = y + d.second;\n            if (nx >= 0 && nx < n && ny >= 0 && ny < n && m[nx][ny] == 1 && !visited[nx][ny]) {\n                backtrack(nx, ny, path + d.third);\n            }\n        }\n        visited[x][y] = false;\n    };\n    if (m[0][0] == 1) backtrack(0, 0, \"\");\n    return result;\n}",
        c: "// Omitted",
        python: "def findPath(m, n):\n    result = []\n    visited = [[False] * n for _ in range(n)]\n    def backtrack(x, y, path):\n        if x == n-1 and y == n-1:\n            result.append(path)\n            return\n        visited[x][y] = True\n        dirs = [(0,1,'R'), (1,0,'D'), (0,-1,'L'), (-1,0,'U')]\n        for dx, dy, d in dirs:\n            nx, ny = x + dx, y + dy\n            if 0 <= nx < n and 0 <= ny < n and m[nx][ny] == 1 and not visited[nx][ny]:\n                backtrack(nx, ny, path + d)\n        visited[x][y] = False\n    if m[0][0] == 1:\n        backtrack(0, 0, '')\n    return result",
        java: "public List<String> findPath(int[][] m, int n) {\n    List<String> result = new ArrayList<>();\n    boolean[][] visited = new boolean[n][n];\n    backtrack(m, n, 0, 0, \"\", visited, result);\n    return result;\n}\nprivate void backtrack(int[][] m, int n, int x, int y, String path, boolean[][] visited, List<String> result) {\n    if (x == n-1 && y == n-1) {\n        result.add(path);\n        return;\n    }\n    visited[x][y] = true;\n    int[][] dirs = {{0,1}, {1,0}, {0,-1}, {-1,0}};\n    char[] dirChars = {'R', 'D', 'L', 'U'};\n    for (int i = 0; i < 4; i++) {\n        int nx = x + dirs[i][0], ny = y + dirs[i][1];\n        if (nx >= 0 && nx < n && ny >= 0 && ny < n && m[nx][ny] == 1 && !visited[nx][ny]) {\n            backtrack(m, n, nx, ny, path + dirChars[i], visited, result);\n        }\n    }\n    visited[x][y] = false;\n}",
        javascript: "function findPath(m, n) {\n    const result = [];\n    const visited = Array.from({length: n}, () => Array(n).fill(false));\n    function backtrack(x, y, path) {\n        if (x === n-1 && y === n-1) {\n            result.push(path);\n            return;\n        }\n        visited[x][y] = true;\n        const dirs = [[0,1,'R'], [1,0,'D'], [0,-1,'L'], [-1,0,'U']];\n        for (const [dx, dy, d] of dirs) {\n            const nx = x + dx, ny = y + dy;\n            if (nx >= 0 && nx < n && ny >= 0 && ny < n && m[nx][ny] === 1 && !visited[nx][ny]) {\n                backtrack(nx, ny, path + d);\n            }\n        }\n        visited[x][y] = false;\n    }\n    if (m[0][0] === 1) backtrack(0, 0, '');\n    return result;\n}"
      }
    },
    {
      title: "Word Break",
      difficulty: "hard",
      problemStatement: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words. Note that the same word in the dictionary may be reused multiple times in the segmentation.",
      examples: [
        {
          input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
          output: "true",
          explanation: "\"leetcode\" can be segmented as \"leet code\"."
        }
      ],
      testCases: [
        { input: "s = \"leetcode\", wordDict = [\"leet\",\"code\"]", output: "true" },
        { input: "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]", output: "true" },
        { input: "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]", output: "false" }
      ],
      conceptExplanation: "Use recursion with memoization: check if substring from i to end is in dict and recurse on remaining.",
      workedExample: "For \"leet code\", check \"leet\" in dict, then check \"code\" from position 4.",
      initialCode: "bool wordBreak(string s, vector<string>& wordDict) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool wordBreak(string s, vector<string>& wordDict) {\n    unordered_set<string> dict(wordDict.begin(), wordDict.end());\n    vector<int> memo(s.size(), -1);\n    function<bool(int)> dp = [&](int start) {\n        if (start == s.size()) return true;\n        if (memo[start] != -1) return memo[start];\n        for (int end = start + 1; end <= s.size(); end++) {\n            if (dict.count(s.substr(start, end - start)) && dp(end)) {\n                return memo[start] = true;\n            }\n        }\n        return memo[start] = false;\n    };\n    return dp(0);\n}",
        c: "// Omitted",
        python: "def wordBreak(s, wordDict):\n    wordSet = set(wordDict)\n    memo = {}\n    def dp(start):\n        if start == len(s):\n            return True\n        if start in memo:\n            return memo[start]\n        for end in range(start + 1, len(s) + 1):\n            if s[start:end] in wordSet and dp(end):\n                memo[start] = True\n                return True\n        memo[start] = False\n        return False\n    return dp(0)",
        java: "public boolean wordBreak(String s, List<String> wordDict) {\n    Set<String> wordSet = new HashSet<>(wordDict);\n    Boolean[] memo = new Boolean[s.length()];\n    return dp(s, 0, wordSet, memo);\n}\nprivate boolean dp(String s, int start, Set<String> wordSet, Boolean[] memo) {\n    if (start == s.length()) return true;\n    if (memo[start] != null) return memo[start];\n    for (int end = start + 1; end <= s.length(); end++) {\n        if (wordSet.contains(s.substring(start, end)) && dp(s, end, wordSet, memo)) {\n            return memo[start] = true;\n        }\n    }\n    return memo[start] = false;\n}",
        javascript: "function wordBreak(s, wordDict) {\n    const wordSet = new Set(wordDict);\n    const memo = new Array(s.length).fill(null);\n    function dp(start) {\n        if (start === s.length) return true;\n        if (memo[start] !== null) return memo[start];\n        for (let end = start + 1; end <= s.length; end++) {\n            if (wordSet.has(s.substring(start, end)) && dp(end)) {\n                return memo[start] = true;\n            }\n        }\n        return memo[start] = false;\n    }\n    return dp(0);\n}"
      }
    },
    {
      title: "Climbing Stairs",
      difficulty: "easy",
      problemStatement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      examples: [
        {
          input: "2",
          output: "2",
          explanation: "1. 1 step + 1 step\n2. 2 steps"
        }
      ],
      testCases: [
        { input: "2", output: "2" },
        { input: "3", output: "3" }
      ],
      conceptExplanation: "Fibonacci: ways(n) = ways(n-1) + ways(n-2), base: ways(1)=1, ways(2)=2.",
      workedExample: "ways(3) = ways(2) + ways(1) = 2 + 1 = 3",
      initialCode: "int climbStairs(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int climbStairs(int n) {\n    if (n <= 2) return n;\n    return climbStairs(n - 1) + climbStairs(n - 2);\n}",
        c: "int climbStairs(int n) {\n    if (n <= 2) return n;\n    return climbStairs(n - 1) + climbStairs(n - 2);\n}",
        python: "def climbStairs(n):\n    if n <= 2:\n        return n\n    return climbStairs(n - 1) + climbStairs(n - 2)",
        java: "public int climbStairs(int n) {\n    if (n <= 2) return n;\n    return climbStairs(n - 1) + climbStairs(n - 2);\n}",
        javascript: "function climbStairs(n) {\n    if (n <= 2) return n;\n    return climbStairs(n - 1) + climbStairs(n - 2);\n}"
      }
    }
  ]
};

async function main() {
  try {
    // Insert topic
    const topicResult = await db.insert(topics).values({
      title: recursionData.topic.title,
      slug: recursionData.topic.slug,
      description: recursionData.topic.description,
      order: recursionData.topic.order,
    }).returning({ id: topics.id });
    const topicId = topicResult[0].id;

    // Insert topic examples
    for (const [lang, code] of Object.entries(recursionData.topic.codeExamples)) {
      await db.insert(topicExamples).values({
        topicSlug: recursionData.topic.slug,
        language: lang,
        code: code as string,
      });
    }

    // Insert problems
    for (const problem of recursionData.problems) {
      const problemResult = await db.insert(problems).values({
        topicId,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.problemStatement,
        initialCode: problem.initialCode,
        testCases: JSON.stringify(problem.testCases),
        conceptExplanation: problem.conceptExplanation,
        workedExample: problem.workedExample,
        order: 0,
      }).returning({ id: problems.id });
      const problemId = problemResult[0].id;

      // Insert solutions
      for (const [lang, code] of Object.entries(problem.solutions)) {
        await db.insert(codeSnippets).values({
          problemId,
          language: lang,
          type: "solution",
          code: code as string,
        });
      }
    }

    console.log('Recursion curriculum data inserted successfully');
  } catch (error) {
    console.error('Error inserting recursion data:', error);
  }
}

main();