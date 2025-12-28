import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const stringsData = {
  topic: {
    title: "Strings",
    slug: "strings",
    description: "Strings are sequences of characters used to represent text. They are fundamental in programming for handling text data, parsing, and manipulation.",
    order: 3,
    explanation: "Strings are immutable sequences of characters in most programming languages. Common operations include concatenation, substring extraction, searching, comparison, and modification. String problems often involve pattern matching, anagrams, palindromes, substring searches, and efficient algorithms for text processing. Understanding string manipulation is crucial for tasks like data parsing, validation, compression, and solving real-world problems involving text data. Key concepts include ASCII/Unicode handling, time complexity considerations for string operations, and using appropriate data structures like tries or hash maps for optimization.",
    codeExamples: {
      cpp: "#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string s = \"Hello, World!\";\n    cout << \"Length: \" << s.length() << endl;\n    cout << \"First char: \" << s[0] << endl;\n    cout << \"Substring: \" << s.substr(0, 5) << endl;\n    cout << \"Concatenated: \" << s + \" Welcome!\" << endl;\n    return 0;\n}",
      c: "#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s[] = \"Hello, World!\";\n    printf(\"Length: %lu\\n\", strlen(s));\n    printf(\"First char: %c\\n\", s[0]);\n    char substr[6];\n    strncpy(substr, s, 5);\n    substr[5] = '\\0';\n    printf(\"Substring: %s\\n\", substr);\n    char concat[50];\n    strcpy(concat, s);\n    strcat(concat, \" Welcome!\");\n    printf(\"Concatenated: %s\\n\", concat);\n    return 0;\n}",
      python: "s = \"Hello, World!\"\nprint(\"Length:\", len(s))\nprint(\"First char:\", s[0])\nprint(\"Substring:\", s[0:5])\nprint(\"Concatenated:\", s + \" Welcome!\")\nprint(\"Uppercase:\", s.upper())\nprint(\"Lowercase:\", s.lower())",
      java: "public class Main {\n    public static void main(String[] args) {\n        String s = \"Hello, World!\";\n        System.out.println(\"Length: \" + s.length());\n        System.out.println(\"First char: \" + s.charAt(0));\n        System.out.println(\"Substring: \" + s.substring(0, 5));\n        System.out.println(\"Concatenated: \" + s + \" Welcome!\");\n        System.out.println(\"Uppercase: \" + s.toUpperCase());\n        System.out.println(\"Lowercase: \" + s.toLowerCase());\n    }\n}",
      javascript: "let s = \"Hello, World!\";\nconsole.log(\"Length:\", s.length);\nconsole.log(\"First char:\", s[0]);\nconsole.log(\"Substring:\", s.substring(0, 5));\nconsole.log(\"Concatenated:\", s + \" Welcome!\");\nconsole.log(\"Uppercase:\", s.toUpperCase());\nconsole.log(\"Lowercase:\", s.toLowerCase());"
    }
  },
  problems: [
    {
      title: "Reverse a String",
      difficulty: "easy",
      problemStatement: "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
      examples: [
        {
          input: "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
          output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
          explanation: "Reversing the string in-place modifies the original array."
        }
      ],
      testCases: [
        { input: "[\"h\",\"e\",\"l\",\"l\",\"o\"]", output: "[\"o\",\"l\",\"l\",\"e\",\"h\"]" },
        { input: "[\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", output: "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]" },
        { input: "[\"a\"]", output: "[\"a\"]" },
        { input: "[]", output: "[]" }
      ],
      conceptExplanation: "Use two pointers, one at the start and one at the end, swapping characters until they meet in the middle.",
      workedExample: "s = ['h','e','l','l','o']\nSwap s[0] and s[4]: ['o','e','l','l','h']\nSwap s[1] and s[3]: ['o','l','l','e','h']\nDone.",
      initialCode: "void reverseString(vector<char>& s) {\n    // Your code here\n}",
      solutions: {
        cpp: "void reverseString(vector<char>& s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) {\n        swap(s[left], s[right]);\n        left++;\n        right--;\n    }\n}",
        c: "void reverseString(char* s, int n) {\n    int left = 0, right = n - 1;\n    while (left < right) {\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}",
        python: "def reverseString(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        s[left], s[right] = s[right], s[left]\n        left += 1\n        right -= 1",
        java: "public void reverseString(char[] s) {\n    int left = 0, right = s.length - 1;\n    while (left < right) {\n        char temp = s[left];\n        s[left] = s[right];\n        s[right] = temp;\n        left++;\n        right--;\n    }\n}",
        javascript: "function reverseString(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        [s[left], s[right]] = [s[right], s[left]];\n        left++;\n        right--;\n    }\n}"
      }
    },
    {
      title: "Valid Palindrome",
      difficulty: "easy",
      problemStatement: "Given a string s, return true if it is a palindrome, or false otherwise. A string is a palindrome if it reads the same forward and backward, ignoring case and non-alphanumeric characters.",
      examples: [
        {
          input: "s = \"A man, a plan, a canal: Panama\"",
          output: "true",
          explanation: "After removing non-alphanumeric characters and ignoring case: \"amanaplanacanalpanama\", which is a palindrome."
        }
      ],
      testCases: [
        { input: "\"A man, a plan, a canal: Panama\"", output: "true" },
        { input: "\"race a car\"", output: "false" },
        { input: "\" \"", output: "true" },
        { input: "\"0P\"", output: "false" }
      ],
      conceptExplanation: "Use two pointers to compare characters from start and end, skipping non-alphanumeric characters and ignoring case.",
      workedExample: "s = \"A man, a plan, a canal: Panama\"\nClean: \"amanaplanacanalpanama\"\nCompare a==a, m==a? No, false.",
      initialCode: "bool isPalindrome(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isPalindrome(string s) {\n    int left = 0, right = s.size() - 1;\n    while (left < right) {\n        while (left < right && !isalnum(s[left])) left++;\n        while (left < right && !isalnum(s[right])) right--;\n        if (tolower(s[left]) != tolower(s[right])) return false;\n        left++;\n        right--;\n    }\n    return true;\n}",
        c: "bool isPalindrome(char* s) {\n    int left = 0, right = strlen(s) - 1;\n    while (left < right) {\n        while (left < right && !isalnum(s[left])) left++;\n        while (left < right && !isalnum(s[right])) right--;\n        if (tolower(s[left]) != tolower(s[right])) return false;\n        left++;\n        right--;\n    }\n    return true;\n}",
        python: "def isPalindrome(s):\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True",
        java: "public boolean isPalindrome(String s) {\n    int left = 0, right = s.length() - 1;\n    while (left < right) {\n        while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;\n        while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;\n        if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) return false;\n        left++;\n        right--;\n    }\n    return true;\n}",
        javascript: "function isPalindrome(s) {\n    let left = 0, right = s.length - 1;\n    while (left < right) {\n        while (left < right && !/[a-zA-Z0-9]/.test(s[left])) left++;\n        while (left < right && !/[a-zA-Z0-9]/.test(s[right])) right--;\n        if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n        left++;\n        right--;\n    }\n    return true;\n}"
      }
    },
    {
      title: "Count Vowels in String",
      difficulty: "easy",
      problemStatement: "Given a string s, count the number of vowels (a, e, i, o, u) in it, considering both lowercase and uppercase.",
      examples: [
        {
          input: "s = \"hello world\"",
          output: "3",
          explanation: "Vowels are e, o, o"
        }
      ],
      testCases: [
        { input: "\"hello world\"", output: "3" },
        { input: "\"AEIOU\"", output: "5" },
        { input: "\"bcdfg\"", output: "0" },
        { input: "\"\"", output: "0" }
      ],
      conceptExplanation: "Iterate through each character and check if it's a vowel (a,e,i,o,u,A,E,I,O,U).",
      workedExample: "s = \"hello\"\n'h' no, 'e' yes, 'l' no, 'l' no, 'o' yes\nCount = 2",
      initialCode: "int countVowels(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int countVowels(string s) {\n    int count = 0;\n    string vowels = \"aeiouAEIOU\";\n    for (char c : s) {\n        if (vowels.find(c) != string::npos) count++;\n    }\n    return count;\n}",
        c: "int countVowels(char* s) {\n    int count = 0;\n    char vowels[] = \"aeiouAEIOU\";\n    for (int i = 0; s[i] != '\\0'; i++) {\n        for (int j = 0; vowels[j] != '\\0'; j++) {\n            if (s[i] == vowels[j]) {\n                count++;\n                break;\n            }\n        }\n    }\n    return count;\n}",
        python: "def countVowels(s):\n    vowels = 'aeiouAEIOU'\n    count = 0\n    for c in s:\n        if c in vowels:\n            count += 1\n    return count",
        java: "public int countVowels(String s) {\n    int count = 0;\n    String vowels = \"aeiouAEIOU\";\n    for (char c : s.toCharArray()) {\n        if (vowels.indexOf(c) != -1) count++;\n    }\n    return count;\n}",
        javascript: "function countVowels(s) {\n    let count = 0;\n    const vowels = 'aeiouAEIOU';\n    for (let c of s) {\n        if (vowels.includes(c)) count++;\n    }\n    return count;\n}"
      }
    },
    {
      title: "Length of Last Word",
      difficulty: "easy",
      problemStatement: "Given a string s consisting of words and spaces, return the length of the last word in the string. A word is a maximal substring consisting of non-space characters only.",
      examples: [
        {
          input: "s = \"Hello World\"",
          output: "5",
          explanation: "The last word is \"World\" with length 5."
        }
      ],
      testCases: [
        { input: "\"Hello World\"", output: "5" },
        { input: "\"   fly me   to   the moon  \"", output: "4" },
        { input: "\"luffy is still joyboy\"", output: "6" },
        { input: "\"a\"", output: "1" }
      ],
      conceptExplanation: "Trim trailing spaces, then find the last space and calculate the length from there to the end.",
      workedExample: "s = \"Hello World \"\nTrim: \"Hello World\"\nLast space at index 5, length = 11-6 = 5",
      initialCode: "int lengthOfLastWord(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int lengthOfLastWord(string s) {\n    int n = s.size(), len = 0;\n    for (int i = n - 1; i >= 0; i--) {\n        if (s[i] != ' ') len++;\n        else if (len > 0) break;\n    }\n    return len;\n}",
        c: "int lengthOfLastWord(char* s) {\n    int n = strlen(s), len = 0;\n    for (int i = n - 1; i >= 0; i--) {\n        if (s[i] != ' ') len++;\n        else if (len > 0) break;\n    }\n    return len;\n}",
        python: "def lengthOfLastWord(s):\n    s = s.rstrip()\n    return len(s.split()[-1]) if s else 0",
        java: "public int lengthOfLastWord(String s) {\n    s = s.trim();\n    int lastSpace = s.lastIndexOf(' ');\n    return s.length() - lastSpace - 1;\n}",
        javascript: "function lengthOfLastWord(s) {\n    s = s.trim();\n    const lastSpace = s.lastIndexOf(' ');\n    return s.length - lastSpace - 1;\n}"
      }
    },
    {
      title: "To Lower Case",
      difficulty: "easy",
      problemStatement: "Implement function ToLowerCase() that has a string parameter str, and returns the same string in lowercase.",
      examples: [
        {
          input: "str = \"Hello\"",
          output: "\"hello\"",
          explanation: "Convert all uppercase letters to lowercase."
        }
      ],
      testCases: [
        { input: "\"Hello\"", output: "\"hello\"" },
        { input: "\"here\"", output: "\"here\"" },
        { input: "\"LOVELY\"", output: "\"lovely\"" },
        { input: "\"\"", output: "\"\"" }
      ],
      conceptExplanation: "For each character, if it's uppercase (ASCII 65-90), add 32 to convert to lowercase.",
      workedExample: "str = \"Hello\"\n'H' -> 'h', 'e' stays, 'l' stays, 'l' stays, 'o' stays\nResult: \"hello\"",
      initialCode: "string toLowerCase(string str) {\n    // Your code here\n}",
      solutions: {
        cpp: "string toLowerCase(string str) {\n    for (char& c : str) {\n        if (c >= 'A' && c <= 'Z') c += 32;\n    }\n    return str;\n}",
        c: "char* toLowerCase(char* str) {\n    for (int i = 0; str[i] != '\\0'; i++) {\n        if (str[i] >= 'A' && str[i] <= 'Z') str[i] += 32;\n    }\n    return str;\n}",
        python: "def toLowerCase(str):\n    return str.lower()",
        java: "public String toLowerCase(String str) {\n    return str.toLowerCase();\n}",
        javascript: "function toLowerCase(str) {\n    return str.toLowerCase();\n}"
      }
    },
    {
      title: "Valid Anagram",
      difficulty: "medium",
      problemStatement: "Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      examples: [
        {
          input: "s = \"anagram\", t = \"nagaram\"",
          output: "true",
          explanation: "Both strings have the same characters with same frequencies."
        }
      ],
      testCases: [
        { input: "\"anagram\" \"nagaram\"", output: "true" },
        { input: "\"rat\" \"car\"", output: "false" },
        { input: "\"a\" \"ab\"", output: "false" },
        { input: "\"ab\" \"a\"", output: "false" }
      ],
      conceptExplanation: "Sort both strings and compare, or use a frequency count array/map.",
      workedExample: "s = \"anagram\", t = \"nagaram\"\nSorted: both \"aaagmnr\"\nEqual, true",
      initialCode: "bool isAnagram(string s, string t) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isAnagram(string s, string t) {\n    if (s.size() != t.size()) return false;\n    sort(s.begin(), s.end());\n    sort(t.begin(), t.end());\n    return s == t;\n}",
        c: "bool isAnagram(char* s, char* t) {\n    int len1 = strlen(s), len2 = strlen(t);\n    if (len1 != len2) return false;\n    int count[256] = {0};\n    for (int i = 0; i < len1; i++) {\n        count[s[i]]++;\n        count[t[i]]--;\n    }\n    for (int i = 0; i < 256; i++) {\n        if (count[i] != 0) return false;\n    }\n    return true;\n}",
        python: "def isAnagram(s, t):\n    if len(s) != len(t):\n        return False\n    return sorted(s) == sorted(t)",
        java: "public boolean isAnagram(String s, String t) {\n    if (s.length() != t.length()) return false;\n    char[] sArr = s.toCharArray();\n    char[] tArr = t.toCharArray();\n    Arrays.sort(sArr);\n    Arrays.sort(tArr);\n    return Arrays.equals(sArr, tArr);\n}",
        javascript: "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    return s.split('').sort().join('') === t.split('').sort().join('');\n}"
      }
    },
    {
      title: "First Unique Character in a String",
      difficulty: "medium",
      problemStatement: "Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1.",
      examples: [
        {
          input: "s = \"leetcode\"",
          output: "0",
          explanation: "'l' appears once, at index 0."
        }
      ],
      testCases: [
        { input: "\"leetcode\"", output: "0" },
        { input: "\"loveleetcode\"", output: "2" },
        { input: "\"aabb\"", output: "-1" },
        { input: "\"\"", output: "-1" }
      ],
      conceptExplanation: "Use a frequency map, then iterate to find the first character with count 1.",
      workedExample: "s = \"leetcode\"\nFreq: l:1, e:3, t:1, c:1, o:1, d:1\nFirst with 1: l at 0",
      initialCode: "int firstUniqChar(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int firstUniqChar(string s) {\n    vector<int> freq(26, 0);\n    for (char c : s) freq[c - 'a']++;\n    for (int i = 0; i < s.size(); i++) {\n        if (freq[s[i] - 'a'] == 1) return i;\n    }\n    return -1;\n}",
        c: "int firstUniqChar(char* s) {\n    int freq[26] = {0};\n    int len = strlen(s);\n    for (int i = 0; i < len; i++) freq[s[i] - 'a']++;\n    for (int i = 0; i < len; i++) {\n        if (freq[s[i] - 'a'] == 1) return i;\n    }\n    return -1;\n}",
        python: "def firstUniqChar(s):\n    freq = {}\n    for c in s:\n        freq[c] = freq.get(c, 0) + 1\n    for i, c in enumerate(s):\n        if freq[c] == 1:\n            return i\n    return -1",
        java: "public int firstUniqChar(String s) {\n    int[] freq = new int[26];\n    for (char c : s.toCharArray()) freq[c - 'a']++;\n    for (int i = 0; i < s.length(); i++) {\n        if (freq[s.charAt(i) - 'a'] == 1) return i;\n    }\n    return -1;\n}",
        javascript: "function firstUniqChar(s) {\n    const freq = {};\n    for (let c of s) {\n        freq[c] = (freq[c] || 0) + 1;\n    }\n    for (let i = 0; i < s.length; i++) {\n        if (freq[s[i]] === 1) return i;\n    }\n    return -1;\n}"
      }
    },
    {
      title: "Longest Common Prefix",
      difficulty: "medium",
      problemStatement: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
      examples: [
        {
          input: "strs = [\"flower\",\"flow\",\"flight\"]",
          output: "\"fl\"",
          explanation: "\"fl\" is the longest common prefix."
        }
      ],
      testCases: [
        { input: "[\"flower\",\"flow\",\"flight\"]", output: "\"fl\"" },
        { input: "[\"dog\",\"racecar\",\"car\"]", output: "\"\"" },
        { input: "[\"a\"]", output: "\"a\"" },
        { input: "[\"ab\",\"a\"]", output: "\"a\"" }
      ],
      conceptExplanation: "Compare characters of all strings at each position until a mismatch.",
      workedExample: "strs = [\"flower\",\"flow\",\"flight\"]\nPos 0: f,f,f\nPos 1: l,l,l\nPos 2: o,o,i -> stop\nPrefix: \"fl\"",
      initialCode: "string longestCommonPrefix(vector<string>& strs) {\n    // Your code here\n}",
      solutions: {
        cpp: "string longestCommonPrefix(vector<string>& strs) {\n    if (strs.empty()) return \"\";\n    string prefix = strs[0];\n    for (int i = 1; i < strs.size(); i++) {\n        while (strs[i].find(prefix) != 0) {\n            prefix = prefix.substr(0, prefix.size() - 1);\n            if (prefix.empty()) return \"\";\n        }\n    }\n    return prefix;\n}",
        c: "char* longestCommonPrefix(char** strs, int strsSize) {\n    if (strsSize == 0) return \"\";\n    char* prefix = strdup(strs[0]);\n    for (int i = 1; i < strsSize; i++) {\n        int j = 0;\n        while (prefix[j] && strs[i][j] && prefix[j] == strs[i][j]) j++;\n        prefix[j] = '\\0';\n        if (strlen(prefix) == 0) return \"\";\n    }\n    return prefix;\n}",
        python: "def longestCommonPrefix(strs):\n    if not strs:\n        return \"\"\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix:\n                return \"\"\n    return prefix",
        java: "public String longestCommonPrefix(String[] strs) {\n    if (strs.length == 0) return \"\";\n    String prefix = strs[0];\n    for (int i = 1; i < strs.length; i++) {\n        while (strs[i].indexOf(prefix) != 0) {\n            prefix = prefix.substring(0, prefix.length() - 1);\n            if (prefix.isEmpty()) return \"\";\n        }\n    }\n    return prefix;\n}",
        javascript: "function longestCommonPrefix(strs) {\n    if (strs.length === 0) return \"\";\n    let prefix = strs[0];\n    for (let i = 1; i < strs.length; i++) {\n        while (strs[i].indexOf(prefix) !== 0) {\n            prefix = prefix.slice(0, -1);\n            if (prefix === \"\") return \"\";\n        }\n    }\n    return prefix;\n}"
      }
    },
    {
      title: "String Compression",
      difficulty: "medium",
      problemStatement: "Given an array of characters chars, compress it using the following algorithm: For each group of consecutive repeating characters, replace the group with the character followed by the count if the count > 1. Return the new length of the array.",
      examples: [
        {
          input: "chars = [\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"]",
          output: "6",
          explanation: "The compressed array becomes [\"a\",\"2\",\"b\",\"2\",\"c\",\"3\"]."
        }
      ],
      testCases: [
        { input: "[\"a\",\"a\",\"b\",\"b\",\"c\",\"c\",\"c\"]", output: "6" },
        { input: "[\"a\"]", output: "1" },
        { input: "[\"a\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\",\"b\"]", output: "4" },
        { input: "[\"a\",\"a\",\"a\",\"b\",\"b\",\"a\",\"a\"]", output: "6" }
      ],
      conceptExplanation: "Iterate through the array, count consecutive characters, and write the character and count to the array.",
      workedExample: "chars = ['a','a','b','b','c','c','c']\n'a' count 2 -> write 'a','2'\n'b' count 2 -> 'b','2'\n'c' count 3 -> 'c','3'\nLength 6",
      initialCode: "int compress(vector<char>& chars) {\n    // Your code here\n}",
      solutions: {
        cpp: "int compress(vector<char>& chars) {\n    int n = chars.size(), idx = 0;\n    for (int i = 0; i < n; ) {\n        char c = chars[i];\n        int count = 0;\n        while (i < n && chars[i] == c) {\n            i++;\n            count++;\n        }\n        chars[idx++] = c;\n        if (count > 1) {\n            string cnt = to_string(count);\n            for (char digit : cnt) chars[idx++] = digit;\n        }\n    }\n    return idx;\n}",
        c: "int compress(char* chars, int charsSize) {\n    int idx = 0;\n    for (int i = 0; i < charsSize; ) {\n        char c = chars[i];\n        int count = 0;\n        while (i < charsSize && chars[i] == c) {\n            i++;\n            count++;\n        }\n        chars[idx++] = c;\n        if (count > 1) {\n            char cnt[10];\n            sprintf(cnt, \"%d\", count);\n            for (int j = 0; cnt[j] != '\\0'; j++) chars[idx++] = cnt[j];\n        }\n    }\n    return idx;\n}",
        python: "def compress(chars):\n    idx = 0\n    i = 0\n    while i < len(chars):\n        c = chars[i]\n        count = 0\n        while i < len(chars) and chars[i] == c:\n            i += 1\n            count += 1\n        chars[idx] = c\n        idx += 1\n        if count > 1:\n            for digit in str(count):\n                chars[idx] = digit\n                idx += 1\n    return idx",
        java: "public int compress(char[] chars) {\n    int idx = 0;\n    for (int i = 0; i < chars.length; ) {\n        char c = chars[i];\n        int count = 0;\n        while (i < chars.length && chars[i] == c) {\n            i++;\n            count++;\n        }\n        chars[idx++] = c;\n        if (count > 1) {\n            for (char digit : String.valueOf(count).toCharArray()) {\n                chars[idx++] = digit;\n            }\n        }\n    }\n    return idx;\n}",
        javascript: "function compress(chars) {\n    let idx = 0;\n    for (let i = 0; i < chars.length; ) {\n        let c = chars[i];\n        let count = 0;\n        while (i < chars.length && chars[i] === c) {\n            i++;\n            count++;\n        }\n        chars[idx++] = c;\n        if (count > 1) {\n            for (let digit of count.toString()) {\n                chars[idx++] = digit;\n            }\n        }\n    }\n    return idx;\n}"
      }
    },
    {
      title: "Valid Parentheses",
      difficulty: "medium",
      problemStatement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
      examples: [
        {
          input: "s = \"()\"",
          output: "true",
          explanation: "Valid parentheses."
        }
      ],
      testCases: [
        { input: "\"()\"", output: "true" },
        { input: "\"()[]{}\"", output: "true" },
        { input: "\"(]\"", output: "false" },
        { input: "\"([])\"", output: "true" }
      ],
      conceptExplanation: "Use a stack to keep track of opening brackets, pop when matching closing bracket is found.",
      workedExample: "s = \"()[]{}\"\n'(' push, ')' pop match\n'[' push, ']' pop match\n'{' push, '}' pop match\nEmpty stack, true",
      initialCode: "bool isValid(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n        }\n    }\n    return st.empty();\n}",
        c: "bool isValid(char* s) {\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; s[i] != '\\0'; i++) {\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[') stack[++top] = s[i];\n        else {\n            if (top == -1) return false;\n            char topChar = stack[top--];\n            if ((s[i] == ')' && topChar != '(') || (s[i] == '}' && topChar != '{') || (s[i] == ']' && topChar != '[')) return false;\n        }\n    }\n    return top == -1;\n}",
        python: "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[c] != top:\n                return False\n        else:\n            stack.append(c)\n    return not stack",
        java: "public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') {\n            stack.push(c);\n        } else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n        }\n    }\n    return stack.isEmpty();\n}",
        javascript: "function isValid(s) {\n    const stack = [];\n    const mapping = {')': '(', '}': '{', ']': '['};\n    for (let c of s) {\n        if (c in mapping) {\n            const top = stack.pop() || '#';\n            if (mapping[c] !== top) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}"
      }
    },
    {
      title: "Longest Palindromic Substring",
      difficulty: "hard",
      problemStatement: "Given a string s, return the longest palindromic substring in s.",
      examples: [
        {
          input: "s = \"babad\"",
          output: "\"bab\"",
          explanation: "\"aba\" is also a valid answer."
        }
      ],
      testCases: [
        { input: "\"babad\"", output: "\"bab\"" },
        { input: "\"cbbd\"", output: "\"bb\"" },
        { input: "\"a\"", output: "\"a\"" },
        { input: "\"ac\"", output: "\"a\"" }
      ],
      conceptExplanation: "Expand around each character as center, check for palindrome, keep track of max length.",
      workedExample: "s = \"babad\"\nCenter at 'a' (index 1): \"aba\"\nCenter at 'b' (index 0): \"b\"\nCenter at 'a' (index 2): \"a\"\nCenter at 'b' (index 3): \"b\"\nCenter at 'a' (index 4): \"a\"\nMax: \"aba\"",
      initialCode: "string longestPalindrome(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "string longestPalindrome(string s) {\n    int n = s.size(), start = 0, maxLen = 1;\n    auto expand = [&](int left, int right) {\n        while (left >= 0 && right < n && s[left] == s[right]) {\n            left--;\n            right++;\n        }\n        int len = right - left - 1;\n        if (len > maxLen) {\n            maxLen = len;\n            start = left + 1;\n        }\n    };\n    for (int i = 0; i < n; i++) {\n        expand(i, i);\n        expand(i, i + 1);\n    }\n    return s.substr(start, maxLen);\n}",
        c: "char* longestPalindrome(char* s) {\n    int n = strlen(s);\n    int start = 0, maxLen = 1;\n    for (int i = 0; i < n; i++) {\n        // odd length\n        int left = i, right = i;\n        while (left >= 0 && right < n && s[left] == s[right]) {\n            left--;\n            right++;\n        }\n        int len = right - left - 1;\n        if (len > maxLen) {\n            maxLen = len;\n            start = left + 1;\n        }\n        // even length\n        left = i, right = i + 1;\n        while (left >= 0 && right < n && s[left] == s[right]) {\n            left--;\n            right++;\n        }\n        len = right - left - 1;\n        if (len > maxLen) {\n            maxLen = len;\n            start = left + 1;\n        }\n    }\n    char* result = (char*)malloc(maxLen + 1);\n    strncpy(result, s + start, maxLen);\n    result[maxLen] = '\\0';\n    return result;\n}",
        python: "def longestPalindrome(s):\n    def expand(left, right):\n        while left >= 0 and right < len(s) and s[left] == s[right]:\n            left -= 1\n            right += 1\n        return right - left - 1\n    \n    start, maxLen = 0, 1\n    for i in range(len(s)):\n        len1 = expand(i, i)\n        len2 = expand(i, i + 1)\n        currLen = max(len1, len2)\n        if currLen > maxLen:\n            maxLen = currLen\n            start = i - (currLen - 1) // 2\n    return s[start:start + maxLen]",
        java: "public String longestPalindrome(String s) {\n    int n = s.length(), start = 0, maxLen = 1;\n    for (int i = 0; i < n; i++) {\n        int len1 = expand(s, i, i);\n        int len2 = expand(s, i, i + 1);\n        int currLen = Math.max(len1, len2);\n        if (currLen > maxLen) {\n            maxLen = currLen;\n            start = i - (currLen - 1) / 2;\n        }\n    }\n    return s.substring(start, start + maxLen);\n}\n\nprivate int expand(String s, int left, int right) {\n    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {\n        left--;\n        right++;\n    }\n    return right - left - 1;\n}",
        javascript: "function longestPalindrome(s) {\n    let start = 0, maxLen = 1;\n    const expand = (left, right) => {\n        while (left >= 0 && right < s.length && s[left] === s[right]) {\n            left--;\n            right++;\n        }\n        return right - left - 1;\n    };\n    for (let i = 0; i < s.length; i++) {\n        const len1 = expand(i, i);\n        const len2 = expand(i, i + 1);\n        const currLen = Math.max(len1, len2);\n        if (currLen > maxLen) {\n            maxLen = currLen;\n            start = i - Math.floor((currLen - 1) / 2);\n        }\n    }\n    return s.substring(start, start + maxLen);\n}"
      }
    },
    {
      title: "String to Integer (atoi)",
      difficulty: "hard",
      problemStatement: "Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer (similar to C/C++'s atoi function). The algorithm for myAtoi(string s) is as follows: Read in and ignore any leading whitespace. Check if the next character (if not already at the end of the string) is '-' or '+'. Read this character in if it is either. This determines if the final result is negative or positive respectively. Assume the result is positive if neither is present. Read in next the characters until the next non-digit character or the end of the input is reached. The rest of the string is ignored. Convert these digits into an integer (i.e. \"123\" -> 123, \"0032\" -> 32). If no digits were read, then the integer is 0. Change the sign as necessary (from step 2). If the integer is out of the 32-bit signed integer range [-231, 231 - 1], then clamp the integer so that it remains in the range. Specifically, integers less than -231 should be clamped to -231, and integers greater than 231 - 1 should be clamped to 231 - 1. Return the integer as the final result.",
      examples: [
        {
          input: "s = \"42\"",
          output: "42",
          explanation: "The underlined characters are what is read in, the caret is the current reader position. Step 1: \"42\" (no characters read because there is no leading whitespace) ^ Step 2: \"42\" (no characters read because there is neither a '-' nor '+') ^ Step 3: \"42\" (\"42\" is read in) ^ The parsed integer is 42. Since 42 is in the range [-231, 231 - 1], the final result is 42."
        }
      ],
      testCases: [
        { input: "\"42\"", output: "42" },
        { input: "\"   -42\"", output: "-42" },
        { input: "\"4193 with words\"", output: "4193" },
        { input: "\"words and 987\"", output: "0" },
        { input: "\"-91283472332\"", output: "-2147483648" }
      ],
      conceptExplanation: "Skip leading whitespace, check sign, read digits until non-digit, convert to int with overflow checks.",
      workedExample: "s = \"   -42abc\"\nSkip spaces, sign '-', read '42', convert -42",
      initialCode: "int myAtoi(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int myAtoi(string s) {\n    int i = 0, sign = 1, result = 0;\n    while (i < s.size() && s[i] == ' ') i++;\n    if (i < s.size() && (s[i] == '+' || s[i] == '-')) {\n        sign = (s[i] == '-') ? -1 : 1;\n        i++;\n    }\n    while (i < s.size() && isdigit(s[i])) {\n        int digit = s[i] - '0';\n        if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > INT_MAX % 10)) {\n            return (sign == 1) ? INT_MAX : INT_MIN;\n        }\n        result = result * 10 + digit;\n        i++;\n    }\n    return result * sign;\n}",
        c: "int myAtoi(char* s) {\n    int i = 0, sign = 1, result = 0;\n    while (s[i] == ' ') i++;\n    if (s[i] == '+' || s[i] == '-') {\n        sign = (s[i] == '-') ? -1 : 1;\n        i++;\n    }\n    while (isdigit(s[i])) {\n        int digit = s[i] - '0';\n        if (result > INT_MAX / 10 || (result == INT_MAX / 10 && digit > INT_MAX % 10)) {\n            return (sign == 1) ? INT_MAX : INT_MIN;\n        }\n        result = result * 10 + digit;\n        i++;\n    }\n    return result * sign;\n}",
        python: "def myAtoi(s):\n    s = s.lstrip()\n    if not s:\n        return 0\n    sign = -1 if s[0] == '-' else 1\n    if s[0] in '+-':\n        s = s[1:]\n    result = 0\n    for c in s:\n        if not c.isdigit():\n            break\n        result = result * 10 + int(c)\n        if sign * result > 2**31 - 1:\n            return 2**31 - 1\n        if sign * result < -2**31:\n            return -2**31\n    return sign * result",
        java: "public int myAtoi(String s) {\n    s = s.trim();\n    if (s.isEmpty()) return 0;\n    int sign = 1, i = 0, result = 0;\n    if (s.charAt(0) == '-' || s.charAt(0) == '+') {\n        sign = (s.charAt(0) == '-') ? -1 : 1;\n        i++;\n    }\n    while (i < s.length() && Character.isDigit(s.charAt(i))) {\n        int digit = s.charAt(i) - '0';\n        if (result > Integer.MAX_VALUE / 10 || (result == Integer.MAX_VALUE / 10 && digit > Integer.MAX_VALUE % 10)) {\n            return (sign == 1) ? Integer.MAX_VALUE : Integer.MIN_VALUE;\n        }\n        result = result * 10 + digit;\n        i++;\n    }\n    return result * sign;\n}",
        javascript: "function myAtoi(s) {\n    s = s.trim();\n    if (!s) return 0;\n    let sign = 1, i = 0, result = 0;\n    if (s[0] === '-' || s[0] === '+') {\n        sign = (s[0] === '-') ? -1 : 1;\n        i++;\n    }\n    while (i < s.length && /[0-9]/.test(s[i])) {\n        const digit = s[i] - '0';\n        if (result > Math.floor((2**31 - 1) / 10) || (result === Math.floor((2**31 - 1) / 10) && digit > 7)) {\n            return (sign === 1) ? 2**31 - 1 : -2**31;\n        }\n        result = result * 10 + digit;\n        i++;\n    }\n    return result * sign;\n}"
      }
    },
    {
      title: "Group Anagrams",
      difficulty: "hard",
      problemStatement: "Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      examples: [
        {
          input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
          output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
          explanation: "The anagrams are grouped together."
        }
      ],
      testCases: [
        { input: "[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" },
        { input: "[\"\"]", output: "[[\"\"]]" },
        { input: "[\"a\"]", output: "[\"a\"]" },
        { input: "[\"\",\"\"]", output: "[[\"\",\"\"]]" }
      ],
      conceptExplanation: "Sort each string and use as key in a map to group anagrams.",
      workedExample: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]\nSorted: \"aet\",\"aet\",\"ant\",\"aet\",\"ant\",\"abt\"\nGroups: [\"eat\",\"tea\",\"ate\"], [\"tan\",\"nat\"], [\"bat\"]",
      initialCode: "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> mp;\n    for (string s : strs) {\n        string key = s;\n        sort(key.begin(), key.end());\n        mp[key].push_back(s);\n    }\n    vector<vector<string>> result;\n    for (auto& p : mp) result.push_back(p.second);\n    return result;\n}",
        c: "// C doesn't have built-in maps, this would require implementing a hash map or sorting the groups\n// For simplicity, assume we sort the array and group\n// But proper implementation is complex in C\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Similar to C++\n}",
        python: "def groupAnagrams(strs):\n    from collections import defaultdict\n    mp = defaultdict(list)\n    for s in strs:\n        key = ''.join(sorted(s))\n        mp[key].append(s)\n    return list(mp.values())",
        java: "public List<List<String>> groupAnagrams(String[] strs) {\n    Map<String, List<String>> map = new HashMap<>();\n    for (String s : strs) {\n        char[] chars = s.toCharArray();\n        Arrays.sort(chars);\n        String key = new String(chars);\n        map.computeIfAbsent(key, k -> new ArrayList<>()).add(s);\n    }\n    return new ArrayList<>(map.values());\n}",
        javascript: "function groupAnagrams(strs) {\n    const map = {};\n    for (let s of strs) {\n        const key = s.split('').sort().join('');\n        if (!map[key]) map[key] = [];\n        map[key].push(s);\n    }\n    return Object.values(map);\n}"
      }
    },
    {
      title: "Longest Substring Without Repeating Characters",
      difficulty: "hard",
      problemStatement: "Given a string s, find the length of the longest substring without repeating characters.",
      examples: [
        {
          input: "s = \"abcabcbb\"",
          output: "3",
          explanation: "The answer is \"abc\", with the length of 3."
        }
      ],
      testCases: [
        { input: "\"abcabcbb\"", output: "3" },
        { input: "\"bbbbb\"", output: "1" },
        { input: "\"pwwkew\"", output: "3" },
        { input: "\"\"", output: "0" }
      ],
      conceptExplanation: "Use sliding window with a set to track unique characters, expand right, shrink left when duplicate found.",
      workedExample: "s = \"abcabcbb\"\nWindow: a b c -> len 3\nThen a b c a -> duplicate a, move left to b\nb c a -> len 3\nb c a b -> duplicate b, move left to c\nc a b -> len 3\nc a b b -> duplicate b, move left to a\nMax 3",
      initialCode: "int lengthOfLongestSubstring(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int lengthOfLongestSubstring(string s) {\n    unordered_set<char> set;\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.size(); right++) {\n        while (set.count(s[right])) {\n            set.erase(s[left]);\n            left++;\n        }\n        set.insert(s[right]);\n        maxLen = max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
        c: "int lengthOfLongestSubstring(char* s) {\n    int freq[256] = {0}, left = 0, maxLen = 0;\n    for (int right = 0; s[right] != '\\0'; right++) {\n        freq[s[right]]++;\n        while (freq[s[right]] > 1) {\n            freq[s[left]]--;\n            left++;\n        }\n        int len = right - left + 1;\n        if (len > maxLen) maxLen = len;\n    }\n    return maxLen;\n}",
        python: "def lengthOfLongestSubstring(s):\n    char_set = set()\n    left = 0\n    max_len = 0\n    for right in range(len(s)):\n        while s[right] in char_set:\n            char_set.remove(s[left])\n            left += 1\n        char_set.add(s[right])\n        max_len = max(max_len, right - left + 1)\n    return max_len",
        java: "public int lengthOfLongestSubstring(String s) {\n    Set<Character> set = new HashSet<>();\n    int left = 0, maxLen = 0;\n    for (int right = 0; right < s.length(); right++) {\n        while (set.contains(s.charAt(right))) {\n            set.remove(s.charAt(left));\n            left++;\n        }\n        set.add(s.charAt(right));\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}",
        javascript: "function lengthOfLongestSubstring(s) {\n    const set = new Set();\n    let left = 0, maxLen = 0;\n    for (let right = 0; right < s.length; right++) {\n        while (set.has(s[right])) {\n            set.delete(s[left]);\n            left++;\n        }\n        set.add(s[right]);\n        maxLen = Math.max(maxLen, right - left + 1);\n    }\n    return maxLen;\n}"
      }
    },
    {
      title: "Minimum Window Substring",
      difficulty: "hard",
      problemStatement: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
      examples: [
        {
          input: "s = \"ADOBECODEBANC\", t = \"ABC\"",
          output: "\"BANC\"",
          explanation: "The minimum window substring \"BANC\" includes 'A', 'B', and 'C' from string t."
        }
      ],
      testCases: [
        { input: "\"ADOBECODEBANC\" \"ABC\"", output: "\"BANC\"" },
        { input: "\"a\" \"a\"", output: "\"a\"" },
        { input: "\"a\" \"aa\"", output: "\"\"" },
        { input: "\"aa\" \"aa\"", output: "\"aa\"" }
      ],
      conceptExplanation: "Use sliding window with two pointers, maintain a count of characters in t, expand right until all characters are covered, then shrink left.",
      workedExample: "s = \"ADOBECODEBANC\", t = \"ABC\"\nWindow from A to BANC covers A,B,C\nShrink left to D, still covers\nTo O, still\nTo B, still\nTo A, missing C\nSo BANC is min",
      initialCode: "string minWindow(string s, string t) {\n    // Your code here\n}",
      solutions: {
        cpp: "string minWindow(string s, string t) {\n    vector<int> count(128, 0);\n    for (char c : t) count[c]++;\n    int required = t.size(), left = 0, minLen = INT_MAX, start = 0;\n    for (int right = 0; right < s.size(); right++) {\n        if (--count[s[right]] >= 0) required--;\n        while (required == 0) {\n            if (right - left + 1 < minLen) {\n                minLen = right - left + 1;\n                start = left;\n            }\n            if (++count[s[left]] > 0) required++;\n            left++;\n        }\n    }\n    return minLen == INT_MAX ? \"\" : s.substr(start, minLen);\n}",
        c: "// Complex in C, similar logic with arrays\nstring minWindow(string s, string t) {\n    // Similar to C++\n}",
        python: "def minWindow(s, t):\n    from collections import Counter\n    t_count = Counter(t)\n    s_count = Counter()\n    left = 0\n    min_len = float('inf')\n    start = 0\n    required = len(t_count)\n    formed = 0\n    for right in range(len(s)):\n        s_count[s[right]] += 1\n        if s_count[s[right]] == t_count[s[right]]:\n            formed += 1\n        while left <= right and formed == required:\n            if right - left + 1 < min_len:\n                min_len = right - left + 1\n                start = left\n            s_count[s[left]] -= 1\n            if s_count[s[left]] < t_count[s[left]]:\n                formed -= 1\n            left += 1\n    return \"\" if min_len == float('inf') else s[start:start + min_len]",
        java: "public String minWindow(String s, String t) {\n    int[] count = new int[128];\n    for (char c : t.toCharArray()) count[c]++;\n    int required = t.length(), left = 0, minLen = Integer.MAX_VALUE, start = 0;\n    for (int right = 0; right < s.length(); right++) {\n        if (--count[s.charAt(right)] >= 0) required--;\n        while (required == 0) {\n            if (right - left + 1 < minLen) {\n                minLen = right - left + 1;\n                start = left;\n            }\n            if (++count[s.charAt(left)] > 0) required++;\n            left++;\n        }\n    }\n    return minLen == Integer.MAX_VALUE ? \"\" : s.substring(start, start + minLen);\n}",
        javascript: "function minWindow(s, t) {\n    const count = new Array(128).fill(0);\n    for (let c of t) count[c.charCodeAt(0)]++;\n    let required = t.length, left = 0, minLen = Infinity, start = 0;\n    for (let right = 0; right < s.length; right++) {\n        if (--count[s.charCodeAt(right)] >= 0) required--;\n        while (required === 0) {\n            if (right - left + 1 < minLen) {\n                minLen = right - left + 1;\n                start = left;\n            }\n            if (++count[s.charCodeAt(left)] > 0) required++;\n            left++;\n        }\n    }\n    return minLen === Infinity ? \"\" : s.substring(start, start + minLen);\n}"
      }
    }
  ]
};

