import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const stackQueuesData = {
  topic: {
    title: "Stack and Queues",
    slug: "stack-and-queues",
    description: "Stacks and queues are fundamental data structures that follow specific order principles. Stacks follow LIFO (Last In, First Out) while queues follow FIFO (First In, First Out). They are essential for solving problems involving order, recursion simulation, and breadth-first search algorithms.",
    order: 7,
    explanation: "Stacks and queues are linear data structures that differ in how elements are added and removed. A stack uses LIFO order - the last element added is the first to be removed, like a stack of plates. A queue uses FIFO order - the first element added is the first to be removed, like a line at a store. Common implementations use arrays or linked lists. Key operations for stacks are push (add), pop (remove), and peek (view top). For queues, enqueue (add) and dequeue (remove). These structures are crucial for parsing expressions, implementing undo mechanisms, breadth-first search, and managing function calls in recursion.",
    codeExamples: {
      cpp: "#include <iostream>\n#include <stack>\n#include <queue>\nusing namespace std;\n\nint main() {\n    // Stack operations\n    stack<int> s;\n    s.push(1);\n    s.push(2);\n    cout << \"Stack top: \" << s.top() << endl;\n    s.pop();\n    cout << \"Stack size: \" << s.size() << endl;\n    \n    // Queue operations\n    queue<int> q;\n    q.push(1);\n    q.push(2);\n    cout << \"Queue front: \" << q.front() << endl;\n    q.pop();\n    cout << \"Queue size: \" << q.size() << endl;\n    \n    return 0;\n}",
      c: "#include <stdio.h>\n#include <stdlib.h>\n\n// Simple stack implementation\n#define MAX 100\nint stack[MAX];\nint top = -1;\n\nvoid push(int x) {\n    if (top == MAX - 1) return;\n    stack[++top] = x;\n}\n\nint pop() {\n    if (top == -1) return -1;\n    return stack[top--];\n}\n\nint peek() {\n    if (top == -1) return -1;\n    return stack[top];\n}\n\n// Simple queue implementation\nint queue[MAX];\nint front = -1, rear = -1;\n\nvoid enqueue(int x) {\n    if (rear == MAX - 1) return;\n    if (front == -1) front = 0;\n    queue[++rear] = x;\n}\n\nint dequeue() {\n    if (front == -1 || front > rear) return -1;\n    int x = queue[front++];\n    if (front > rear) front = rear = -1;\n    return x;\n}\n\nint main() {\n    push(1);\n    push(2);\n    printf(\"Stack top: %d\\n\", peek());\n    pop();\n    printf(\"Stack top after pop: %d\\n\", peek());\n    \n    enqueue(1);\n    enqueue(2);\n    printf(\"Queue front: %d\\n\", queue[front]);\n    dequeue();\n    printf(\"Queue front after dequeue: %d\\n\", queue[front]);\n    \n    return 0;\n}",
      python: "# Stack operations\nstack = []\nstack.append(1)\nstack.append(2)\nprint(\"Stack top:\", stack[-1])\nstack.pop()\nprint(\"Stack size:\", len(stack))\n\n# Queue operations\nfrom collections import deque\nqueue = deque()\nqueue.append(1)\nqueue.append(2)\nprint(\"Queue front:\", queue[0])\nqueue.popleft()\nprint(\"Queue size:\", len(queue))",
      java: "import java.util.Stack;\nimport java.util.Queue;\nimport java.util.LinkedList;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Stack operations\n        Stack<Integer> stack = new Stack<>();\n        stack.push(1);\n        stack.push(2);\n        System.out.println(\"Stack top: \" + stack.peek());\n        stack.pop();\n        System.out.println(\"Stack size: \" + stack.size());\n        \n        // Queue operations\n        Queue<Integer> queue = new LinkedList<>();\n        queue.add(1);\n        queue.add(2);\n        System.out.println(\"Queue front: \" + queue.peek());\n        queue.poll();\n        System.out.println(\"Queue size: \" + queue.size());\n    }\n}",
      javascript: "// Stack operations\nlet stack = [];\nstack.push(1);\nstack.push(2);\nconsole.log(\"Stack top:\", stack[stack.length - 1]);\nstack.pop();\nconsole.log(\"Stack size:\", stack.length);\n\n// Queue operations\nlet queue = [];\nqueue.push(1);\nqueue.push(2);\nconsole.log(\"Queue front:\", queue[0]);\nqueue.shift();\nconsole.log(\"Queue size:\", queue.length);"
    }
  },
  problems: [
    {
      title: "Valid Parentheses",
      difficulty: "easy",
      problemStatement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
      examples: [
        {
          input: "s = \"()\"",
          output: "true",
          explanation: "The string has one opening and one closing parenthesis, which are matched correctly."
        },
        {
          input: "s = \"()[]{}\"",
          output: "true",
          explanation: "All brackets are properly opened and closed in the correct order."
        },
        {
          input: "s = \"(]\"",
          output: "false",
          explanation: "The opening parenthesis is closed by a square bracket, which is incorrect."
        }
      ],
      testCases: [
        { input: "\"()\"", output: "true" },
        { input: "\"()[]{}\"", output: "true" },
        { input: "\"(]\"", output: "false" },
        { input: "\"([])\"", output: "true" },
        { input: "\"{}\"", output: "true" }
      ],
      conceptExplanation: "Use a stack to keep track of opening brackets. When encountering a closing bracket, check if it matches the top of the stack. If it matches, pop the stack; otherwise, the string is invalid.",
      workedExample: "For s = \"()[]{}\":\n- Encounter '(', push to stack: ['(']\n- Encounter ')', matches top '(', pop stack: []\n- Encounter '[', push to stack: ['[']\n- Encounter ']', matches top '[', pop stack: []\n- Encounter '{', push to stack: ['{']\n- Encounter '}', matches top '{', pop stack: []\n- Stack is empty, valid string",
      initialCode: "bool isValid(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') {\n            st.push(c);\n        } else {\n            if (st.empty()) return false;\n            char top = st.top();\n            st.pop();\n            if ((c == ')' && top != '(') ||\n                (c == '}' && top != '{') ||\n                (c == ']' && top != '[')) {\n                return false;\n            }\n        }\n    }\n    return st.empty();\n}",
        c: "bool isValid(char* s) {\n    int len = strlen(s);\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        if (s[i] == '(' || s[i] == '{' || s[i] == '[') {\n            stack[++top] = s[i];\n        } else {\n            if (top == -1) return false;\n            char topChar = stack[top--];\n            if ((s[i] == ')' && topChar != '(') ||\n                (s[i] == '}' && topChar != '{') ||\n                (s[i] == ']' && topChar != '[')) {\n                return false;\n            }\n        }\n    }\n    return top == -1;\n}",
        python: "def isValid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top_element = stack.pop() if stack else '#'\n            if mapping[char] != top_element:\n                return False\n        else:\n            stack.append(char)\n    return not stack",
        java: "public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') {\n            stack.push(c);\n        } else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if ((c == ')' && top != '(') ||\n                (c == '}' && top != '{') ||\n                (c == ']' && top != '[')) {\n                return false;\n            }\n        }\n    }\n    return stack.isEmpty();\n}",
        javascript: "function isValid(s) {\n    const stack = [];\n    const mapping = {\n        ')': '(',\n        '}': '{',\n        ']': '['\n    };\n    for (let char of s) {\n        if (char in mapping) {\n            const topElement = stack.length === 0 ? '#' : stack.pop();\n            if (mapping[char] !== topElement) {\n                return false;\n            }\n        } else {\n            stack.push(char);\n        }\n    }\n    return stack.length === 0;\n}"
      }
    },
    {
      title: "Implement Stack using Arrays",
      difficulty: "easy",
      problemStatement: "Implement a stack data structure using arrays with push, pop, and peek operations.",
      examples: [
        {
          input: "push(1), push(2), peek()",
          output: "2",
          explanation: "After pushing 1 and 2, the top element is 2."
        },
        {
          input: "push(1), pop(), peek()",
          output: "Stack is empty",
          explanation: "After pushing 1 and popping it, the stack is empty."
        }
      ],
      testCases: [
        { input: "push(1);push(2);peek()", output: "2" },
        { input: "push(1);pop();peek()", output: "empty" },
        { input: "push(5);push(10);pop();peek()", output: "5" }
      ],
      conceptExplanation: "Use an array to store elements and a top pointer to track the current top element. Push adds to the end, pop removes from the end, peek returns the last element.",
      workedExample: "Initialize array = [], top = -1\npush(1): array = [1], top = 0\npush(2): array = [1,2], top = 1\npeek(): return array[1] = 2\npop(): remove array[1], top = 0, return 2\npeek(): return array[0] = 1",
      initialCode: "class Stack {\n    // Implement push, pop, peek methods\n}",
      solutions: {
        cpp: "class Stack {\nprivate:\n    int* arr;\n    int top;\n    int capacity;\npublic:\n    Stack(int size = 1000) {\n        capacity = size;\n        arr = new int[capacity];\n        top = -1;\n    }\n    \n    void push(int x) {\n        if (top == capacity - 1) return;\n        arr[++top] = x;\n    }\n    \n    int pop() {\n        if (top == -1) return -1;\n        return arr[top--];\n    }\n    \n    int peek() {\n        if (top == -1) return -1;\n        return arr[top];\n    }\n};",
        c: "typedef struct {\n    int* arr;\n    int top;\n    int capacity;\n} Stack;\n\nStack* createStack(int capacity) {\n    Stack* stack = (Stack*)malloc(sizeof(Stack));\n    stack->capacity = capacity;\n    stack->top = -1;\n    stack->arr = (int*)malloc(stack->capacity * sizeof(int));\n    return stack;\n}\n\nvoid push(Stack* stack, int item) {\n    if (stack->top == stack->capacity - 1) return;\n    stack->arr[++stack->top] = item;\n}\n\nint pop(Stack* stack) {\n    if (stack->top == -1) return -1;\n    return stack->arr[stack->top--];\n}\n\nint peek(Stack* stack) {\n    if (stack->top == -1) return -1;\n    return stack->arr[stack->top];\n}",
        python: "class Stack:\n    def __init__(self):\n        self.arr = []\n    \n    def push(self, x):\n        self.arr.append(x)\n    \n    def pop(self):\n        if not self.arr:\n            return None\n        return self.arr.pop()\n    \n    def peek(self):\n        if not self.arr:\n            return None\n        return self.arr[-1]",
        java: "class Stack {\n    private int[] arr;\n    private int top;\n    private int capacity;\n    \n    public Stack(int size) {\n        capacity = size;\n        arr = new int[capacity];\n        top = -1;\n    }\n    \n    public void push(int x) {\n        if (top == capacity - 1) return;\n        arr[++top] = x;\n    }\n    \n    public int pop() {\n        if (top == -1) return -1;\n        return arr[top--];\n    }\n    \n    public int peek() {\n        if (top == -1) return -1;\n        return arr[top];\n    }\n}",
        javascript: "class Stack {\n    constructor() {\n        this.arr = [];\n    }\n    \n    push(x) {\n        this.arr.push(x);\n    }\n    \n    pop() {\n        if (this.arr.length === 0) return null;\n        return this.arr.pop();\n    }\n    \n    peek() {\n        if (this.arr.length === 0) return null;\n        return this.arr[this.arr.length - 1];\n    }\n}"
      }
    },
    {
      title: "Implement Queue using Arrays",
      difficulty: "easy",
      problemStatement: "Implement a queue data structure using arrays with enqueue and dequeue operations.",
      examples: [
        {
          input: "enqueue(1), enqueue(2), front()",
          output: "1",
          explanation: "After enqueuing 1 and 2, the front element is 1."
        },
        {
          input: "enqueue(1), dequeue(), front()",
          output: "Queue is empty",
          explanation: "After enqueuing 1 and dequeuing it, the queue is empty."
        }
      ],
      testCases: [
        { input: "enqueue(1);enqueue(2);front()", output: "1" },
        { input: "enqueue(1);dequeue();front()", output: "empty" },
        { input: "enqueue(5);enqueue(10);dequeue();front()", output: "10" }
      ],
      conceptExplanation: "Use an array with front and rear pointers. Enqueue adds to the rear, dequeue removes from the front. Handle wrap-around for circular queue implementation.",
      workedExample: "Initialize array = [], front = -1, rear = -1\nenqueue(1): array = [1], front = 0, rear = 0\nenqueue(2): array = [1,2], rear = 1\nfront(): return array[0] = 1\ndequeue(): front = 1, return 1\nfront(): return array[1] = 2",
      initialCode: "class Queue {\n    // Implement enqueue, dequeue, front methods\n}",
      solutions: {
        cpp: "class Queue {\nprivate:\n    int* arr;\n    int front, rear, capacity;\npublic:\n    Queue(int size = 1000) {\n        capacity = size;\n        arr = new int[capacity];\n        front = -1;\n        rear = -1;\n    }\n    \n    void enqueue(int x) {\n        if (rear == capacity - 1) return;\n        if (front == -1) front = 0;\n        arr[++rear] = x;\n    }\n    \n    int dequeue() {\n        if (front == -1 || front > rear) return -1;\n        int x = arr[front++];\n        if (front > rear) front = rear = -1;\n        return x;\n    }\n    \n    int front() {\n        if (front == -1 || front > rear) return -1;\n        return arr[front];\n    }\n};",
        c: "typedef struct {\n    int* arr;\n    int front, rear, capacity;\n} Queue;\n\nQueue* createQueue(int capacity) {\n    Queue* queue = (Queue*)malloc(sizeof(Queue));\n    queue->capacity = capacity;\n    queue->front = -1;\n    queue->rear = -1;\n    queue->arr = (int*)malloc(queue->capacity * sizeof(int));\n    return queue;\n}\n\nvoid enqueue(Queue* queue, int item) {\n    if (queue->rear == queue->capacity - 1) return;\n    if (queue->front == -1) queue->front = 0;\n    queue->arr[++queue->rear] = item;\n}\n\nint dequeue(Queue* queue) {\n    if (queue->front == -1 || queue->front > queue->rear) return -1;\n    int item = queue->arr[queue->front++];\n    if (queue->front > queue->rear) queue->front = queue->rear = -1;\n    return item;\n}\n\nint front(Queue* queue) {\n    if (queue->front == -1 || queue->front > queue->rear) return -1;\n    return queue->arr[queue->front];\n}",
        python: "class Queue:\n    def __init__(self):\n        self.arr = []\n    \n    def enqueue(self, x):\n        self.arr.append(x)\n    \n    def dequeue(self):\n        if not self.arr:\n            return None\n        return self.arr.pop(0)\n    \n    def front(self):\n        if not self.arr:\n            return None\n        return self.arr[0]",
        java: "class Queue {\n    private int[] arr;\n    private int front, rear, capacity;\n    \n    public Queue(int size) {\n        capacity = size;\n        arr = new int[capacity];\n        front = -1;\n        rear = -1;\n    }\n    \n    public void enqueue(int x) {\n        if (rear == capacity - 1) return;\n        if (front == -1) front = 0;\n        arr[++rear] = x;\n    }\n    \n    public int dequeue() {\n        if (front == -1 || front > rear) return -1;\n        int x = arr[front++];\n        if (front > rear) front = rear = -1;\n        return x;\n    }\n    \n    public int front() {\n        if (front == -1 || front > rear) return -1;\n        return arr[front];\n    }\n}",
        javascript: "class Queue {\n    constructor() {\n        this.arr = [];\n    }\n    \n    enqueue(x) {\n        this.arr.push(x);\n    }\n    \n    dequeue() {\n        if (this.arr.length === 0) return null;\n        return this.arr.shift();\n    }\n    \n    front() {\n        if (this.arr.length === 0) return null;\n        return this.arr[0];\n    }\n}"
      }
    },
    {
      title: "Reverse a String using Stack",
      difficulty: "easy",
      problemStatement: "Given a string, reverse it using a stack data structure.",
      examples: [
        {
          input: "\"hello\"",
          output: "\"olleh\"",
          explanation: "The string is reversed character by character."
        },
        {
          input: "\"world\"",
          output: "\"dlrow\"",
          explanation: "Each character is pushed to stack and then popped to reverse."
        }
      ],
      testCases: [
        { input: "\"hello\"", output: "\"olleh\"" },
        { input: "\"world\"", output: "\"dlrow\"" },
        { input: "\"a\"", output: "\"a\"" },
        { input: "\"\"", output: "\"\"" }
      ],
      conceptExplanation: "Push all characters of the string onto a stack. Then pop characters one by one to build the reversed string.",
      workedExample: "For \"hello\":\nPush 'h' -> stack: ['h']\nPush 'e' -> stack: ['h','e']\nPush 'l' -> stack: ['h','e','l']\nPush 'l' -> stack: ['h','e','l','l']\nPush 'o' -> stack: ['h','e','l','l','o']\nPop 'o' -> result: \"o\"\nPop 'l' -> result: \"ol\"\nPop 'l' -> result: \"oll\"\nPop 'e' -> result: \"olle\"\nPop 'h' -> result: \"olleh\"",
      initialCode: "string reverseString(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "string reverseString(string s) {\n    stack<char> st;\n    for (char c : s) {\n        st.push(c);\n    }\n    string result = \"\";\n    while (!st.empty()) {\n        result += st.top();\n        st.pop();\n    }\n    return result;\n}",
        c: "char* reverseString(char* s) {\n    int len = strlen(s);\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        stack[++top] = s[i];\n    }\n    for (int i = 0; i < len; i++) {\n        s[i] = stack[top--];\n    }\n    return s;\n}",
        python: "def reverseString(s):\n    stack = []\n    for char in s:\n        stack.append(char)\n    result = \"\"\n    while stack:\n        result += stack.pop()\n    return result",
        java: "public String reverseString(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        stack.push(c);\n    }\n    StringBuilder result = new StringBuilder();\n    while (!stack.isEmpty()) {\n        result.append(stack.pop());\n    }\n    return result.toString();\n}",
        javascript: "function reverseString(s) {\n    const stack = [];\n    for (let char of s) {\n        stack.push(char);\n    }\n    let result = \"\";\n    while (stack.length > 0) {\n        result += stack.pop();\n    }\n    return result;\n}"
      }
    },
    {
      title: "Balanced Parentheses",
      difficulty: "easy",
      problemStatement: "Given a string containing only parentheses '(', ')', determine if the parentheses are balanced.",
      examples: [
        {
          input: "\"(())\"",
          output: "true",
          explanation: "The parentheses are properly nested and balanced."
        },
        {
          input: "\"(()\"",
          output: "false",
          explanation: "There's an unmatched opening parenthesis."
        }
      ],
      testCases: [
        { input: "\"(())\"", output: "true" },
        { input: "\"(()\"", output: "false" },
        { input: "\"()()\"", output: "true" },
        { input: "\"))((", output: "false" }
      ],
      conceptExplanation: "Use a stack to track opening parentheses. For each closing parenthesis, check if there's a matching opening one on the stack.",
      workedExample: "For \"(())\":\n- '(': push, stack: ['(']\n- '(': push, stack: ['(','(']\n- ')': pop '(', stack: ['(']\n- ')': pop '(', stack: []\n- Stack empty, balanced",
      initialCode: "bool isBalanced(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool isBalanced(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') {\n            st.push(c);\n        } else if (c == ')') {\n            if (st.empty()) return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}",
        c: "bool isBalanced(char* s) {\n    int len = strlen(s);\n    char stack[10000];\n    int top = -1;\n    for (int i = 0; i < len; i++) {\n        if (s[i] == '(') {\n            stack[++top] = s[i];\n        } else if (s[i] == ')') {\n            if (top == -1) return false;\n            top--;\n        }\n    }\n    return top == -1;\n}",
        python: "def isBalanced(s):\n    stack = []\n    for char in s:\n        if char == '(':\n            stack.append(char)\n        elif char == ')':\n            if not stack:\n                return False\n            stack.pop()\n    return not stack",
        java: "public boolean isBalanced(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(') {\n            stack.push(c);\n        } else if (c == ')') {\n            if (stack.isEmpty()) return false;\n            stack.pop();\n        }\n    }\n    return stack.isEmpty();\n}",
        javascript: "function isBalanced(s) {\n    const stack = [];\n    for (let char of s) {\n        if (char === '(') {\n            stack.push(char);\n        } else if (char === ')') {\n            if (stack.length === 0) return false;\n            stack.pop();\n        }\n    }\n    return stack.length === 0;\n}"
      }
    },
    {
      title: "Next Greater Element",
      difficulty: "medium",
      problemStatement: "Given an array, find the next greater element for each element. The next greater element for an element x is the first greater element on the right side of x in the array. If no greater element exists, consider it as -1.",
      examples: [
        {
          input: "[4, 5, 2, 25]",
          output: "[5, 25, 25, -1]",
          explanation: "For 4, next greater is 5; for 5, next greater is 25; for 2, next greater is 25; for 25, no greater element."
        },
        {
          input: "[13, 7, 6, 12]",
          output: "[-1, 12, 12, -1]",
          explanation: "For 13, no greater element; for 7, next greater is 12; for 6, next greater is 12; for 12, no greater element."
        }
      ],
      testCases: [
        { input: "[4,5,2,25]", output: "[5,25,25,-1]" },
        { input: "[13,7,6,12]", output: "[-1,12,12,-1]" },
        { input: "[1,2,3,4]", output: "[2,3,4,-1]" },
        { input: "[4,3,2,1]", output: "[-1,-1,-1,-1]" }
      ],
      conceptExplanation: "Use a stack to keep track of elements for which we haven't found the next greater element yet. Iterate from right to left, for each element, pop elements from stack that are smaller or equal, then the top of stack is the next greater element.",
      workedExample: "For [4,5,2,25]:\nStart from right: 25, stack empty, result[3] = -1, push 25\nNext 2, 2 < 25, result[2] = 25, push 2\nNext 5, 5 > 2, pop 2, 5 < 25, result[1] = 25, push 5\nNext 4, 4 < 5, result[0] = 5, push 4\nFinal result: [5,25,25,-1]",
      initialCode: "vector<int> nextGreaterElement(vector<int>& nums) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> nextGreaterElement(vector<int>& nums) {\n    int n = nums.size();\n    vector<int> result(n, -1);\n    stack<int> st;\n    for (int i = n - 1; i >= 0; i--) {\n        while (!st.empty() && st.top() <= nums[i]) {\n            st.pop();\n        }\n        if (!st.empty()) {\n            result[i] = st.top();\n        }\n        st.push(nums[i]);\n    }\n    return result;\n}",
        c: "int* nextGreaterElement(int* nums, int numsSize) {\n    int* result = (int*)malloc(numsSize * sizeof(int));\n    for (int i = 0; i < numsSize; i++) result[i] = -1;\n    int stack[10000];\n    int top = -1;\n    for (int i = numsSize - 1; i >= 0; i--) {\n        while (top != -1 && stack[top] <= nums[i]) {\n            top--;\n        }\n        if (top != -1) {\n            result[i] = stack[top];\n        }\n        stack[++top] = nums[i];\n    }\n    return result;\n}",
        python: "def nextGreaterElement(nums):\n    n = len(nums)\n    result = [-1] * n\n    stack = []\n    for i in range(n - 1, -1, -1):\n        while stack and stack[-1] <= nums[i]:\n            stack.pop()\n        if stack:\n            result[i] = stack[-1]\n        stack.append(nums[i])\n    return result",
        java: "public int[] nextGreaterElement(int[] nums) {\n    int n = nums.length;\n    int[] result = new int[n];\n    Arrays.fill(result, -1);\n    Stack<Integer> stack = new Stack<>();\n    for (int i = n - 1; i >= 0; i--) {\n        while (!stack.isEmpty() && stack.peek() <= nums[i]) {\n            stack.pop();\n        }\n        if (!stack.isEmpty()) {\n            result[i] = stack.peek();\n        }\n        stack.push(nums[i]);\n    }\n    return result;\n}",
        javascript: "function nextGreaterElement(nums) {\n    const n = nums.length;\n    const result = new Array(n).fill(-1);\n    const stack = [];\n    for (let i = n - 1; i >= 0; i--) {\n        while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {\n            stack.pop();\n        }\n        if (stack.length > 0) {\n            result[i] = stack[stack.length - 1];\n        }\n        stack.push(nums[i]);\n    }\n    return result;\n}"
      }
    },
    {
      title: "Implement Stack using Queues",
      difficulty: "medium",
      problemStatement: "Implement a stack data structure using only queue data structures. The implemented stack should support push, pop, top, and empty operations.",
      examples: [
        {
          input: "push(1), push(2), top()",
          output: "2",
          explanation: "After pushing 1 and 2, the top element is 2."
        },
        {
          input: "push(1), pop(), top()",
          output: "Stack is empty",
          explanation: "After pushing 1 and popping it, the stack is empty."
        }
      ],
      testCases: [
        { input: "push(1);push(2);top()", output: "2" },
        { input: "push(1);pop();top()", output: "empty" },
        { input: "push(5);push(10);pop();top()", output: "5" }
      ],
      conceptExplanation: "Use two queues. For push, add to the non-empty queue or the first queue. For pop, move all elements except the last from one queue to the other, then dequeue the last element.",
      workedExample: "push(1): queue1 = [1]\npush(2): queue1 = [1,2]\ntop(): return queue1.back() = 2\npop(): move 1 to queue2, dequeue 2 from queue1, now queue2 = [1], queue1 empty\ntop(): return queue2.back() = 1",
      initialCode: "class MyStack {\n    // Implement using queues\n}",
      solutions: {
        cpp: "class MyStack {\nprivate:\n    queue<int> q1, q2;\npublic:\n    void push(int x) {\n        q2.push(x);\n        while (!q1.empty()) {\n            q2.push(q1.front());\n            q1.pop();\n        }\n        swap(q1, q2);\n    }\n    \n    int pop() {\n        if (q1.empty()) return -1;\n        int x = q1.front();\n        q1.pop();\n        return x;\n    }\n    \n    int top() {\n        if (q1.empty()) return -1;\n        return q1.front();\n    }\n    \n    bool empty() {\n        return q1.empty();\n    }\n};",
        c: "// Using two queues - simplified implementation\n// Note: C doesn't have built-in queues, using arrays\n#define MAX 1000\nint q1[MAX], q2[MAX];\nint front1 = -1, rear1 = -1, front2 = -1, rear2 = -1;\n\nvoid push(int x) {\n    // Add to q2\n    if (rear2 == MAX - 1) return;\n    if (front2 == -1) front2 = 0;\n    q2[++rear2] = x;\n    // Move all from q1 to q2\n    while (front1 != -1 && front1 <= rear1) {\n        q2[++rear2] = q1[front1++];\n    }\n    front1 = rear1 = -1;\n    // Swap\n    int* temp = q1; q1 = q2; q2 = temp;\n    int t = front1; front1 = front2; front2 = t;\n    t = rear1; rear1 = rear2; rear2 = t;\n}\n\nint pop() {\n    if (front1 == -1 || front1 > rear1) return -1;\n    return q1[front1++];\n}\n\nint top() {\n    if (front1 == -1 || front1 > rear1) return -1;\n    return q1[front1];\n}",
        python: "from collections import deque\n\nclass MyStack:\n    def __init__(self):\n        self.q1 = deque()\n        self.q2 = deque()\n    \n    def push(self, x):\n        self.q2.append(x)\n        while self.q1:\n            self.q2.append(self.q1.popleft())\n        self.q1, self.q2 = self.q2, self.q1\n    \n    def pop(self):\n        if not self.q1:\n            return None\n        return self.q1.popleft()\n    \n    def top(self):\n        if not self.q1:\n            return None\n        return self.q1[0]\n    \n    def empty(self):\n        return not self.q1",
        java: "class MyStack {\n    private Queue<Integer> q1;\n    private Queue<Integer> q2;\n    \n    public MyStack() {\n        q1 = new LinkedList<>();\n        q2 = new LinkedList<>();\n    }\n    \n    public void push(int x) {\n        q2.add(x);\n        while (!q1.isEmpty()) {\n            q2.add(q1.poll());\n        }\n        Queue<Integer> temp = q1;\n        q1 = q2;\n        q2 = temp;\n    }\n    \n    public int pop() {\n        if (q1.isEmpty()) return -1;\n        return q1.poll();\n    }\n    \n    public int top() {\n        if (q1.isEmpty()) return -1;\n        return q1.peek();\n    }\n    \n    public boolean empty() {\n        return q1.isEmpty();\n    }\n}",
        javascript: "class MyStack {\n    constructor() {\n        this.q1 = [];\n        this.q2 = [];\n    }\n    \n    push(x) {\n        this.q2.push(x);\n        while (this.q1.length > 0) {\n            this.q2.push(this.q1.shift());\n        }\n        [this.q1, this.q2] = [this.q2, this.q1];\n    }\n    \n    pop() {\n        if (this.q1.length === 0) return null;\n        return this.q1.shift();\n    }\n    \n    top() {\n        if (this.q1.length === 0) return null;\n        return this.q1[0];\n    }\n    \n    empty() {\n        return this.q1.length === 0;\n    }\n}"
      }
    },
    {
      title: "Implement Queue using Stacks",
      difficulty: "medium",
      problemStatement: "Implement a queue data structure using only stack data structures. The implemented queue should support push, pop, peek, and empty operations.",
      examples: [
        {
          input: "push(1), push(2), peek()",
          output: "1",
          explanation: "After pushing 1 and 2, the front element is 1."
        },
        {
          input: "push(1), pop(), peek()",
          output: "Queue is empty",
          explanation: "After pushing 1 and popping it, the queue is empty."
        }
      ],
      testCases: [
        { input: "push(1);push(2);peek()", output: "1" },
        { input: "push(1);pop();peek()", output: "empty" },
        { input: "push(5);push(10);pop();peek()", output: "10" }
      ],
      conceptExplanation: "Use two stacks. For push, add to stack1. For pop/peek, if stack2 is empty, transfer all elements from stack1 to stack2, then pop/peek from stack2.",
      workedExample: "push(1): stack1 = [1]\npush(2): stack1 = [1,2]\npeek(): transfer stack1 to stack2: stack2 = [2,1], return stack2.top() = 1\npop(): pop from stack2: return 1, stack2 = [2]\npeek(): return stack2.top() = 2",
      initialCode: "class MyQueue {\n    // Implement using stacks\n}",
      solutions: {
        cpp: "class MyQueue {\nprivate:\n    stack<int> s1, s2;\npublic:\n    void push(int x) {\n        s1.push(x);\n    }\n    \n    int pop() {\n        if (s2.empty()) {\n            while (!s1.empty()) {\n                s2.push(s1.top());\n                s1.pop();\n            }\n        }\n        if (s2.empty()) return -1;\n        int x = s2.top();\n        s2.pop();\n        return x;\n    }\n    \n    int peek() {\n        if (s2.empty()) {\n            while (!s1.empty()) {\n                s2.push(s1.top());\n                s1.pop();\n            }\n        }\n        if (s2.empty()) return -1;\n        return s2.top();\n    }\n    \n    bool empty() {\n        return s1.empty() && s2.empty();\n    }\n};",
        c: "// Using two stacks - simplified implementation\n#define MAX 1000\nint s1[MAX], s2[MAX];\nint top1 = -1, top2 = -1;\n\nvoid push(int x) {\n    s1[++top1] = x;\n}\n\nint pop() {\n    if (top2 == -1) {\n        while (top1 != -1) {\n            s2[++top2] = s1[top1--];\n        }\n    }\n    if (top2 == -1) return -1;\n    return s2[top2--];\n}\n\nint peek() {\n    if (top2 == -1) {\n        while (top1 != -1) {\n            s2[++top2] = s1[top1--];\n        }\n    }\n    if (top2 == -1) return -1;\n    return s2[top2];\n}\n\nint empty() {\n    return top1 == -1 && top2 == -1;\n}",
        python: "class MyQueue:\n    def __init__(self):\n        self.s1 = []\n        self.s2 = []\n    \n    def push(self, x):\n        self.s1.append(x)\n    \n    def pop(self):\n        if not self.s2:\n            while self.s1:\n                self.s2.append(self.s1.pop())\n        if not self.s2:\n            return None\n        return self.s2.pop()\n    \n    def peek(self):\n        if not self.s2:\n            while self.s1:\n                self.s2.append(self.s1.pop())\n        if not self.s2:\n            return None\n        return self.s2[-1]\n    \n    def empty(self):\n        return not self.s1 and not self.s2",
        java: "class MyQueue {\n    private Stack<Integer> s1;\n    private Stack<Integer> s2;\n    \n    public MyQueue() {\n        s1 = new Stack<>();\n        s2 = new Stack<>();\n    }\n    \n    public void push(int x) {\n        s1.push(x);\n    }\n    \n    public int pop() {\n        if (s2.isEmpty()) {\n            while (!s1.isEmpty()) {\n                s2.push(s1.pop());\n            }\n        }\n        if (s2.isEmpty()) return -1;\n        return s2.pop();\n    }\n    \n    public int peek() {\n        if (s2.isEmpty()) {\n            while (!s1.isEmpty()) {\n                s2.push(s1.pop());\n            }\n        }\n        if (s2.isEmpty()) return -1;\n        return s2.peek();\n    }\n    \n    public boolean empty() {\n        return s1.isEmpty() && s2.isEmpty();\n    }\n}",
        javascript: "class MyQueue {\n    constructor() {\n        this.s1 = [];\n        this.s2 = [];\n    }\n    \n    push(x) {\n        this.s1.push(x);\n    }\n    \n    pop() {\n        if (this.s2.length === 0) {\n            while (this.s1.length > 0) {\n                this.s2.push(this.s1.pop());\n            }\n        }\n        if (this.s2.length === 0) return null;\n        return this.s2.pop();\n    }\n    \n    peek() {\n        if (this.s2.length === 0) {\n            while (this.s1.length > 0) {\n                this.s2.push(this.s1.pop());\n            }\n        }\n        if (this.s2.length === 0) return null;\n        return this.s2[this.s2.length - 1];\n    }\n    \n    empty() {\n        return this.s1.length === 0 && this.s2.length === 0;\n    }\n}"
      }
    },
    {
      title: "Min Stack",
      difficulty: "medium",
      problemStatement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
      examples: [
        {
          input: "push(1), push(2), push(0), getMin()",
          output: "0",
          explanation: "After pushing 1, 2, and 0, the minimum element is 0."
        },
        {
          input: "push(1), push(2), pop(), getMin()",
          output: "1",
          explanation: "After pushing 1 and 2, popping 2, the minimum element is 1."
        }
      ],
      testCases: [
        { input: "push(1);push(2);push(0);getMin()", output: "0" },
        { input: "push(1);push(2);pop();getMin()", output: "1" },
        { input: "push(-1);push(-2);getMin()", output: "-2" }
      ],
      conceptExplanation: "Use two stacks: one for data, one for minimum values. When pushing, push to data stack and push min(current min, new value) to min stack.",
      workedExample: "push(1): data=[1], min=[1]\npush(2): data=[1,2], min=[1,1]\npush(0): data=[1,2,0], min=[1,1,0]\ngetMin(): return 0\npop(): data=[1,2], min=[1,1]\ngetMin(): return 1",
      initialCode: "class MinStack {\n    // Implement push, pop, top, getMin\n}",
      solutions: {
        cpp: "class MinStack {\nprivate:\n    stack<int> data, minStack;\npublic:\n    void push(int x) {\n        data.push(x);\n        if (minStack.empty() || x <= minStack.top()) {\n            minStack.push(x);\n        } else {\n            minStack.push(minStack.top());\n        }\n    }\n    \n    void pop() {\n        if (!data.empty()) {\n            data.pop();\n            minStack.pop();\n        }\n    }\n    \n    int top() {\n        if (data.empty()) return -1;\n        return data.top();\n    }\n    \n    int getMin() {\n        if (minStack.empty()) return -1;\n        return minStack.top();\n    }\n};",
        c: "#define MAX 1000\nint data[MAX], minStack[MAX];\nint topData = -1, topMin = -1;\n\nvoid push(int x) {\n    data[++topData] = x;\n    if (topMin == -1 || x <= minStack[topMin]) {\n        minStack[++topMin] = x;\n    } else {\n        minStack[++topMin] = minStack[topMin - 1];\n    }\n}\n\nvoid pop() {\n    if (topData != -1) {\n        topData--;\n        topMin--;\n    }\n}\n\nint top() {\n    if (topData == -1) return -1;\n    return data[topData];\n}\n\nint getMin() {\n    if (topMin == -1) return -1;\n    return minStack[topMin];\n}",
        python: "class MinStack:\n    def __init__(self):\n        self.data = []\n        self.minStack = []\n    \n    def push(self, x):\n        self.data.append(x)\n        if not self.minStack or x <= self.minStack[-1]:\n            self.minStack.append(x)\n        else:\n            self.minStack.append(self.minStack[-1])\n    \n    def pop(self):\n        if self.data:\n            self.data.pop()\n            self.minStack.pop()\n    \n    def top(self):\n        if not self.data:\n            return None\n        return self.data[-1]\n    \n    def getMin(self):\n        if not self.minStack:\n            return None\n        return self.minStack[-1]",
        java: "class MinStack {\n    private Stack<Integer> data;\n    private Stack<Integer> minStack;\n    \n    public MinStack() {\n        data = new Stack<>();\n        minStack = new Stack<>();\n    }\n    \n    public void push(int x) {\n        data.push(x);\n        if (minStack.isEmpty() || x <= minStack.peek()) {\n            minStack.push(x);\n        } else {\n            minStack.push(minStack.peek());\n        }\n    }\n    \n    public void pop() {\n        if (!data.isEmpty()) {\n            data.pop();\n            minStack.pop();\n        }\n    }\n    \n    public int top() {\n        if (data.isEmpty()) return -1;\n        return data.peek();\n    }\n    \n    public int getMin() {\n        if (minStack.isEmpty()) return -1;\n        return minStack.peek();\n    }\n}",
        javascript: "class MinStack {\n    constructor() {\n        this.data = [];\n        this.minStack = [];\n    }\n    \n    push(x) {\n        this.data.push(x);\n        if (this.minStack.length === 0 || x <= this.minStack[this.minStack.length - 1]) {\n            this.minStack.push(x);\n        } else {\n            this.minStack.push(this.minStack[this.minStack.length - 1]);\n        }\n    }\n    \n    pop() {\n        if (this.data.length > 0) {\n            this.data.pop();\n            this.minStack.pop();\n        }\n    }\n    \n    top() {\n        if (this.data.length === 0) return null;\n        return this.data[this.data.length - 1];\n    }\n    \n    getMin() {\n        if (this.minStack.length === 0) return null;\n        return this.minStack[this.minStack.length - 1];\n    }\n}"
      }
    },
    {
      title: "Evaluate Reverse Polish Notation",
      difficulty: "medium",
      problemStatement: "Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are +, -, *, /. Each operand may be an integer or another expression.",
      examples: [
        {
          input: "[\"2\", \"1\", \"+\", \"3\", \"*\"]",
          output: "9",
          explanation: "((2 + 1) * 3) = 9"
        },
        {
          input: "[\"4\", \"13\", \"5\", \"/\", \"+\"]",
          output: "6",
          explanation: "(4 + (13 / 5)) = 6"
        }
      ],
      testCases: [
        { input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]", output: "9" },
        { input: "[\"4\",\"13\",\"5\",\"/\",\"+\"]", output: "6" },
        { input: "[\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]", output: "22" }
      ],
      conceptExplanation: "Use a stack to store operands. When encountering an operator, pop two operands, apply the operation, and push the result back.",
      workedExample: "For [\"2\", \"1\", \"+\", \"3\", \"*\"]:\nPush 2: stack=[2]\nPush 1: stack=[2,1]\n+: pop 1,2, 2+1=3, push 3: stack=[3]\nPush 3: stack=[3,3]\n*: pop 3,3, 3*3=9, push 9: stack=[9]\nResult: 9",
      initialCode: "int evalRPN(vector<string>& tokens) {\n    // Your code here\n}",
      solutions: {
        cpp: "int evalRPN(vector<string>& tokens) {\n    stack<int> st;\n    for (string token : tokens) {\n        if (token == \"+\" || token == \"-\" || token == \"*\" || token == \"/\") {\n            int b = st.top(); st.pop();\n            int a = st.top(); st.pop();\n            if (token == \"+\") st.push(a + b);\n            else if (token == \"-\") st.push(a - b);\n            else if (token == \"*\") st.push(a * b);\n            else st.push(a / b);\n        } else {\n            st.push(stoi(token));\n        }\n    }\n    return st.top();\n}",
        c: "int evalRPN(char** tokens, int tokensSize) {\n    int stack[10000];\n    int top = -1;\n    for (int i = 0; i < tokensSize; i++) {\n        if (strcmp(tokens[i], \"+\") == 0 || strcmp(tokens[i], \"-\") == 0 || \n            strcmp(tokens[i], \"*\") == 0 || strcmp(tokens[i], \"/\") == 0) {\n            int b = stack[top--];\n            int a = stack[top--];\n            if (strcmp(tokens[i], \"+\") == 0) stack[++top] = a + b;\n            else if (strcmp(tokens[i], \"-\") == 0) stack[++top] = a - b;\n            else if (strcmp(tokens[i], \"*\") == 0) stack[++top] = a * b;\n            else stack[++top] = a / b;\n        } else {\n            stack[++top] = atoi(tokens[i]);\n        }\n    }\n    return stack[top];\n}",
        python: "def evalRPN(tokens):\n    stack = []\n    for token in tokens:\n        if token in ['+', '-', '*', '/']:\n            b = stack.pop()\n            a = stack.pop()\n            if token == '+':\n                stack.append(a + b)\n            elif token == '-':\n                stack.append(a - b)\n            elif token == '*':\n                stack.append(a * b)\n            else:\n                stack.append(int(a / b))\n        else:\n            stack.append(int(token))\n    return stack[0]",
        java: "public int evalRPN(String[] tokens) {\n    Stack<Integer> stack = new Stack<>();\n    for (String token : tokens) {\n        if (token.equals(\"+\") || token.equals(\"-\") || token.equals(\"*\") || token.equals(\"/\")) {\n            int b = stack.pop();\n            int a = stack.pop();\n            switch (token) {\n                case \"+\": stack.push(a + b); break;\n                case \"-\": stack.push(a - b); break;\n                case \"*\": stack.push(a * b); break;\n                case \"/\": stack.push(a / b); break;\n            }\n        } else {\n            stack.push(Integer.parseInt(token));\n        }\n    }\n    return stack.peek();\n}",
        javascript: "function evalRPN(tokens) {\n    const stack = [];\n    for (let token of tokens) {\n        if (token === '+' || token === '-' || token === '*' || token === '/') {\n            const b = stack.pop();\n            const a = stack.pop();\n            switch (token) {\n                case '+': stack.push(a + b); break;\n                case '-': stack.push(a - b); break;\n                case '*': stack.push(a * b); break;\n                case '/': stack.push(Math.trunc(a / b)); break;\n            }\n        } else {\n            stack.push(parseInt(token));\n        }\n    }\n    return stack[0];\n}"
      }
    },
    {
      title: "Largest Rectangle in Histogram",
      difficulty: "hard",
      problemStatement: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      examples: [
        {
          input: "[2,1,5,6,2,3]",
          output: "10",
          explanation: "The largest rectangle has height 5 and width 2, area = 10."
        },
        {
          input: "[2,4]",
          output: "4",
          explanation: "The largest rectangle has height 2 and width 2, area = 4."
        }
      ],
      testCases: [
        { input: "[2,1,5,6,2,3]", output: "10" },
        { input: "[2,4]", output: "4" },
        { input: "[1,1]", output: "2" },
        { input: "[0,1,0,1]", output: "1" }
      ],
      conceptExplanation: "Use a stack to keep indices of bars. For each bar, while stack is not empty and current bar is smaller than bar at stack top, calculate area with height of popped bar and width as current index minus stack top minus 1.",
      workedExample: "For [2,1,5,6,2,3]:\nProcess index 0 (2): stack=[0]\nIndex 1 (1): 1 < 2, pop 0, area = 2*1 = 2, stack=[]\nPush 1: stack=[1]\nIndex 2 (5): push 2: stack=[1,2]\nIndex 3 (6): push 3: stack=[1,2,3]\nIndex 4 (2): 2 < 6, pop 3, area = 6*1 = 6\n2 < 5, pop 2, area = 5*2 = 10\n2 > 1, push 4: stack=[1,4]\nIndex 5 (3): push 5: stack=[1,4,5]\nEnd: pop 5, area = 3*1 = 3\nPop 4, area = 2*4 = 8\nPop 1, area = 1*6 = 6\nMax area = 10",
      initialCode: "int largestRectangleArea(vector<int>& heights) {\n    // Your code here\n}",
      solutions: {
        cpp: "int largestRectangleArea(vector<int>& heights) {\n    int n = heights.size();\n    stack<int> st;\n    int maxArea = 0;\n    for (int i = 0; i <= n; i++) {\n        while (!st.empty() && (i == n || heights[st.top()] >= heights[i])) {\n            int h = heights[st.top()];\n            st.pop();\n            int w = st.empty() ? i : i - st.top() - 1;\n            maxArea = max(maxArea, h * w);\n        }\n        st.push(i);\n    }\n    return maxArea;\n}",
        c: "int largestRectangleArea(int* heights, int heightsSize) {\n    int stack[100000];\n    int top = -1;\n    int maxArea = 0;\n    for (int i = 0; i <= heightsSize; i++) {\n        while (top != -1 && (i == heightsSize || heights[stack[top]] >= heights[i])) {\n            int h = heights[stack[top--]];\n            int w = top == -1 ? i : i - stack[top] - 1;\n            if (h * w > maxArea) maxArea = h * w;\n        }\n        stack[++top] = i;\n    }\n    return maxArea;\n}",
        python: "def largestRectangleArea(heights):\n    n = len(heights)\n    stack = []\n    maxArea = 0\n    for i in range(n + 1):\n        while stack and (i == n or heights[stack[-1]] >= heights[i]):\n            h = heights[stack.pop()]\n            w = i if not stack else i - stack[-1] - 1\n            maxArea = max(maxArea, h * w)\n        stack.append(i)\n    return maxArea",
        java: "public int largestRectangleArea(int[] heights) {\n    int n = heights.length;\n    Stack<Integer> stack = new Stack<>();\n    int maxArea = 0;\n    for (int i = 0; i <= n; i++) {\n        while (!stack.isEmpty() && (i == n || heights[stack.peek()] >= heights[i])) {\n            int h = heights[stack.pop()];\n            int w = stack.isEmpty() ? i : i - stack.peek() - 1;\n            maxArea = Math.max(maxArea, h * w);\n        }\n        stack.push(i);\n    }\n    return maxArea;\n}",
        javascript: "function largestRectangleArea(heights) {\n    const n = heights.length;\n    const stack = [];\n    let maxArea = 0;\n    for (let i = 0; i <= n; i++) {\n        while (stack.length > 0 && (i === n || heights[stack[stack.length - 1]] >= heights[i])) {\n            const h = heights[stack.pop()];\n            const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n            maxArea = Math.max(maxArea, h * w);\n        }\n        stack.push(i);\n    }\n    return maxArea;\n}"
      }
    },
    {
      title: "Sliding Window Maximum",
      difficulty: "hard",
      problemStatement: "Given an array nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.",
      examples: [
        {
          input: "nums = [1,3,-1,-3,5,3,6,7], k = 3",
          output: "[3,3,5,5,6,7]",
          explanation: "Window position -> Max\n[1 3 -1] -3 5 3 6 7 -> 3\n1 [3 -1 -3] 5 3 6 7 -> 3\n1 3 [-1 -3 5] 3 6 7 -> 5\n1 3 -1 [-3 5 3] 6 7 -> 5\n1 3 -1 -3 [5 3 6] 7 -> 6\n1 3 -1 -3 5 [3 6 7] -> 7"
        }
      ],
      testCases: [
        { input: "nums=[1,3,-1,-3,5,3,6,7], k=3", output: "[3,3,5,5,6,7]" },
        { input: "nums=[1], k=1", output: "[1]" },
        { input: "nums=[1,-1], k=1", output: "[1,-1]" },
        { input: "nums=[9,11], k=2", output: "[11]" }
      ],
      conceptExplanation: "Use a deque to maintain indices of elements in decreasing order. For each window, remove elements outside window and smaller elements from back, then front is the maximum.",
      workedExample: "For [1,3,-1,-3,5,3,6,7], k=3:\nInitialize deque empty\ni=0: add 0, deque=[0]\ni=1: 3 > 1, add 1, deque=[1]\ni=2: -1 < 3, add 2, deque=[1,2], max=3\ni=3: -3 < -1, add 3, deque=[1,2,3], remove 1 (out of window), max=3\ni=4: 5 > -3, remove 3, 5 > -1, remove 2, 5 > 3, remove 1, add 4, deque=[4], max=5\ni=5: 3 < 5, add 5, deque=[4,5], max=5\ni=6: 6 > 3, remove 5, 6 > 5, remove 4, add 6, deque=[6], max=6\ni=7: 7 > 6, remove 6, add 7, deque=[7], max=7\nResult: [3,3,5,5,6,7]",
      initialCode: "vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    vector<int> result;\n    deque<int> dq;\n    for (int i = 0; i < nums.size(); i++) {\n        while (!dq.empty() && nums[dq.back()] <= nums[i]) {\n            dq.pop_back();\n        }\n        dq.push_back(i);\n        if (dq.front() == i - k) {\n            dq.pop_front();\n        }\n        if (i >= k - 1) {\n            result.push_back(nums[dq.front()]);\n        }\n    }\n    return result;\n}",
        c: "int* maxSlidingWindow(int* nums, int numsSize, int k, int* returnSize) {\n    int* result = (int*)malloc((numsSize - k + 1) * sizeof(int));\n    *returnSize = numsSize - k + 1;\n    int deque[100000];\n    int front = 0, rear = -1;\n    for (int i = 0; i < numsSize; i++) {\n        while (front <= rear && nums[deque[rear]] <= nums[i]) {\n            rear--;\n        }\n        deque[++rear] = i;\n        if (deque[front] == i - k) {\n            front++;\n        }\n        if (i >= k - 1) {\n            result[i - k + 1] = nums[deque[front]];\n        }\n    }\n    return result;\n}",
        python: "from collections import deque\n\ndef maxSlidingWindow(nums, k):\n    result = []\n    dq = deque()\n    for i in range(len(nums)):\n        while dq and nums[dq[-1]] <= nums[i]:\n            dq.pop()\n        dq.append(i)\n        if dq[0] == i - k:\n            dq.popleft()\n        if i >= k - 1:\n            result.append(nums[dq[0]])\n    return result",
        java: "public int[] maxSlidingWindow(int[] nums, int k) {\n    int n = nums.length;\n    int[] result = new int[n - k + 1];\n    Deque<Integer> dq = new LinkedList<>();\n    for (int i = 0; i < n; i++) {\n        while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) {\n            dq.pollLast();\n        }\n        dq.offerLast(i);\n        if (dq.peekFirst() == i - k) {\n            dq.pollFirst();\n        }\n        if (i >= k - 1) {\n            result[i - k + 1] = nums[dq.peekFirst()];\n        }\n    }\n    return result;\n}",
        javascript: "function maxSlidingWindow(nums, k) {\n    const result = [];\n    const dq = [];\n    for (let i = 0; i < nums.length; i++) {\n        while (dq.length > 0 && nums[dq[dq.length - 1]] <= nums[i]) {\n            dq.pop();\n        }\n        dq.push(i);\n        if (dq[0] === i - k) {\n            dq.shift();\n        }\n        if (i >= k - 1) {\n            result.push(nums[dq[0]]);\n        }\n    }\n    return result;\n}"
      }
    },
    {
      title: "Trapping Rain Water",
      difficulty: "hard",
      problemStatement: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      examples: [
        {
          input: "[0,1,0,2,1,0,1,3,2,1,2,1]",
          output: "6",
          explanation: "The elevation map [0,1,0,2,1,0,1,3,2,1,2,1] can trap 6 units of water."
        },
        {
          input: "[4,2,0,3,2,5]",
          output: "9",
          explanation: "The elevation map can trap 9 units of water."
        }
      ],
      testCases: [
        { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" },
        { input: "[4,2,0,3,2,5]", output: "9" },
        { input: "[0,1,0]", output: "0" },
        { input: "[3,0,3]", output: "3" }
      ],
      conceptExplanation: "Use two pointers or stack to find trapped water. For each bar, water trapped = min(max_left, max_right) - height. Use stack to keep indices of bars in increasing order.",
      workedExample: "For [0,1,0,2,1,0,1,3,2,1,2,1]:\nUse stack approach: stack keeps indices in increasing height order\nProcess each bar, when current height > stack top height, calculate trapped water\nFinal result: 6 units",
      initialCode: "int trap(vector<int>& height) {\n    // Your code here\n}",
      solutions: {
        cpp: "int trap(vector<int>& height) {\n    int n = height.size();\n    stack<int> st;\n    int water = 0;\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && height[i] > height[st.top()]) {\n            int top = st.top(); st.pop();\n            if (st.empty()) break;\n            int distance = i - st.top() - 1;\n            int bounded_height = min(height[i], height[st.top()]) - height[top];\n            water += distance * bounded_height;\n        }\n        st.push(i);\n    }\n    return water;\n}",
        c: "int trap(int* height, int heightSize) {\n    int stack[100000];\n    int top = -1;\n    int water = 0;\n    for (int i = 0; i < heightSize; i++) {\n        while (top != -1 && height[i] > height[stack[top]]) {\n            int top_idx = stack[top--];\n            if (top == -1) break;\n            int distance = i - stack[top] - 1;\n            int bounded_height = (height[i] < height[stack[top]] ? height[i] : height[stack[top]]) - height[top_idx];\n            water += distance * bounded_height;\n        }\n        stack[++top] = i;\n    }\n    return water;\n}",
        python: "def trap(height):\n    n = len(height)\n    stack = []\n    water = 0\n    for i in range(n):\n        while stack and height[i] > height[stack[-1]]:\n            top = stack.pop()\n            if not stack:\n                break\n            distance = i - stack[-1] - 1\n            bounded_height = min(height[i], height[stack[-1]]) - height[top]\n            water += distance * bounded_height\n        stack.append(i)\n    return water",
        java: "public int trap(int[] height) {\n    int n = height.length;\n    Stack<Integer> stack = new Stack<>();\n    int water = 0;\n    for (int i = 0; i < n; i++) {\n        while (!stack.isEmpty() && height[i] > height[stack.peek()]) {\n            int top = stack.pop();\n            if (stack.isEmpty()) break;\n            int distance = i - stack.peek() - 1;\n            int bounded_height = Math.min(height[i], height[stack.peek()]) - height[top];\n            water += distance * bounded_height;\n        }\n        stack.push(i);\n    }\n    return water;\n}",
        javascript: "function trap(height) {\n    const n = height.length;\n    const stack = [];\n    let water = 0;\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {\n            const top = stack.pop();\n            if (stack.length === 0) break;\n            const distance = i - stack[stack.length - 1] - 1;\n            const bounded_height = Math.min(height[i], height[stack[stack.length - 1]]) - height[top];\n            water += distance * bounded_height;\n        }\n        stack.push(i);\n    }\n    return water;\n}"
      }
    },
    {
      title: "Daily Temperatures",
      difficulty: "medium",
      problemStatement: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
      examples: [
        {
          input: "[73,74,75,71,69,72,76,73]",
          output: "[1,1,4,2,1,1,0,0]",
          explanation: "For day 0 (73), next warmer is day 1 (74), so 1 day. For day 1 (74), next warmer is day 2 (75), so 1 day. For day 2 (75), next warmer is day 6 (76), so 4 days. And so on."
        }
      ],
      testCases: [
        { input: "[73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]" },
        { input: "[30,40,50,60]", output: "[1,1,1,0]" },
        { input: "[30,60,90]", output: "[1,1,0]" }
      ],
      conceptExplanation: "Use a stack to keep indices of temperatures that haven't found warmer days yet. For each temperature, while stack is not empty and current temp > temp at stack top, calculate days difference and pop.",
      workedExample: "For [73,74,75,71,69,72,76,73]:\nstack=[]\ni=0 (73): push 0, stack=[0]\ni=1 (74): 74 > 73, pop 0, result[0]=1-0=1, push 1, stack=[1]\ni=2 (75): 75 > 74, pop 1, result[1]=2-1=1, push 2, stack=[2]\ni=3 (71): 71 < 75, push 3, stack=[2,3]\ni=4 (69): 69 < 71, push 4, stack=[2,3,4]\ni=5 (72): 72 > 69, pop 4, result[4]=5-4=1\n72 > 71, pop 3, result[3]=5-3=2\n72 < 75, push 5, stack=[2,5]\ni=6 (76): 76 > 72, pop 5, result[5]=6-5=1\n76 > 75, pop 2, result[2]=6-2=4, push 6, stack=[6]\ni=7 (73): 73 < 76, push 7, stack=[6,7]\nResult: [1,1,4,2,1,1,0,0]",
      initialCode: "vector<int> dailyTemperatures(vector<int>& temperatures) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> dailyTemperatures(vector<int>& temperatures) {\n    int n = temperatures.size();\n    vector<int> result(n, 0);\n    stack<int> st;\n    for (int i = 0; i < n; i++) {\n        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n            int idx = st.top(); st.pop();\n            result[idx] = i - idx;\n        }\n        st.push(i);\n    }\n    return result;\n}",
        c: "int* dailyTemperatures(int* temperatures, int temperaturesSize, int* returnSize) {\n    int* result = (int*)calloc(temperaturesSize, sizeof(int));\n    *returnSize = temperaturesSize;\n    int stack[100000];\n    int top = -1;\n    for (int i = 0; i < temperaturesSize; i++) {\n        while (top != -1 && temperatures[i] > temperatures[stack[top]]) {\n            int idx = stack[top--];\n            result[idx] = i - idx;\n        }\n        stack[++top] = i;\n    }\n    return result;\n}",
        python: "def dailyTemperatures(temperatures):\n    n = len(temperatures)\n    result = [0] * n\n    stack = []\n    for i in range(n):\n        while stack and temperatures[i] > temperatures[stack[-1]]:\n            idx = stack.pop()\n            result[idx] = i - idx\n        stack.append(i)\n    return result",
        java: "public int[] dailyTemperatures(int[] temperatures) {\n    int n = temperatures.length;\n    int[] result = new int[n];\n    Stack<Integer> stack = new Stack<>();\n    for (int i = 0; i < n; i++) {\n        while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n            int idx = stack.pop();\n            result[idx] = i - idx;\n        }\n        stack.push(i);\n    }\n    return result;\n}",
        javascript: "function dailyTemperatures(temperatures) {\n    const n = temperatures.length;\n    const result = new Array(n).fill(0);\n    const stack = [];\n    for (let i = 0; i < n; i++) {\n        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const idx = stack.pop();\n            result[idx] = i - idx;\n        }\n        stack.push(i);\n    }\n    return result;\n}"
      }
    },
    {
      title: "Longest Valid Parentheses",
      difficulty: "hard",
      problemStatement: "Given a string containing just the characters '(' and ')', find the length of the longest valid (well-formed) parentheses substring.",
      examples: [
        {
          input: "\"(()\"",
          output: "2",
          explanation: "The longest valid parentheses substring is \"()\"."
        },
        {
          input: "\")()())\"",
          output: "4",
          explanation: "The longest valid parentheses substring is \"()()\"."
        }
      ],
      testCases: [
        { input: "\"(()\"", output: "2" },
        { input: "\")()())\"", output: "4" },
        { input: "\"()(()\"", output: "2" },
        { input: "\"()\"", output: "2" }
      ],
      conceptExplanation: "Use a stack to keep track of indices of unmatched opening parentheses. Also track the start of valid substring. When encountering closing parenthesis, if stack has matching opening, calculate length.",
      workedExample: "For \"(()\":\nstack=[], start=0\n'(': push 0, stack=[0]\n'(': push 1, stack=[0,1]\n')': pop 1, stack=[0], length=2-0=2\nResult: 2\nFor \")()())\":\n')': stack=[], start=1\n'(': push 1, stack=[1]\n')': pop 1, stack=[], length=3-1=2\n'(': push 3, stack=[3]\n')': pop 3, stack=[], length=5-3=2\n')': stack=[], start=6\nMax length: 4 (from positions 1-4: ()())",
      initialCode: "int longestValidParentheses(string s) {\n    // Your code here\n}",
      solutions: {
        cpp: "int longestValidParentheses(string s) {\n    int n = s.length();\n    stack<int> st;\n    int maxLen = 0;\n    st.push(-1);\n    for (int i = 0; i < n; i++) {\n        if (s[i] == '(') {\n            st.push(i);\n        } else {\n            st.pop();\n            if (st.empty()) {\n                st.push(i);\n            } else {\n                maxLen = max(maxLen, i - st.top());\n            }\n        }\n    }\n    return maxLen;\n}",
        c: "int longestValidParentheses(char* s) {\n    int n = strlen(s);\n    int stack[100000];\n    int top = -1;\n    stack[++top] = -1;\n    int maxLen = 0;\n    for (int i = 0; i < n; i++) {\n        if (s[i] == '(') {\n            stack[++top] = i;\n        } else {\n            top--;\n            if (top == -1) {\n                stack[++top] = i;\n            } else {\n                if (i - stack[top] > maxLen) maxLen = i - stack[top];\n            }\n        }\n    }\n    return maxLen;\n}",
        python: "def longestValidParentheses(s):\n    n = len(s)\n    stack = [-1]\n    maxLen = 0\n    for i in range(n):\n        if s[i] == '(':\n            stack.append(i)\n        else:\n            stack.pop()\n            if not stack:\n                stack.append(i)\n            else:\n                maxLen = max(maxLen, i - stack[-1])\n    return maxLen",
        java: "public int longestValidParentheses(String s) {\n    int n = s.length();\n    Stack<Integer> stack = new Stack<>();\n    stack.push(-1);\n    int maxLen = 0;\n    for (int i = 0; i < n; i++) {\n        if (s.charAt(i) == '(') {\n            stack.push(i);\n        } else {\n            stack.pop();\n            if (stack.isEmpty()) {\n                stack.push(i);\n            } else {\n                maxLen = Math.max(maxLen, i - stack.peek());\n            }\n        }\n    }\n    return maxLen;\n}",
        javascript: "function longestValidParentheses(s) {\n    const n = s.length;\n    const stack = [-1];\n    let maxLen = 0;\n    for (let i = 0; i < n; i++) {\n        if (s[i] === '(') {\n            stack.push(i);\n        } else {\n            stack.pop();\n            if (stack.length === 0) {\n                stack.push(i);\n            } else {\n                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);\n            }\n        }\n    }\n    return maxLen;\n}"
      }
    }
  ]
};

async function main() {
  try {
    console.log("Clearing existing data...");
    await db.delete(codeSnippets);
    await db.delete(topicExamples);
    await db.delete(problems);
    await db.delete(topics);
    console.log("Ingesting Stack and Queues topic and problems...");

    // Insert topic
    const topicInsert = await db.insert(topics).values({
      title: stackQueuesData.topic.title,
      slug: stackQueuesData.topic.slug,
      description: stackQueuesData.topic.description,
      order: stackQueuesData.topic.order,
    }).returning({ id: topics.id });

    const topicId = topicInsert[0].id;

    // Insert topic examples
    for (const [lang, code] of Object.entries(stackQueuesData.topic.codeExamples)) {
      await db.insert(topicExamples).values({
        topicSlug: stackQueuesData.topic.slug,
        language: lang,
        code: code as string,
      });
    }

    // For each problem
    for (const prob of stackQueuesData.problems) {
      const problemInsert = await db.insert(problems).values({
        topicId,
        title: prob.title,
        difficulty: prob.difficulty,
        description: prob.problemStatement,
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

    console.log('Stack and Queues curriculum data inserted successfully');
  } catch (error) {
    console.error('Error inserting data:', error);
  }
}

main();