import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const arraysData = {
  topic: {
    title: "Arrays",
    slug: "arrays",
    description: "Arrays are fundamental data structures that store elements of the same type in contiguous memory locations. They provide efficient access to elements using indices and are the building blocks for many algorithms and data structures.",
    order: 1,
    explanation: "Arrays are collections of items stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easier to calculate the position of each element by simply adding an offset to a base value, i.e., the memory location of the first element of the array (generally denoted by the name of the array). The operations on arrays include traversal, insertion, deletion, searching, and sorting. Common problems involve finding maximum/minimum elements, sorting arrays, searching for elements, handling subarrays, and dealing with multiple pointers or sliding windows. Understanding arrays is crucial as they form the basis for more complex data structures like stacks, queues, and matrices.",
    codeExamples: {
      cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    cout << \"First element: \" << arr[0] << endl;\n    cout << \"Array size: \" << sizeof(arr)/sizeof(arr[0]) << endl;\n    return 0;\n}",
      c: "#include <stdio.h>\n\nint main() {\n    int arr[] = {1, 2, 3, 4, 5};\n    printf(\"First element: %d\\n\", arr[0]);\n    printf(\"Array size: %lu\\n\", sizeof(arr)/sizeof(arr[0]));\n    return 0;\n}",
      python: "arr = [1, 2, 3, 4, 5]\nprint(\"First element:\", arr[0])\nprint(\"Array length:\", len(arr))",
      java: "public class Main {\n    public static void main(String[] args) {\n        int[] arr = {1, 2, 3, 4, 5};\n        System.out.println(\"First element: \" + arr[0]);\n        System.out.println(\"Array length: \" + arr.length);\n    }\n}",
      javascript: "let arr = [1, 2, 3, 4, 5];\nconsole.log(\"First element:\", arr[0]);\nconsole.log(\"Array length:\", arr.length);"
    }
  },
  problems: [
    {
      title: "Largest Element in Array",
      difficulty: "easy",
      problemStatement: "Given an array A[] of size n. The task is to find the largest element in it.",
      examples: [
        {
          input: "n = 5\nA[] = {1, 8, 7, 56, 90}",
          output: "90",
          explanation: "The largest element of given array is 90"
        }
      ],
      testCases: [
        { input: "5\n1 8 7 56 90", output: "90" },
        { input: "3\n-1 -2 -3", output: "-1" },
        { input: "1\n42", output: "42" }
      ],
      conceptExplanation: "To find the largest element, initialize a variable with the first element and iterate through the array, updating the variable whenever a larger element is found.",
      workedExample: "Initialize max = arr[0] = 1\nCheck arr[1] = 8 > 1, so max = 8\nCheck arr[2] = 7 < 8, no change\nCheck arr[3] = 56 > 8, max = 56\nCheck arr[4] = 90 > 56, max = 90\nFinal max = 90",
      initialCode: "int largest(int arr[], int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int largest(int arr[], int n) {\n    int ans = arr[0];\n    for (int i = 1; i < n; i++) {\n        if (arr[i] > ans)\n            ans = arr[i];\n    }\n    return ans;\n}",
        c: "int largest(int arr[], int n) {\n    int ans = arr[0];\n    for(int i = 1; i < n; i++) {\n        if(arr[i] > ans) ans = arr[i];\n    }\n    return ans;\n}",
        python: "def largest(arr):\n    ans = arr[0]\n    for i in range(1, len(arr)):\n        if arr[i] > ans:\n            ans = arr[i]\n    return ans",
        java: "public int largest(int[] arr) {\n    int ans = arr[0];\n    for(int i = 1; i < arr.length; i++) {\n        if(arr[i] > ans) ans = arr[i];\n    }\n    return ans;\n}",
        javascript: "function largest(arr) {\n    let ans = arr[0];\n    for(let i = 1; i < arr.length; i++) {\n        if(arr[i] > ans) ans = arr[i];\n    }\n    return ans;\n}"
      }
    },
    {
      title: "Second Largest Element in Array",
      difficulty: "easy",
      problemStatement: "Given an array of integers, find the second largest element in the array.",
      examples: [
        {
          input: "n = 5\nA[] = {12, 35, 1, 10, 34}",
          output: "34",
          explanation: "The largest is 35, second largest is 34"
        }
      ],
      testCases: [
        { input: "5\n12 35 1 10 34", output: "34" },
        { input: "3\n10 10 10", output: "-1" }
      ],
      conceptExplanation: "Keep track of the largest and second largest elements while iterating through the array.",
      workedExample: "Initialize largest = -INF, second = -INF\nFor 12: largest=12, second=-INF\nFor 35: largest=35, second=12\nFor 1: no change\nFor 10: no change\nFor 34: second=34\nFinal second=34",
      initialCode: "int secondLargest(int arr[], int n) {\n    // Your code here\n}",
      solutions: {
        cpp: "int secondLargest(int arr[], int n) {\n    int largest = INT_MIN, second = INT_MIN;\n    for(int i = 0; i < n; i++) {\n        if(arr[i] > largest) {\n            second = largest;\n            largest = arr[i];\n        } else if(arr[i] > second && arr[i] != largest) {\n            second = arr[i];\n        }\n    }\n    return second == INT_MIN ? -1 : second;\n}",
        c: "int secondLargest(int arr[], int n) {\n    int largest = INT_MIN, second = INT_MIN;\n    for(int i = 0; i < n; i++) {\n        if(arr[i] > largest) {\n            second = largest;\n            largest = arr[i];\n        } else if(arr[i] > second && arr[i] != largest) {\n            second = arr[i];\n        }\n    }\n    return second == INT_MIN ? -1 : second;\n}",
        python: "def secondLargest(arr):\n    largest = float('-inf')\n    second = float('-inf')\n    for num in arr:\n        if num > largest:\n            second = largest\n            largest = num\n        elif num > second and num != largest:\n            second = num\n    return second if second != float('-inf') else -1",
        java: "public int secondLargest(int[] arr) {\n    int largest = Integer.MIN_VALUE, second = Integer.MIN_VALUE;\n    for(int num : arr) {\n        if(num > largest) {\n            second = largest;\n            largest = num;\n        } else if(num > second && num != largest) {\n            second = num;\n        }\n    }\n    return second == Integer.MIN_VALUE ? -1 : second;\n}",
        javascript: "function secondLargest(arr) {\n    let largest = -Infinity, second = -Infinity;\n    for(let num of arr) {\n        if(num > largest) {\n            second = largest;\n            largest = num;\n        } else if(num > second && num !== largest) {\n            second = num;\n        }\n    }\n    return second === -Infinity ? -1 : second;\n}"
      }
    }
  ]
};

async function ingestArrays() {
  console.log("Clearing existing data...");
  await db.delete(codeSnippets);
  await db.delete(topicExamples);
  await db.delete(problems);
  await db.delete(topics);
  console.log("Ingesting Arrays topic and problems...");

  // Insert topic
  const topicInsert = await db.insert(topics).values({
    title: arraysData.topic.title,
    slug: arraysData.topic.slug,
    description: arraysData.topic.description,
    order: arraysData.topic.order,
  }).returning({ id: topics.id });

  const topicId = topicInsert[0].id;

  // Insert topic examples
  for (const [lang, code] of Object.entries(arraysData.topic.codeExamples)) {
    await db.insert(topicExamples).values({
      topicSlug: arraysData.topic.slug,
      language: lang,
      code: code as string,
    });
  }

  // For each problem
  for (const prob of arraysData.problems) {
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

  console.log("Arrays ingested successfully!");
}

ingestArrays().catch(console.error);