async function ingestStrings() {
  console.log("Clearing existing data...");
  await db.delete(codeSnippets);
  await db.delete(topicExamples);
  await db.delete(problems);
  await db.delete(topics);
  console.log("Ingesting Strings topic and problems...");

  // Insert topic
  const topicInsert = await db.insert(topics).values({
    title: stringsData.topic.title,
    slug: stringsData.topic.slug,
    description: stringsData.topic.description,
    order: stringsData.topic.order,
  }).returning({ id: topics.id });

  const topicId = topicInsert[0].id;

  // Insert topic examples
  for (const [lang, code] of Object.entries(stringsData.topic.codeExamples)) {
    await db.insert(topicExamples).values({
      topicSlug: stringsData.topic.slug,
      language: lang,
      code: code as string,
    });
  }

  // For each problem
  for (const prob of stringsData.problems) {
    const problemInsert = await db.insert(problems).values({
      topicId,
      title: prob.title,
      difficulty: prob.difficulty,
      description: prob.problemStatement, // For now, simple, later can format
      initialCode: prob.initialCode,
      testCases: JSON.stringify(prob.testCases),
      conceptExplanation: prob.conceptExplanation,
      workedExample: prob.workedExample,
      order: 0, // Set order later
    }).returning({ id: problems.id });

    const problemId = problemInsert[0].id;

    // Insert solutions
    for (const [lang, code] of Object.entries(prob.solutions)) {
      await db.insert(codeSnippets).values({
        problemId,
        language: lang,
        type: "solution",
        code: code as string,
      });
    }
  }

  console.log("Strings ingested successfully!");
}

ingestStrings().catch(console.error);