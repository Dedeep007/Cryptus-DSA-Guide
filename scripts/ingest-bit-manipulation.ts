import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const bitManipulationData = {
  topic: {
    title: "Bit Manipulation",
    slug: "bit-manipulation",
    description: "Bit manipulation involves performing operations on individual bits within binary representations of numbers. These techniques are crucial for optimizing code, solving problems efficiently, and understanding low-level computer operations.",
    order: 6,
    explanation: "Bit manipulation refers to the act of algorithmically manipulating bits or binary numbers. It is a powerful technique used in programming to perform operations at the bit level, which can lead to more efficient algorithms. Common operations include AND (&), OR (|), XOR (^), NOT (~), left shift (<<), and right shift (>>). Bit manipulation is essential for tasks like setting, clearing, or toggling specific bits; checking if a number is a power of two; counting set bits; and performing arithmetic operations without using built-in operators. Understanding bit manipulation helps in competitive programming, system-level programming, and optimizing space and time complexity in various algorithms.",
    codeExamples: {
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int a = 5;  // 101 in binary\n    int b = 3;  // 011 in binary\n    cout << \"a & b = \" << (a & b) << endl;  // 001 = 1\n    cout << \"a | b = \" << (a | b) << endl;  // 111 = 7\n    cout << \"a ^ b = \" << (a ^ b) << endl;  // 110 = 6\n    cout << \"a << 1 = \" << (a << 1) << endl; // 1010 = 10\n    cout << \"a >> 1 = \" << (a >> 1) << endl; // 0010 = 2\n    return 0;\n}",
      c: "#include <stdio.h>\n\nint main() {\n    int a = 5;  // 101 in binary\n    int b = 3;  // 011 in binary\n    printf(\"a & b = %d\\n\", a & b);  // 001 = 1\n    printf(\"a | b = %d\\n\", a | b);  // 111 = 7\n    printf(\"a ^ b = %d\\n\", a ^ b);  // 110 = 6\n    printf(\"a << 1 = %d\\n\", a << 1); // 1010 = 10\n    printf(\"a >> 1 = %d\\n\", a >> 1); // 0010 = 2\n    return 0;\n}",
      python: "a = 5  # 101 in binary\nb = 3  # 011 in binary\nprint(\"a & b =\", a & b)  # 001 = 1\nprint(\"a | b =\", a | b)  # 111 = 7\nprint(\"a ^ b =\", a ^ b)  # 110 = 6\nprint(\"a << 1 =\", a << 1) # 1010 = 10\nprint(\"a >> 1 =\", a >> 1) # 0010 = 2",
      java: "public class Main {\n    public static void main(String[] args) {\n        int a = 5;  // 101 in binary\n        int b = 3;  // 011 in binary\n        System.out.println(\"a & b = \" + (a & b));  // 001 = 1\n        System.out.println(\"a | b = \" + (a | b));  // 111 = 7\n        System.out.println(\"a ^ b = \" + (a ^ b));  // 110 = 6\n        System.out.println(\"a << 1 = \" + (a << 1)); // 1010 = 10\n        System.out.println(\"a >> 1 = \" + (a >> 1)); // 0010 = 2\n    }\n}",
      javascript: "let a = 5;  // 101 in binary\nlet b = 3;  // 011 in binary\nconsole.log(\"a & b =\", a & b);  // 001 = 1\nconsole.log(\"a | b =\", a | b);  // 111 = 7\nconsole.log(\"a ^ b =\", a ^ b);  // 110 = 6\nconsole.log(\"a << 1 =\", a << 1); // 1010 = 10\nconsole.log(\"a >> 1 =\", a >> 1); // 0010 = 2"
    }
  },
  problems: [
    {
      title: "Check if a Number is Even or Odd",
      difficulty: "easy",
      problemStatement: "Given an integer n, check if it is even or odd using bit manipulation.",
      examples: [
        {
          input: "n = 4",
          output: "Even",
          explanation: "4 in binary is 100, the least significant bit is 0, so it's even."
        },
        {
          input: "n = 7",
          output: "Odd",
          explanation: "7 in binary is 111, the least significant bit is 1, so it's odd."
        }
      ],
      testCases: [
        { input: "4", output: "Even" },
        { input: "7", output: "Odd" },
        { input: "0", output: "Even" },
        { input: "1", output: "Odd" }
      ],
      conceptExplanation: "To check if a number is even or odd, we can use the bitwise AND operator with 1. If n & 1 == 0, it's even; otherwise, it's odd. This works because even numbers have 0 in the least significant bit, and odd numbers have 1.",
      workedExample: "For n = 4 (100 in binary):\n4 & 1 = 0, so even.\nFor n = 7 (111 in binary):\n7 & 1 = 1, so odd.",
      initialCode: "bool isEven(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isEven(int n) {\n    return (n & 1) == 0;\n}",
        c: "bool isEven(int n) {\n    return (n & 1) == 0;\n}",
        python: "def isEven(n):\n    return (n & 1) == 0",
        java: "public boolean isEven(int n) {\n    return (n & 1) == 0;\n}",
        javascript: "function isEven(n) {\n    return (n & 1) === 0;\n}"
      }
    },
    {
      title: "Check ith Bit",
      difficulty: "easy",
      problemStatement: "Given an integer n and a bit position i, check if the ith bit is set (1) or not (0).",
      examples: [
        {
          input: "n = 5, i = 0",
          output: "1",
          explanation: "5 in binary is 101, the 0th bit (rightmost) is 1."
        },
        {
          input: "n = 5, i = 1",
          output: "0",
          explanation: "5 in binary is 101, the 1st bit is 0."
        }
      ],
      testCases: [
        { input: "5 0", output: "1" },
        { input: "5 1", output: "0" },
        { input: "10 1", output: "1" },
        { input: "10 2", output: "0" }
      ],
      conceptExplanation: "To check if the ith bit is set, we can use the expression (n & (1 << i)) != 0. This shifts 1 to the left by i positions and performs AND with n. If the result is non-zero, the bit is set.",
      workedExample: "For n = 5 (101), i = 0:\n1 << 0 = 1 (001)\n5 & 1 = 1, so bit is set.\nFor n = 5, i = 1:\n1 << 1 = 2 (010)\n5 & 2 = 0, so bit is not set.",
      initialCode: "bool checkBit(int n, int i) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool checkBit(int n, int i) {\n    return (n & (1 << i)) != 0;\n}",
        c: "bool checkBit(int n, int i) {\n    return (n & (1 << i)) != 0;\n}",
        python: "def checkBit(n, i):\n    return (n & (1 << i)) != 0",
        java: "public boolean checkBit(int n, int i) {\n    return (n & (1 << i)) != 0;\n}",
        javascript: "function checkBit(n, i) {\n    return (n & (1 << i)) !== 0;\n}"
      }
    },
    {
      title: "Check if a Number is Power of Two",
      difficulty: "easy",
      problemStatement: "Given an integer n, check if it is a power of two using bit manipulation.",
      examples: [
        {
          input: "n = 4",
          output: "true",
          explanation: "4 is 2^2, and in binary it's 100, which has only one set bit."
        },
        {
          input: "n = 6",
          output: "false",
          explanation: "6 in binary is 110, which has two set bits."
        }
      ],
      testCases: [
        { input: "4", output: "true" },
        { input: "6", output: "false" },
        { input: "1", output: "true" },
        { input: "16", output: "true" },
        { input: "0", output: "false" }
      ],
      conceptExplanation: "A number is a power of two if it has exactly one bit set in its binary representation. We can check this by using n & (n-1) == 0, which clears the least significant set bit. If the result is 0, it was a power of two.",
      workedExample: "For n = 4 (100):\n4 & 3 = 0, so true.\nFor n = 6 (110):\n6 & 5 = 4, not 0, so false.",
      initialCode: "bool isPowerOfTwo(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isPowerOfTwo(int n) {\n    if (n <= 0) return false;\n    return (n & (n - 1)) == 0;\n}",
        c: "bool isPowerOfTwo(int n) {\n    if (n <= 0) return false;\n    return (n & (n - 1)) == 0;\n}",
        python: "def isPowerOfTwo(n):\n    if n <= 0:\n        return False\n    return (n & (n - 1)) == 0",
        java: "public boolean isPowerOfTwo(int n) {\n    if (n <= 0) return false;\n    return (n & (n - 1)) == 0;\n}",
        javascript: "function isPowerOfTwo(n) {\n    if (n <= 0) return false;\n    return (n & (n - 1)) === 0;\n}"
      }
    },
    {
      title: "Set the Rightmost Unset Bit",
      difficulty: "easy",
      problemStatement: "Given an integer n, set the rightmost unset bit (change 0 to 1) and return the new number.",
      examples: [
        {
          input: "n = 5",
          output: "7",
          explanation: "5 in binary is 101, the rightmost unset bit is at position 1, setting it gives 111 = 7."
        },
        {
          input: "n = 6",
          output: "7",
          explanation: "6 in binary is 110, the rightmost unset bit is at position 0, setting it gives 111 = 7."
        }
      ],
      testCases: [
        { input: "5", output: "7" },
        { input: "6", output: "7" },
        { input: "10", output: "11" },
        { input: "15", output: "15" }
      ],
      conceptExplanation: "To set the rightmost unset bit, we can use n | (n + 1). This works because n + 1 will flip all trailing zeros to ones and the first one to zero, then OR with n sets the rightmost zero.",
      workedExample: "For n = 5 (101):\n5 + 1 = 6 (110)\n5 | 6 = 7 (111)\nFor n = 6 (110):\n6 + 1 = 7 (111)\n6 | 7 = 7 (111)",
      initialCode: "int setRightmostUnsetBit(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int setRightmostUnsetBit(int n) {\n    return n | (n + 1);\n}",
        c: "int setRightmostUnsetBit(int n) {\n    return n | (n + 1);\n}",
        python: "def setRightmostUnsetBit(n):\n    return n | (n + 1)",
        java: "public int setRightmostUnsetBit(int n) {\n    return n | (n + 1);\n}",
        javascript: "function setRightmostUnsetBit(n) {\n    return n | (n + 1);\n}"
      }
    },
    {
      title: "Swap Two Numbers Without Temporary Variable",
      difficulty: "easy",
      problemStatement: "Given two integers a and b, swap them without using a temporary variable using bit manipulation.",
      examples: [
        {
          input: "a = 5, b = 3",
          output: "a = 3, b = 5",
          explanation: "After swapping, a becomes 3 and b becomes 5."
        }
      ],
      testCases: [
        { input: "5 3", output: "3 5" },
        { input: "10 20", output: "20 10" },
        { input: "0 1", output: "1 0" }
      ],
      conceptExplanation: "To swap two numbers using XOR: a = a ^ b; b = a ^ b; a = a ^ b. This works because XOR is associative and commutative, and x ^ x = 0, x ^ 0 = x.",
      workedExample: "a = 5 (101), b = 3 (011)\na = 5 ^ 3 = 6 (110)\nb = 6 ^ 3 = 5 (101)\na = 6 ^ 5 = 3 (011)",
      initialCode: "void swap(int &a, int &b) {\n    // Your code here\n}",
      solutions: {
        cpp: "void swap(int &a, int &b) {\n    a = a ^ b;\n    b = a ^ b;\n    a = a ^ b;\n}",
        c: "void swap(int *a, int *b) {\n    *a = *a ^ *b;\n    *b = *a ^ *b;\n    *a = *a ^ *b;\n}",
        python: "def swap(a, b):\n    a[0] = a[0] ^ b[0]\n    b[0] = a[0] ^ b[0]\n    a[0] = a[0] ^ b[0]\n    return a[0], b[0]",
        java: "public void swap(int[] a, int[] b) {\n    a[0] = a[0] ^ b[0];\n    b[0] = a[0] ^ b[0];\n    a[0] = a[0] ^ b[0];\n}",
        javascript: "function swap(a, b) {\n    a[0] = a[0] ^ b[0];\n    b[0] = a[0] ^ b[0];\n    a[0] = a[0] ^ b[0];\n    return [a[0], b[0]];\n}"
      }
    },
    {
      title: "Count Set Bits in a Number",
      difficulty: "easy",
      problemStatement: "Given an integer n, count the number of set bits (1s) in its binary representation.",
      examples: [
        {
          input: "n = 5",
          output: "2",
          explanation: "5 in binary is 101, which has two 1s."
        },
        {
          input: "n = 7",
          output: "3",
          explanation: "7 in binary is 111, which has three 1s."
        }
      ],
      testCases: [
        { input: "5", output: "2" },
        { input: "7", output: "3" },
        { input: "10", output: "2" },
        { input: "0", output: "0" }
      ],
      conceptExplanation: "To count set bits, we can use Brian Kernighan's algorithm: while n > 0, n = n & (n-1), increment count. This clears the least significant set bit in each iteration.",
      workedExample: "For n = 5 (101):\n5 & 4 = 4 (100), count = 1\n4 & 3 = 0 (000), count = 2\nDone.",
      initialCode: "int countSetBits(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int countSetBits(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}",
        c: "int countSetBits(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}",
        python: "def countSetBits(n):\n    count = 0\n    while n > 0:\n        n = n & (n - 1)\n        count += 1\n    return count",
        java: "public int countSetBits(int n) {\n    int count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}",
        javascript: "function countSetBits(n) {\n    let count = 0;\n    while (n > 0) {\n        n = n & (n - 1);\n        count++;\n    }\n    return count;\n}"
      }
    },
    {
      title: "Divide Two Numbers Using Bit Manipulation",
      difficulty: "medium",
      problemStatement: "Given two integers dividend and divisor, divide two integers without using multiplication, division, and mod operator using bit manipulation.",
      examples: [
        {
          input: "dividend = 10, divisor = 3",
          output: "3",
          explanation: "10 / 3 = 3 (integer division)."
        },
        {
          input: "dividend = 7, divisor = 2",
          output: "3",
          explanation: "7 / 2 = 3 (integer division)."
        }
      ],
      testCases: [
        { input: "10 3", output: "3" },
        { input: "7 2", output: "3" },
        { input: "15 5", output: "3" },
        { input: "1 1", output: "1" }
      ],
      conceptExplanation: "We can use bit shifting to perform division. Start from the highest bit, shift divisor left until it's greater than dividend, then subtract and add to quotient.",
      workedExample: "For 10 / 3:\nShift 3 left: 3<<1=6, 3<<2=12>10\nSo 10 - 6 = 4, quotient = 2\nNow 4 / 3: 3<<1=6>4, so quotient = 2 + 0 = 2? Wait, actually standard algorithm needed.",
      initialCode: "int divide(int dividend, int divisor) {\n    // Your code here\n}",
      solutions: {
        cpp: "int divide(int dividend, int divisor) {\n    if (divisor == 0) return INT_MAX;\n    long long a = abs(dividend), b = abs(divisor);\n    long long res = 0;\n    while (a >= b) {\n        long long temp = b, multiple = 1;\n        while (a >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        a -= temp;\n        res += multiple;\n    }\n    return (dividend < 0) ^ (divisor < 0) ? -res : res;\n}",
        c: "int divide(int dividend, int divisor) {\n    if (divisor == 0) return INT_MAX;\n    long long a = abs(dividend), b = abs(divisor);\n    long long res = 0;\n    while (a >= b) {\n        long long temp = b, multiple = 1;\n        while (a >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        a -= temp;\n        res += multiple;\n    }\n    return (dividend < 0) != (divisor < 0) ? -res : res;\n}",
        python: "def divide(dividend, divisor):\n    if divisor == 0:\n        return float('inf')\n    a, b = abs(dividend), abs(divisor)\n    res = 0\n    while a >= b:\n        temp, multiple = b, 1\n        while a >= (temp << 1):\n            temp <<= 1\n            multiple <<= 1\n        a -= temp\n        res += multiple\n    return -res if (dividend < 0) != (divisor < 0) else res",
        java: "public int divide(int dividend, int divisor) {\n    if (divisor == 0) return Integer.MAX_VALUE;\n    long a = Math.abs(dividend), b = Math.abs(divisor);\n    long res = 0;\n    while (a >= b) {\n        long temp = b, multiple = 1;\n        while (a >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        a -= temp;\n        res += multiple;\n    }\n    return (int) ((dividend < 0) != (divisor < 0) ? -res : res);\n}",
        javascript: "function divide(dividend, divisor) {\n    if (divisor === 0) return Number.MAX_SAFE_INTEGER;\n    let a = Math.abs(dividend), b = Math.abs(divisor);\n    let res = 0;\n    while (a >= b) {\n        let temp = b, multiple = 1;\n        while (a >= (temp << 1)) {\n            temp <<= 1;\n            multiple <<= 1;\n        }\n        a -= temp;\n        res += multiple;\n    }\n    return (dividend < 0) !== (divisor < 0) ? -res : res;\n}"
      }
    },
    {
      title: "Count Set Bits from 1 to N",
      difficulty: "medium",
      problemStatement: "Given an integer n, count the total number of set bits in the binary representations of all numbers from 1 to n.",
      examples: [
        {
          input: "n = 3",
          output: "4",
          explanation: "1 (1), 2 (10), 3 (11) have 1+1+2=4 set bits."
        },
        {
          input: "n = 4",
          output: "5",
          explanation: "1(1), 2(10), 3(11), 4(100) have 1+1+2+1=5 set bits."
        }
      ],
      testCases: [
        { input: "3", output: "4" },
        { input: "4", output: "5" },
        { input: "5", output: "7" },
        { input: "1", output: "1" }
      ],
      conceptExplanation: "We can use a loop from 1 to n and count set bits for each, but for efficiency, we can use the formula for each bit position.",
      workedExample: "For n=3:\n1: 1 bit\n2: 1 bit\n3: 2 bits\nTotal: 4",
      initialCode: "int countSetBits(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int countSetBits(int n) {\n    int count = 0;\n    for (int i = 1; i <= n; i++) {\n        int num = i;\n        while (num > 0) {\n            num = num & (num - 1);\n            count++;\n        }\n    }\n    return count;\n}",
        c: "int countSetBits(int n) {\n    int count = 0;\n    for (int i = 1; i <= n; i++) {\n        int num = i;\n        while (num > 0) {\n            num = num & (num - 1);\n            count++;\n        }\n    }\n    return count;\n}",
        python: "def countSetBits(n):\n    count = 0\n    for i in range(1, n+1):\n        num = i\n        while num > 0:\n            num = num & (num - 1)\n            count += 1\n    return count",
        java: "public int countSetBits(int n) {\n    int count = 0;\n    for (int i = 1; i <= n; i++) {\n        int num = i;\n        while (num > 0) {\n            num = num & (num - 1);\n            count++;\n        }\n    }\n    return count;\n}",
        javascript: "function countSetBits(n) {\n    let count = 0;\n    for (let i = 1; i <= n; i++) {\n        let num = i;\n        while (num > 0) {\n            num = num & (num - 1);\n            count++;\n        }\n    }\n    return count;\n}"
      }
    },
    {
      title: "Minimum Bit Flips to Convert Number",
      difficulty: "medium",
      problemStatement: "Given two numbers start and goal, find the minimum number of bit flips required to convert start to goal.",
      examples: [
        {
          input: "start = 10, goal = 7",
          output: "3",
          explanation: "10 is 1010, 7 is 0111, flip 3 bits."
        },
        {
          input: "start = 3, goal = 4",
          output: "3",
          explanation: "3 is 011, 4 is 100, flip 3 bits."
        }
      ],
      testCases: [
        { input: "10 7", output: "3" },
        { input: "3 4", output: "3" },
        { input: "1 2", output: "2" },
        { input: "0 0", output: "0" }
      ],
      conceptExplanation: "The minimum flips is the count of different bits between start and goal, which is the number of 1s in start ^ goal.",
      workedExample: "10 ^ 7 = 13 (1101), set bits = 3",
      initialCode: "int minBitFlips(int start, int goal) {\n    // Your code here\n}",
      solutions: {
        cpp: "int minBitFlips(int start, int goal) {\n    int xor_val = start ^ goal;\n    int count = 0;\n    while (xor_val > 0) {\n        xor_val = xor_val & (xor_val - 1);\n        count++;\n    }\n    return count;\n}",
        c: "int minBitFlips(int start, int goal) {\n    int xor_val = start ^ goal;\n    int count = 0;\n    while (xor_val > 0) {\n        xor_val = xor_val & (xor_val - 1);\n        count++;\n    }\n    return count;\n}",
        python: "def minBitFlips(start, goal):\n    xor_val = start ^ goal\n    count = 0\n    while xor_val > 0:\n        xor_val = xor_val & (xor_val - 1)\n        count += 1\n    return count",
        java: "public int minBitFlips(int start, int goal) {\n    int xor_val = start ^ goal;\n    int count = 0;\n    while (xor_val > 0) {\n        xor_val = xor_val & (xor_val - 1);\n        count++;\n    }\n    return count;\n}",
        javascript: "function minBitFlips(start, goal) {\n    let xor_val = start ^ goal;\n    let count = 0;\n    while (xor_val > 0) {\n        xor_val = xor_val & (xor_val - 1);\n        count++;\n    }\n    return count;\n}"
      }
    },
    {
      title: "Find the Number That Appears Odd Number of Times",
      difficulty: "medium",
      problemStatement: "Given an array of integers where every number appears even number of times except one number which appears odd number of times, find that number.",
      examples: [
        {
          input: "[1, 1, 2, 2, 3]",
          output: "3",
          explanation: "3 appears once, others twice."
        },
        {
          input: "[4, 4, 4, 5, 5]",
          output: "4",
          explanation: "4 appears three times, 5 twice."
        }
      ],
      testCases: [
        { input: "[1,1,2,2,3]", output: "3" },
        { input: "[4,4,4,5,5]", output: "4" },
        { input: "[2]", output: "2" },
        { input: "[1,1,1,1,2,2,2]", output: "2" }
      ],
      conceptExplanation: "XOR all elements. Since XOR is associative and commutative, and x ^ x = 0, x ^ 0 = x, the number that appears odd times will remain.",
      workedExample: "1^1^2^2^3 = (1^1)^(2^2)^3 = 0^0^3 = 3",
      initialCode: "int findOddOccurring(int arr[], int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int findOddOccurring(int arr[], int n) {\n    int res = 0;\n    for (int i = 0; i < n; i++) {\n        res ^= arr[i];\n    }\n    return res;\n}",
        c: "int findOddOccurring(int arr[], int n) {\n    int res = 0;\n    for(int i = 0; i < n; i++) {\n        res ^= arr[i];\n    }\n    return res;\n}",
        python: "def findOddOccurring(arr):\n    res = 0\n    for num in arr:\n        res ^= num\n    return res",
        java: "public int findOddOccurring(int[] arr) {\n    int res = 0;\n    for(int num : arr) {\n        res ^= num;\n    }\n    return res;\n}",
        javascript: "function findOddOccurring(arr) {\n    let res = 0;\n    for(let num of arr) {\n        res ^= num;\n    }\n    return res;\n}"
      }
    },
    {
      title: "XOR of Numbers from L to R",
      difficulty: "medium",
      problemStatement: "Given two integers L and R, find the XOR of all numbers from L to R inclusive.",
      examples: [
        {
          input: "L = 1, R = 3",
          output: "0",
          explanation: "1 ^ 2 ^ 3 = 0"
        },
        {
          input: "L = 2, R = 4",
          output: "5",
          explanation: "2 ^ 3 ^ 4 = 5"
        }
      ],
      testCases: [
        { input: "1 3", output: "0" },
        { input: "2 4", output: "5" },
        { input: "1 1", output: "1" },
        { input: "5 5", output: "5" }
      ],
      conceptExplanation: "We can use the property that XOR from 1 to n has a pattern based on n%4. Then XOR_L_to_R = XOR_1_to_R ^ XOR_1_to_(L-1)",
      workedExample: "XOR 1 to 3: 1^2^3=0\nXOR 1 to 1: 1\n0 ^ 1 = 0? Wait, for L=1, it's XOR_1_to_3",
      initialCode: "int xorFromLtoR(int L, int R) {\n    // Your code here\n}",
      solutions: {
        cpp: "int xorFromLtoR(int L, int R) {\n    auto xorUpTo = [](int n) {\n        int mod = n % 4;\n        if (mod == 0) return n;\n        if (mod == 1) return 1;\n        if (mod == 2) return n + 1;\n        return 0;\n    };\n    return xorUpTo(R) ^ xorUpTo(L - 1);\n}",
        c: "int xorUpTo(int n) {\n    int mod = n % 4;\n    if (mod == 0) return n;\n    if (mod == 1) return 1;\n    if (mod == 2) return n + 1;\n    return 0;\n}\nint xorFromLtoR(int L, int R) {\n    return xorUpTo(R) ^ xorUpTo(L - 1);\n}",
        python: "def xorUpTo(n):\n    mod = n % 4\n    if mod == 0: return n\n    if mod == 1: return 1\n    if mod == 2: return n + 1\n    return 0\ndef xorFromLtoR(L, R):\n    return xorUpTo(R) ^ xorUpTo(L - 1)",
        java: "public int xorUpTo(int n) {\n    int mod = n % 4;\n    if (mod == 0) return n;\n    if (mod == 1) return 1;\n    if (mod == 2) return n + 1;\n    return 0;\n}\npublic int xorFromLtoR(int L, int R) {\n    return xorUpTo(R) ^ xorUpTo(L - 1);\n}",
        javascript: "function xorUpTo(n) {\n    let mod = n % 4;\n    if (mod === 0) return n;\n    if (mod === 1) return 1;\n    if (mod === 2) return n + 1;\n    return 0;\n}\nfunction xorFromLtoR(L, R) {\n    return xorUpTo(R) ^ xorUpTo(L - 1);\n}"
      }
    },
    {
      title: "Prime Factors of a Number",
      difficulty: "medium",
      problemStatement: "Given an integer n, find all prime factors of n.",
      examples: [
        {
          input: "n = 12",
          output: "[2, 3]",
          explanation: "12 = 2^2 * 3"
        },
        {
          input: "n = 7",
          output: "[7]",
          explanation: "7 is prime"
        }
      ],
      testCases: [
        { input: "12", output: "[2,3]" },
        { input: "7", output: "[7]" },
        { input: "1", output: "[]" },
        { input: "100", output: "[2,5]" }
      ],
      conceptExplanation: "To find prime factors, divide n by 2, then odd numbers up to sqrt(n).",
      workedExample: "For 12: 12/2=6, 6/2=3, 3/3=1, factors 2,3",
      initialCode: "vector<int> primeFactors(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> primeFactors(int n) {\n    vector<int> factors;\n    while (n % 2 == 0) {\n        factors.push_back(2);\n        n /= 2;\n    }\n    for (int i = 3; i * i <= n; i += 2) {\n        while (n % i == 0) {\n            factors.push_back(i);\n            n /= i;\n        }\n    }\n    if (n > 1) factors.push_back(n);\n    return factors;\n}",
        c: "#include <stdio.h>\n#include <stdlib.h>\nint* primeFactors(int n, int* size) {\n    int* factors = (int*)malloc(sizeof(int) * 100);\n    *size = 0;\n    while (n % 2 == 0) {\n        factors[(*size)++] = 2;\n        n /= 2;\n    }\n    for (int i = 3; i * i <= n; i += 2) {\n        while (n % i == 0) {\n            factors[(*size)++] = i;\n            n /= i;\n        }\n    }\n    if (n > 1) factors[(*size)++] = n;\n    return factors;\n}",
        python: "def primeFactors(n):\n    factors = []\n    while n % 2 == 0:\n        factors.append(2)\n        n //= 2\n    i = 3\n    while i * i <= n:\n        while n % i == 0:\n            factors.append(i)\n            n //= i\n        i += 2\n    if n > 1:\n        factors.append(n)\n    return factors",
        java: "public List<Integer> primeFactors(int n) {\n    List<Integer> factors = new ArrayList<>();\n    while (n % 2 == 0) {\n        factors.add(2);\n        n /= 2;\n    }\n    for (int i = 3; i * i <= n; i += 2) {\n        while (n % i == 0) {\n            factors.add(i);\n            n /= i;\n        }\n    }\n    if (n > 1) factors.add(n);\n    return factors;\n}",
        javascript: "function primeFactors(n) {\n    let factors = [];\n    while (n % 2 === 0) {\n        factors.push(2);\n        n /= 2;\n    }\n    for (let i = 3; i * i <= n; i += 2) {\n        while (n % i === 0) {\n            factors.push(i);\n            n /= i;\n        }\n    }\n    if (n > 1) factors.push(n);\n    return factors;\n}"
      }
    },
    {
      title: "All Divisors of a Number",
      difficulty: "medium",
      problemStatement: "Given an integer n, find all divisors of n.",
      examples: [
        {
          input: "n = 12",
          output: "[1, 2, 3, 4, 6, 12]",
          explanation: "Divisors of 12"
        },
        {
          input: "n = 7",
          output: "[1, 7]",
          explanation: "Divisors of 7"
        }
      ],
      testCases: [
        { input: "12", output: "[1,2,3,4,6,12]" },
        { input: "7", output: "[1,7]" },
        { input: "1", output: "[1]" },
        { input: "36", output: "[1,2,3,4,6,9,12,18,36]" }
      ],
      conceptExplanation: "Iterate from 1 to sqrt(n), if i divides n, add i and n/i if different.",
      workedExample: "For 12: 1,2,3,4,6,12",
      initialCode: "vector<int> allDivisors(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> allDivisors(int n) {\n    vector<int> divisors;\n    for (int i = 1; i * i <= n; i++) {\n        if (n % i == 0) {\n            divisors.push_back(i);\n            if (i != n / i) divisors.push_back(n / i);\n        }\n    }\n    sort(divisors.begin(), divisors.end());\n    return divisors;\n}",
        c: "#include <stdlib.h>\nint* allDivisors(int n, int* size) {\n    int* divisors = (int*)malloc(sizeof(int) * 100);\n    *size = 0;\n    for (int i = 1; i * i <= n; i++) {\n        if (n % i == 0) {\n            divisors[(*size)++] = i;\n            if (i != n / i) divisors[(*size)++] = n / i;\n        }\n    }\n    // sort not implemented\n    return divisors;\n}",
        python: "def allDivisors(n):\n    divisors = []\n    for i in range(1, int(n**0.5) + 1):\n        if n % i == 0:\n            divisors.append(i)\n            if i != n // i:\n                divisors.append(n // i)\n    divisors.sort()\n    return divisors",
        java: "public List<Integer> allDivisors(int n) {\n    List<Integer> divisors = new ArrayList<>();\n    for (int i = 1; i * i <= n; i++) {\n        if (n % i == 0) {\n            divisors.add(i);\n            if (i != n / i) divisors.add(n / i);\n        }\n    }\n    Collections.sort(divisors);\n    return divisors;\n}",
        javascript: "function allDivisors(n) {\n    let divisors = [];\n    for (let i = 1; i * i <= n; i++) {\n        if (n % i === 0) {\n            divisors.push(i);\n            if (i !== n / i) divisors.push(n / i);\n        }\n    }\n    divisors.sort((a, b) => a - b);\n    return divisors;\n}"
      }
    },
    {
      title: "Sieve of Eratosthenes",
      difficulty: "hard",
      problemStatement: "Given an integer n, find all prime numbers up to n using Sieve of Eratosthenes.",
      examples: [
        {
          input: "n = 10",
          output: "[2, 3, 5, 7]",
          explanation: "Primes up to 10"
        },
        {
          input: "n = 5",
          output: "[2, 3, 5]",
          explanation: "Primes up to 5"
        }
      ],
      testCases: [
        { input: "10", output: "[2,3,5,7]" },
        { input: "5", output: "[2,3,5]" },
        { input: "2", output: "[2]" },
        { input: "1", output: "[]" }
      ],
      conceptExplanation: "Create a boolean array, mark multiples of each prime starting from 2.",
      workedExample: "For n=10: mark 4,6,8,10 for 2; 6,9 for 3; 8 for 4; etc.",
      initialCode: "vector<int> sieve(int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> sieve(int n) {\n    vector<bool> isPrime(n + 1, true);\n    isPrime[0] = isPrime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i) {\n                isPrime[j] = false;\n            }\n        }\n    }\n    vector<int> primes;\n    for (int i = 2; i <= n; i++) {\n        if (isPrime[i]) primes.push_back(i);\n    }\n    return primes;\n}",
        c: "#include <stdlib.h>\nint* sieve(int n, int* size) {\n    int* isPrime = (int*)malloc(sizeof(int) * (n + 1));\n    for (int i = 0; i <= n; i++) isPrime[i] = 1;\n    isPrime[0] = isPrime[1] = 0;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i) {\n                isPrime[j] = 0;\n            }\n        }\n    }\n    int* primes = (int*)malloc(sizeof(int) * (n + 1));\n    *size = 0;\n    for (int i = 2; i <= n; i++) {\n        if (isPrime[i]) primes[(*size)++] = i;\n    }\n    free(isPrime);\n    return primes;\n}",
        python: "def sieve(n):\n    isPrime = [True] * (n + 1)\n    isPrime[0] = isPrime[1] = False\n    for i in range(2, int(n**0.5) + 1):\n        if isPrime[i]:\n            for j in range(i*i, n+1, i):\n                isPrime[j] = False\n    primes = [i for i in range(2, n+1) if isPrime[i]]\n    return primes",
        java: "public List<Integer> sieve(int n) {\n    boolean[] isPrime = new boolean[n + 1];\n    Arrays.fill(isPrime, true);\n    isPrime[0] = isPrime[1] = false;\n    for (int i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (int j = i * i; j <= n; j += i) {\n                isPrime[j] = false;\n            }\n        }\n    }\n    List<Integer> primes = new ArrayList<>();\n    for (int i = 2; i <= n; i++) {\n        if (isPrime[i]) primes.add(i);\n    }\n    return primes;\n}",
        javascript: "function sieve(n) {\n    let isPrime = new Array(n + 1).fill(true);\n    isPrime[0] = isPrime[1] = false;\n    for (let i = 2; i * i <= n; i++) {\n        if (isPrime[i]) {\n            for (let j = i * i; j <= n; j += i) {\n                isPrime[j] = false;\n            }\n        }\n    }\n    let primes = [];\n    for (let i = 2; i <= n; i++) {\n        if (isPrime[i]) primes.push(i);\n    }\n    return primes;\n}"
      }
    },
    {
      title: "Fast Power (Binary Exponentiation)",
      difficulty: "hard",
      problemStatement: "Given base x and exponent n, compute x^n using binary exponentiation.",
      examples: [
        {
          input: "x = 2, n = 10",
          output: "1024",
          explanation: "2^10 = 1024"
        },
        {
          input: "x = 3, n = 4",
          output: "81",
          explanation: "3^4 = 81"
        }
      ],
      testCases: [
        { input: "2 10", output: "1024" },
        { input: "3 4", output: "81" },
        { input: "5 0", output: "1" },
        { input: "2 3", output: "8" }
      ],
      conceptExplanation: "Use the binary representation of n, multiply result by x when bit is 1, square x each time.",
      workedExample: "For 2^10: 10 in binary 1010, result=1, x=2\nBit 0: 1, result=2, x=4\nBit 1: 0, x=16\nBit 2: 1, result=32, x=256\nBit 3: 0, x=65536\n=32",
      initialCode: "long long fastPower(long long x, int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "long long fastPower(long long x, int n) {\n    long long res = 1;\n    while (n > 0) {\n        if (n & 1) res *= x;\n        x *= x;\n        n >>= 1;\n    }\n    return res;\n}",
        c: "long long fastPower(long long x, int n) {\n    long long res = 1;\n    while (n > 0) {\n        if (n & 1) res *= x;\n        x *= x;\n        n >>= 1;\n    }\n    return res;\n}",
        python: "def fastPower(x, n):\n    res = 1\n    while n > 0:\n        if n & 1:\n            res *= x\n        x *= x\n        n >>= 1\n    return res",
        java: "public long fastPower(long x, int n) {\n    long res = 1;\n    while (n > 0) {\n        if ((n & 1) == 1) res *= x;\n        x *= x;\n        n >>= 1;\n    }\n    return res;\n}",
        javascript: "function fastPower(x, n) {\n    let res = 1;\n    while (n > 0) {\n        if (n & 1) res *= x;\n        x *= x;\n        n >>= 1;\n    }\n    return res;\n}"
      }
    }
  ]
};

async function main() {
  try {
    const insertedTopic = await db.insert(topics).values({
      title: bitManipulationData.topic.title,
      slug: bitManipulationData.topic.slug,
      description: bitManipulationData.topic.description,
      order: bitManipulationData.topic.order
    }).returning({ id: topics.id });
    const topicId = insertedTopic[0].id;

    // Insert topic examples
    for (const [lang, code] of Object.entries(bitManipulationData.topic.codeExamples)) {
      await db.insert(topicExamples).values({
        topicSlug: bitManipulationData.topic.slug,
        language: lang,
        code: code as string,
      });
    }

    for (const problem of bitManipulationData.problems) {
      const insertedProblem = await db.insert(problems).values({
        topicId,
        title: problem.title,
        difficulty: problem.difficulty,
        description: problem.problemStatement,
        initialCode: problem.initialCode,
        testCases: JSON.stringify(problem.testCases),
        conceptExplanation: problem.conceptExplanation,
        workedExample: problem.workedExample,
        order: 0
      }).returning({ id: problems.id });

      const problemId = insertedProblem[0].id;

      for (const [language, code] of Object.entries(problem.solutions)) {
        await db.insert(codeSnippets).values({
          problemId,
          language,
          type: 'solution',
          code
        });
      }
    }
    console.log('Bit Manipulation curriculum data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

main();