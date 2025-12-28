import "dotenv/config";
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const data = {
  topic: {
    title: "Binary Search",
    slug: "binary-search",
    description: "Binary search is an efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item, until you've narrowed down the possible locations to just one.",
    order: 2,
    explanation: "Binary search is a search algorithm that finds the position of a target value within a sorted array. It compares the target value to the middle element of the array; if they are unequal, the half in which the target cannot lie is eliminated and the search continues on the remaining half until the target is found or the search space is empty. This method is much faster than linear search, with a time complexity of O(log n) compared to O(n) for linear search. Binary search has numerous applications in computer science, including searching in databases, finding square roots, optimizing resource allocation problems, and solving problems involving sorted arrays or monotonic functions. It can be applied to 1D arrays for finding elements, bounds, and peaks; to 2D matrices for searching in sorted matrices; and to search spaces for optimization problems like finding minimums or maximums in monotonic functions.",
    codeExamples: {
      cpp: "#include <bits/stdc++.h>\nusing namespace std;\n\nint binarySearch(vector<int>& nums, int target) {\n    int low = 0, high = nums.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] > target) high = mid - 1;\n        else low = mid + 1;\n    }\n    return -1;\n}\n\nint main() {\n    vector<int> nums = {-1, 0, 3, 5, 9, 12};\n    cout << binarySearch(nums, 9) << endl; // Output: 4\n    return 0;\n}",
      c: "#include <stdio.h>\n\nint binarySearch(int nums[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] > target) high = mid - 1;\n        else low = mid + 1;\n    }\n    return -1;\n}\n\nint main() {\n    int nums[] = {-1, 0, 3, 5, 9, 12};\n    int n = sizeof(nums)/sizeof(nums[0]);\n    printf(\"%d\\n\", binarySearch(nums, n, 9)); // Output: 4\n    return 0;\n}",
      python: "def binarySearch(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] > target:\n            high = mid - 1\n        else:\n            low = mid + 1\n    return -1\n\n# Example\nnums = [-1, 0, 3, 5, 9, 12]\nprint(binarySearch(nums, 9))  # Output: 4",
      java: "public class BinarySearch {\n    public static int binarySearch(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            else if (nums[mid] > target) high = mid - 1;\n            else low = mid + 1;\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {-1, 0, 3, 5, 9, 12};\n        System.out.println(binarySearch(nums, 9)); // Output: 4\n    }\n}",
      javascript: "function binarySearch(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] > target) high = mid - 1;\n        else low = mid + 1;\n    }\n    return -1;\n}\n\n// Example\nlet nums = [-1, 0, 3, 5, 9, 12];\nconsole.log(binarySearch(nums, 9)); // Output: 4"
    }
  },
  problems: [
    {
      title: "Lower Bound",
      difficulty: "Easy",
      problemStatement: "Given a sorted array arr[] of size N without duplicates, and given a value x. Floor of x is defined as the largest element K in arr[] such that K is smaller than or equal to x. Find the index of K (0-based indexing).",
      examples: [
        {
          input: "N = 7, x = 0\narr[] = {1,2,8,10,11,12,19}",
          output: "-1"
        },
        {
          input: "N = 7, x = 5\narr[] = {1,2,8,10,11,12,19}",
          output: "1"
        }
      ],
      testCases: [
        { input: "7 0\n1 2 8 10 11 12 19", output: "-1" },
        { input: "7 5\n1 2 8 10 11 12 19", output: "1" },
        { input: "5 3\n1 2 3 4 5", output: "2" },
        { input: "4 10\n1 3 5 7", output: "3" },
        { input: "3 0\n2 4 6", output: "-1" },
        { input: "6 8\n1 2 4 5 6 8", output: "5" },
        { input: "1 5\n5", output: "0" },
        { input: "2 1\n1 2", output: "0" }
      ],
      conceptExplanation: "Lower bound finds the smallest index where the element is greater than or equal to the target. In this problem, it's finding the floor, which is the largest element <= x, so we track the last position where arr[mid] <= x.",
      workedExample: "Array: [1,2,8,10,11,12,19], x=5\nlow=0, high=6\nmid=3, arr[3]=10 >5, high=2\nmid=1, arr[1]=2 <=5, ans=1, low=2\nmid=2, arr[2]=8 >5, high=1\nlow=2 > high=1, return 1",
      initialCode: "int findFloor(vector<long long> v, long long n, long long x) {\n    // Your code here\n}",
      solutions: {
        cpp: "int findFloor(vector<long long> v, long long n, long long x) {\n    long long low = 0, high = n - 1;\n    int ans = -1;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (v[mid] <= x) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        c: "int findFloor(long long v[], long long n, long long x) {\n    long long low = 0, high = n - 1;\n    int ans = -1;\n    while (low <= high) {\n        long long mid = low + (high - low) / 2;\n        if (v[mid] <= x) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        python: "def findFloor(v, n, x):\n    low, high = 0, n - 1\n    ans = -1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if v[mid] <= x:\n            ans = mid\n            low = mid + 1\n        else:\n            high = mid - 1\n    return ans",
        java: "public int findFloor(long[] v, long n, long x) {\n    long low = 0, high = n - 1;\n    int ans = -1;\n    while (low <= high) {\n        long mid = low + (high - low) / 2;\n        if (v[(int)mid] <= x) {\n            ans = (int)mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        javascript: "function findFloor(v, n, x) {\n    let low = 0, high = n - 1;\n    let ans = -1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (v[mid] <= x) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}"
      }
    },
    {
      title: "Upper Bound",
      difficulty: "Easy",
      problemStatement: "Given a sorted array arr[] of size N and an integer X, find the upper bound of X. Upper bound of X is the smallest index i such that arr[i] > X.",
      examples: [
        {
          input: "N = 4, X = 3\narr[] = {1, 2, 3, 4}",
          output: "3"
        },
        {
          input: "N = 4, X = 5\narr[] = {1, 2, 3, 4}",
          output: "4"
        }
      ],
      testCases: [
        { input: "4 3\n1 2 3 4", output: "3" },
        { input: "4 5\n1 2 3 4", output: "4" },
        { input: "5 2\n1 2 2 3 4", output: "3" },
        { input: "3 0\n1 2 3", output: "0" },
        { input: "6 7\n1 2 4 5 6 8", output: "5" },
        { input: "1 1\n1", output: "1" },
        { input: "2 3\n1 2", output: "2" },
        { input: "4 2\n1 2 3 4", output: "2" }
      ],
      conceptExplanation: "Upper bound finds the smallest index where the element is greater than the target. We use binary search to find the first position where arr[mid] > x.",
      workedExample: "Array: [1,2,3,4], X=3\nlow=0, high=3\nmid=1, arr[1]=2 <=3, low=2\nmid=2, arr[2]=3 <=3, low=3\nmid=3, arr[3]=4 >3, return 3",
      initialCode: "int upperBound(vector<int>& arr, int n, int x) {\n    // Your code here\n}",
      solutions: {
        cpp: "int upperBound(vector<int>& arr, int n, int x) {\n    int low = 0, high = n - 1;\n    int ans = n;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] > x) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return ans;\n}",
        c: "int upperBound(int arr[], int n, int x) {\n    int low = 0, high = n - 1;\n    int ans = n;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] > x) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return ans;\n}",
        python: "def upperBound(arr, n, x):\n    low, high = 0, n - 1\n    ans = n\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] > x:\n            ans = mid\n            high = mid - 1\n        else:\n            low = mid + 1\n    return ans",
        java: "public int upperBound(int[] arr, int n, int x) {\n    int low = 0, high = n - 1;\n    int ans = n;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] > x) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return ans;\n}",
        javascript: "function upperBound(arr, n, x) {\n    let low = 0, high = n - 1;\n    let ans = n;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (arr[mid] > x) {\n            ans = mid;\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return ans;\n}"
      }
    },
    {
      title: "Search Insert Position",
      difficulty: "Easy",
      problemStatement: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
      examples: [
        {
          input: "nums = [1,3,5,6], target = 5",
          output: "2"
        },
        {
          input: "nums = [1,3,5,6], target = 2",
          output: "1"
        }
      ],
      testCases: [
        { input: "4 5\n1 3 5 6", output: "2" },
        { input: "4 2\n1 3 5 6", output: "1" },
        { input: "4 7\n1 3 5 6", output: "4" },
        { input: "1 0\n1", output: "0" },
        { input: "3 2\n1 3 5", output: "1" },
        { input: "5 4\n1 2 3 5 6", output: "3" },
        { input: "2 3\n1 2", output: "2" },
        { input: "3 0\n1 2 3", output: "0" }
      ],
      conceptExplanation: "This is similar to lower bound. Find the position where the target should be inserted to keep the array sorted.",
      workedExample: "Array: [1,3,5,6], target=2\nlow=0, high=3\nmid=1, arr[1]=3 >2, high=0\nmid=0, arr[0]=1 <2, low=1\nlow=1 > high=0, return 1",
      initialCode: "int searchInsert(vector<int>& nums, int target) {\n    // Your code here\n}",
      solutions: {
        cpp: "int searchInsert(vector<int>& nums, int target) {\n    int low = 0, high = nums.size() - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}",
        c: "int searchInsert(int nums[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}",
        python: "def searchInsert(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return low",
        java: "public int searchInsert(int[] nums, int target) {\n    int low = 0, high = nums.length - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        else if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}",
        javascript: "function searchInsert(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] === target) return mid;\n        else if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Floor and Ceil",
      difficulty: "Easy",
      problemStatement: "Given an unsorted array Arr[] of N integers and an integer X, find floor and ceiling of X in Arr[0..N-1]. Floor of X is the largest element which is smaller than or equal to X. Ceil of X is the smallest element which is greater than or equal to X.",
      examples: [
        {
          input: "N = 8, X = 7\nArr[] = {5, 6, 8, 9, 6, 5, 5, 6}",
          output: "6 8"
        }
      ],
      testCases: [
        { input: "8 7\n5 6 8 9 6 5 5 6", output: "6 8" },
        { input: "4 3\n1 2 3 4", output: "3 3" },
        { input: "5 0\n1 2 3 4 5", output: "-1 1" },
        { input: "3 10\n1 2 3", output: "3 -1" },
        { input: "6 5\n1 3 5 7 9 11", output: "5 5" },
        { input: "2 4\n1 5", output: "1 5" },
        { input: "1 2\n2", output: "2 2" },
        { input: "4 6\n1 2 8 9", output: "2 8" }
      ],
      conceptExplanation: "Sort the array first, then find lower bound for ceil and upper bound -1 for floor.",
      workedExample: "Array: [5,6,8,9,6,5,5,6], X=7, sorted: [5,5,5,6,6,6,8,9]\nFloor: largest <=7, 6\nCeil: smallest >=7, 8",
      initialCode: "pair<int, int> findFloorCeil(vector<int>& arr, int x) {\n    // Your code here\n}",
      solutions: {
        cpp: "pair<int, int> findFloorCeil(vector<int>& arr, int x) {\n    sort(arr.begin(), arr.end());\n    int n = arr.size();\n    int low = 0, high = n - 1;\n    int floor = -1, ceil = -1;\n    // Find floor\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] <= x) {\n            floor = arr[mid];\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0, high = n - 1;\n    // Find ceil\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] >= x) {\n            ceil = arr[mid];\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return {floor, ceil};\n}",
        c: "void findFloorCeil(int arr[], int n, int x, int* floor, int* ceil) {\n    qsort(arr, n, sizeof(int), cmp);\n    *floor = -1;\n    *ceil = -1;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] <= x) {\n            *floor = arr[mid];\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] >= x) {\n            *ceil = arr[mid];\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n}",
        python: "def findFloorCeil(arr, x):\n    arr.sort()\n    n = len(arr)\n    floor = -1\n    ceil = -1\n    low, high = 0, n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] <= x:\n            floor = arr[mid]\n            low = mid + 1\n        else:\n            high = mid - 1\n    low, high = 0, n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if arr[mid] >= x:\n            ceil = arr[mid]\n            high = mid - 1\n        else:\n            low = mid + 1\n    return floor, ceil",
        java: "public int[] findFloorCeil(int[] arr, int x) {\n    Arrays.sort(arr);\n    int n = arr.length;\n    int floor = -1, ceil = -1;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] <= x) {\n            floor = arr[mid];\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0; high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (arr[mid] >= x) {\n            ceil = arr[mid];\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return new int[]{floor, ceil};\n}",
        javascript: "function findFloorCeil(arr, x) {\n    arr.sort((a,b)=>a-b);\n    let n = arr.length;\n    let floor = -1, ceil = -1;\n    let low = 0, high = n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (arr[mid] <= x) {\n            floor = arr[mid];\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0; high = n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (arr[mid] >= x) {\n            ceil = arr[mid];\n            high = mid - 1;\n        } else {\n            low = mid + 1;\n        }\n    }\n    return [floor, ceil];\n}"
      }
    },
    {
      title: "First and Last Occurrence",
      difficulty: "Medium",
      problemStatement: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1].",
      examples: [
        {
          input: "nums = [5,7,7,8,8,10], target = 8",
          output: "[3,4]"
        },
        {
          input: "nums = [5,7,7,8,8,10], target = 6",
          output: "[-1,-1]"
        }
      ],
      testCases: [
        { input: "6 8\n5 7 7 8 8 10", output: "3 4" },
        { input: "6 6\n5 7 7 8 8 10", output: "-1 -1" },
        { input: "4 2\n1 2 2 3", output: "1 2" },
        { input: "3 1\n1 1 1", output: "0 2" },
        { input: "5 4\n1 2 3 4 5", output: "3 3" },
        { input: "2 3\n1 2", output: "-1 -1" },
        { input: "7 7\n1 2 3 4 5 6 7", output: "6 6" },
        { input: "6 5\n1 2 3 4 5 5", output: "4 5" }
      ],
      conceptExplanation: "Use binary search to find the first occurrence (lower bound) and last occurrence (upper bound - 1).",
      workedExample: "Array: [5,7,7,8,8,10], target=8\nFirst: low=0, high=5\nmid=2, arr[2]=7 <8, low=3\nmid=4, arr[4]=8 ==8, high=3, return 3\nLast: low=0, high=5\nmid=2, arr[2]=7 <8, low=3\nmid=4, arr[4]=8 ==8, low=5\nmid=5, arr[5]=10 >8, high=4, return 4",
      initialCode: "vector<int> searchRange(vector<int>& nums, int target) {\n    // Your code here\n}",
      solutions: {
        cpp: "vector<int> searchRange(vector<int>& nums, int target) {\n    int n = nums.size();\n    int first = -1, last = -1;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            first = mid;\n            high = mid - 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            last = mid;\n            low = mid + 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return {first, last};\n}",
        c: "void searchRange(int nums[], int n, int target, int* first, int* last) {\n    *first = -1; *last = -1;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            *first = mid;\n            high = mid - 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0; high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            *last = mid;\n            low = mid + 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n}",
        python: "def searchRange(nums, target):\n    n = len(nums)\n    first = -1\n    last = -1\n    low, high = 0, n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            first = mid\n            high = mid - 1\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    low, high = 0, n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            last = mid\n            low = mid + 1\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return [first, last]",
        java: "public int[] searchRange(int[] nums, int target) {\n    int n = nums.length;\n    int first = -1, last = -1;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            first = mid;\n            high = mid - 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0; high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) {\n            last = mid;\n            low = mid + 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return new int[]{first, last};\n}",
        javascript: "function searchRange(nums, target) {\n    let n = nums.length;\n    let first = -1, last = -1;\n    let low = 0, high = n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] === target) {\n            first = mid;\n            high = mid - 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    low = 0; high = n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] === target) {\n            last = mid;\n            low = mid + 1;\n        } else if (nums[mid] < target) {\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return [first, last];\n}"
      }
    },
    {
      title: "Count Occurrences",
      difficulty: "Easy",
      problemStatement: "Given a sorted array arr[] and a number x, write a function that counts the occurrences of x in arr[].",
      examples: [
        {
          input: "arr[] = {1, 1, 2, 2, 2, 2, 3}, x = 2",
          output: "4"
        },
        {
          input: "arr[] = {1, 1, 2, 2, 2, 2, 3}, x = 3",
          output: "1"
        }
      ],
      testCases: [
        { input: "7 2\n1 1 2 2 2 2 3", output: "4" },
        { input: "7 3\n1 1 2 2 2 2 3", output: "1" },
        { input: "5 1\n1 1 1 1 1", output: "5" },
        { input: "4 4\n1 2 3 4", output: "1" },
        { input: "6 5\n1 2 3 4 5 6", output: "1" },
        { input: "3 0\n1 2 3", output: "0" },
        { input: "8 2\n1 1 2 2 2 2 3 3", output: "4" },
        { input: "2 1\n1 2", output: "1" }
      ],
      conceptExplanation: "Find the first and last occurrence of x using binary search, then count = last - first + 1.",
      workedExample: "Array: [1,1,2,2,2,2,3], x=2\nFirst occurrence at 2, last at 5, count = 5-2+1 = 4",
      initialCode: "int countOccurrences(vector<int>& arr, int x) {\n    // Your code here\n}",
      solutions: {
        cpp: "int countOccurrences(vector<int>& arr, int x) {\n    auto it1 = lower_bound(arr.begin(), arr.end(), x);\n    auto it2 = upper_bound(arr.begin(), arr.end(), x);\n    return it2 - it1;\n}",
        c: "int countOccurrences(int arr[], int n, int x) {\n    int* it1 = lower_bound(arr, arr + n, x);\n    int* it2 = upper_bound(arr, arr + n, x);\n    return it2 - it1;\n}",
        python: "def countOccurrences(arr, x):\n    from bisect import bisect_left, bisect_right\n    left = bisect_left(arr, x)\n    right = bisect_right(arr, x)\n    return right - left",
        java: "public int countOccurrences(int[] arr, int x) {\n    int left = Arrays.binarySearch(arr, x);\n    if (left < 0) return 0;\n    int right = left;\n    while (right < arr.length && arr[right] == x) right++;\n    while (left >= 0 && arr[left] == x) left--;\n    return right - left - 1;\n}",
        javascript: "function countOccurrences(arr, x) {\n    let left = arr.indexOf(x);\n    if (left === -1) return 0;\n    let right = left;\n    while (right < arr.length && arr[right] === x) right++;\n    return right - left;\n}"
      }
    },
    {
      title: "Search in Rotated Sorted Array",
      difficulty: "Medium",
      problemStatement: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length) such that the resulting array is [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]] (0-indexed). Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
      examples: [
        {
          input: "nums = [4,5,6,7,0,1,2], target = 0",
          output: "4"
        },
        {
          input: "nums = [4,5,6,7,0,1,2], target = 3",
          output: "-1"
        }
      ],
      testCases: [
        { input: "7 0\n4 5 6 7 0 1 2", output: "4" },
        { input: "7 3\n4 5 6 7 0 1 2", output: "-1" },
        { input: "4 1\n3 1", output: "1" },
        { input: "5 2\n4 5 1 2 3", output: "3" },
        { input: "6 6\n6 7 0 1 2 3", output: "0" },
        { input: "3 2\n1 2 3", output: "1" },
        { input: "4 0\n4 5 6 7", output: "-1" },
        { input: "8 5\n5 6 7 8 1 2 3 4", output: "0" }
      ],
      conceptExplanation: "Find the pivot point where the array is rotated, then decide which half to search in based on the target.",
      workedExample: "Array: [4,5,6,7,0,1,2], target=0\nFind pivot: mid=3, arr[3]=7 > arr[0]=4, low=4\nmid=5, arr[5]=1 < arr[4]=0, high=4, pivot=4\nSince target=0 >= arr[0], search left half [4,5,6,7], but 0 not in, then right [0,1,2], find at 4",
      initialCode: "int search(vector<int>& nums, int target) {\n    // Your code here\n}",
      solutions: {
        cpp: "int search(vector<int>& nums, int target) {\n    int n = nums.size();\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}",
        c: "int search(int nums[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}",
        python: "def search(nums, target):\n    n = len(nums)\n    low, high = 0, n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[low] <= nums[mid]:\n            if nums[low] <= target < nums[mid]:\n                high = mid - 1\n            else:\n                low = mid + 1\n        else:\n            if nums[mid] < target <= nums[high]:\n                low = mid + 1\n            else:\n                high = mid - 1\n    return -1",
        java: "public int search(int[] nums, int target) {\n    int n = nums.length;\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}",
        javascript: "function search(nums, target) {\n    let n = nums.length;\n    let low = 0, high = n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[low] <= nums[mid]) {\n            if (nums[low] <= target && target < nums[mid]) high = mid - 1;\n            else low = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[high]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return -1;\n}"
      }
    },
    {
      title: "Minimum in Rotated Sorted Array",
      difficulty: "Medium",
      problemStatement: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Find the minimum element in the array.",
      examples: [
        {
          input: "nums = [3,4,5,1,2]",
          output: "1"
        },
        {
          input: "nums = [4,5,6,7,0,1,2]",
          output: "0"
        }
      ],
      testCases: [
        { input: "5\n3 4 5 1 2", output: "1" },
        { input: "7\n4 5 6 7 0 1 2", output: "0" },
        { input: "1\n1", output: "1" },
        { input: "3\n2 1", output: "1" },
        { input: "4\n3 4 1 2", output: "1" },
        { input: "6\n5 6 7 1 2 3", output: "1" },
        { input: "2\n1 2", output: "1" },
        { input: "4\n4 5 6 7", output: "4" }
      ],
      conceptExplanation: "The minimum is at the pivot point. Use binary search to find where nums[mid] > nums[mid+1] or nums[mid] < nums[mid-1].",
      workedExample: "Array: [3,4,5,1,2]\nlow=0, high=4\nmid=2, arr[2]=5 > arr[3]=1, high=2\nmid=1, arr[1]=4 < arr[2]=5, low=2\nlow=2 > high=2, return arr[2]=5? Wait, better to find the point where left > right.\nActually, find the smallest.",
      initialCode: "int findMin(vector<int>& nums) {\n    // Your code here\n}",
      solutions: {
        cpp: "int findMin(vector<int>& nums) {\n    int n = nums.size();\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] > nums[high]) low = mid + 1;\n        else high = mid;\n    }\n    return nums[low];\n}",
        c: "int findMin(int nums[], int n) {\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] > nums[high]) low = mid + 1;\n        else high = mid;\n    }\n    return nums[low];\n}",
        python: "def findMin(nums):\n    n = len(nums)\n    low, high = 0, n - 1\n    while low < high:\n        mid = low + (high - low) // 2\n        if nums[mid] > nums[high]:\n            low = mid + 1\n        else:\n            high = mid\n    return nums[low]",
        java: "public int findMin(int[] nums) {\n    int n = nums.length;\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] > nums[high]) low = mid + 1;\n        else high = mid;\n    }\n    return nums[low];\n}",
        javascript: "function findMin(nums) {\n    let n = nums.length;\n    let low = 0, high = n - 1;\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] > nums[high]) low = mid + 1;\n        else high = mid;\n    }\n    return nums[low];\n}"
      }
    },
    {
      title: "Find Peak Element",
      difficulty: "Medium",
      problemStatement: "A peak element is an element that is strictly greater than its neighbors. Given an integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks.",
      examples: [
        {
          input: "nums = [1,2,3,1]",
          output: "2"
        },
        {
          input: "nums = [1,2,1,3,5,6,4]",
          output: "5"
        }
      ],
      testCases: [
        { input: "4\n1 2 3 1", output: "2" },
        { input: "7\n1 2 1 3 5 6 4", output: "5" },
        { input: "1\n1", output: "0" },
        { input: "2\n1 2", output: "1" },
        { input: "3\n2 1 3", output: "0" },
        { input: "5\n1 3 2 4 5", output: "1" },
        { input: "4\n5 4 3 2", output: "0" },
        { input: "3\n1 2 3", output: "2" }
      ],
      conceptExplanation: "Use binary search. If nums[mid] < nums[mid+1], peak is on right, else on left.",
      workedExample: "Array: [1,2,3,1]\nlow=0, high=3\nmid=1, arr[1]=2 < arr[2]=3, low=2\nmid=2, arr[2]=3 > arr[3]=1, high=2, return 2",
      initialCode: "int findPeakElement(vector<int>& nums) {\n    // Your code here\n}",
      solutions: {
        cpp: "int findPeakElement(vector<int>& nums) {\n    int n = nums.size();\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] < nums[mid + 1]) low = mid + 1;\n        else high = mid;\n    }\n    return low;\n}",
        c: "int findPeakElement(int nums[], int n) {\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] < nums[mid + 1]) low = mid + 1;\n        else high = mid;\n    }\n    return low;\n}",
        python: "def findPeakElement(nums):\n    n = len(nums)\n    low, high = 0, n - 1\n    while low < high:\n        mid = low + (high - low) // 2\n        if nums[mid] < nums[mid + 1]:\n            low = mid + 1\n        else:\n            high = mid\n    return low",
        java: "public int findPeakElement(int[] nums) {\n    int n = nums.length;\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (nums[mid] < nums[mid + 1]) low = mid + 1;\n        else high = mid;\n    }\n    return low;\n}",
        javascript: "function findPeakElement(nums) {\n    let n = nums.length;\n    let low = 0, high = n - 1;\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (nums[mid] < nums[mid + 1]) low = mid + 1;\n        else high = mid;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Single Element in Sorted Array",
      difficulty: "Medium",
      problemStatement: "You are given a sorted array consisting of only integers where every element appears exactly twice, except for one element which appears exactly once. Find this single element that appears only once.",
      examples: [
        {
          input: "nums = [1,1,2,3,3,4,4,8,8]",
          output: "2"
        },
        {
          input: "nums = [3,3,7,7,10,11,11]",
          output: "10"
        }
      ],
      testCases: [
        { input: "9\n1 1 2 3 3 4 4 8 8", output: "2" },
        { input: "7\n3 3 7 7 10 11 11", output: "10" },
        { input: "1\n1", output: "1" },
        { input: "3\n1 1 2", output: "2" },
        { input: "5\n1 2 2 3 3", output: "1" },
        { input: "7\n1 1 2 2 3 4 4", output: "3" },
        { input: "9\n1 1 2 2 3 3 4 5 5", output: "4" },
        { input: "11\n1 1 2 2 3 3 4 4 5 6 6", output: "5" }
      ],
      conceptExplanation: "Use binary search. Check if mid is even or odd. If nums[mid] == nums[mid+1], single is on right, else on left.",
      workedExample: "Array: [1,1,2,3,3,4,4,8,8]\nlow=0, high=8\nmid=4, arr[4]=3, arr[5]=4, 3!=4, and since mid even, single on left, high=3\nmid=1, arr[1]=1, arr[2]=2, 1!=2, mid odd, single on left, high=0\nmid=0, arr[0]=1, arr[1]=1, 1==1, single on right, low=1\nlow=1, high=1, return 2",
      initialCode: "int singleNonDuplicate(vector<int>& nums) {\n    // Your code here\n}",
      solutions: {
        cpp: "int singleNonDuplicate(vector<int>& nums) {\n    int n = nums.size();\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (mid % 2 == 0) {\n            if (nums[mid] == nums[mid + 1]) low = mid + 2;\n            else high = mid;\n        } else {\n            if (nums[mid] == nums[mid - 1]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return nums[low];\n}",
        c: "int singleNonDuplicate(int nums[], int n) {\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (mid % 2 == 0) {\n            if (nums[mid] == nums[mid + 1]) low = mid + 2;\n            else high = mid;\n        } else {\n            if (nums[mid] == nums[mid - 1]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return nums[low];\n}",
        python: "def singleNonDuplicate(nums):\n    n = len(nums)\n    low, high = 0, n - 1\n    while low < high:\n        mid = low + (high - low) // 2\n        if mid % 2 == 0:\n            if nums[mid] == nums[mid + 1]:\n                low = mid + 2\n            else:\n                high = mid\n        else:\n            if nums[mid] == nums[mid - 1]:\n                low = mid + 1\n            else:\n                high = mid - 1\n    return nums[low]",
        java: "public int singleNonDuplicate(int[] nums) {\n    int n = nums.length;\n    int low = 0, high = n - 1;\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        if (mid % 2 == 0) {\n            if (nums[mid] == nums[mid + 1]) low = mid + 2;\n            else high = mid;\n        } else {\n            if (nums[mid] == nums[mid - 1]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return nums[low];\n}",
        javascript: "function singleNonDuplicate(nums) {\n    let n = nums.length;\n    let low = 0, high = n - 1;\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (mid % 2 === 0) {\n            if (nums[mid] === nums[mid + 1]) low = mid + 2;\n            else high = mid;\n        } else {\n            if (nums[mid] === nums[mid - 1]) low = mid + 1;\n            else high = mid - 1;\n        }\n    }\n    return nums[low];\n}"
      }
    },
    {
      title: "Search in 2D Matrix",
      difficulty: "Medium",
      problemStatement: "Write an efficient algorithm that searches for a value in an m x n matrix. This matrix has the following properties: Integers in each row are sorted from left to right. The first integer of each row is greater than the last integer of the previous row.",
      examples: [
        {
          input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
          output: "true"
        }
      ],
      testCases: [
        { input: "3 4 3\n1 3 5 7\n10 11 16 20\n23 30 34 60", output: "true" },
        { input: "3 4 13\n1 3 5 7\n10 11 16 20\n23 30 34 60", output: "false" },
        { input: "1 1 1\n1", output: "true" },
        { input: "2 2 4\n1 2\n3 4", output: "true" },
        { input: "3 3 5\n1 2 3\n4 5 6\n7 8 9", output: "true" },
        { input: "2 3 0\n1 2 3\n4 5 6", output: "false" },
        { input: "4 4 15\n1 3 5 7\n10 11 16 20\n23 30 34 50\n60 70 80 90", output: "false" },
        { input: "1 3 2\n1 2 3", output: "true" }
      ],
      conceptExplanation: "Treat the 2D matrix as a 1D array and apply binary search.",
      workedExample: "Matrix:\n1 3 5 7\n10 11 16 20\n23 30 34 60\nTarget=3\nTreat as [1,3,5,7,10,11,16,20,23,30,34,60], mid=5, arr[5]=11 >3, high=4\nmid=2, arr[2]=5 >3, high=1\nmid=0, arr[0]=1 <3, low=1\nmid=1, arr[1]=3 ==3, return true",
      initialCode: "bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool searchMatrix(vector<vector<int>>& matrix, int target) {\n    int m = matrix.size(), n = matrix[0].size();\n    int low = 0, high = m * n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int row = mid / n, col = mid % n;\n        if (matrix[row][col] == target) return true;\n        else if (matrix[row][col] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return false;\n}",
        c: "bool searchMatrix(int** matrix, int m, int n, int target) {\n    int low = 0, high = m * n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int row = mid / n, col = mid % n;\n        if (matrix[row][col] == target) return true;\n        else if (matrix[row][col] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return false;\n}",
        python: "def searchMatrix(matrix, target):\n    if not matrix or not matrix[0]: return False\n    m, n = len(matrix), len(matrix[0])\n    low, high = 0, m * n - 1\n    while low <= high:\n        mid = low + (high - low) // 2\n        row, col = mid // n, mid % n\n        if matrix[row][col] == target:\n            return True\n        elif matrix[row][col] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return False",
        java: "public boolean searchMatrix(int[][] matrix, int target) {\n    int m = matrix.length, n = matrix[0].length;\n    int low = 0, high = m * n - 1;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        int row = mid / n, col = mid % n;\n        if (matrix[row][col] == target) return true;\n        else if (matrix[row][col] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return false;\n}",
        javascript: "function searchMatrix(matrix, target) {\n    if (!matrix || !matrix[0]) return false;\n    let m = matrix.length, n = matrix[0].length;\n    let low = 0, high = m * n - 1;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let row = Math.floor(mid / n), col = mid % n;\n        if (matrix[row][col] === target) return true;\n        else if (matrix[row][col] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return false;\n}"
      }
    },
    {
      title: "Search in Row Wise and Column Wise Sorted Matrix",
      difficulty: "Medium",
      problemStatement: "Given a matrix mat[][] of size N x M, where every row and column is sorted in increasing order, and a number X is given. The task is to find whether element X is present in the matrix or not.",
      examples: [
        {
          input: "mat = [[10, 20, 30, 40],[15, 25, 35, 45],[27, 29, 37, 48],[32, 33, 39, 50]], X = 29",
          output: "true"
        }
      ],
      testCases: [
        { input: "4 4 29\n10 20 30 40\n15 25 35 45\n27 29 37 48\n32 33 39 50", output: "true" },
        { input: "4 4 100\n10 20 30 40\n15 25 35 45\n27 29 37 48\n32 33 39 50", output: "false" },
        { input: "1 1 1\n1", output: "true" },
        { input: "2 2 3\n1 2\n3 4", output: "true" },
        { input: "3 3 5\n1 2 3\n4 5 6\n7 8 9", output: "true" },
        { input: "2 3 0\n1 2 3\n4 5 6", output: "false" },
        { input: "3 4 15\n1 3 5 7\n10 11 16 20\n23 30 34 50", output: "false" },
        { input: "2 2 4\n1 2\n3 4", output: "true" }
      ],
      conceptExplanation: "Start from top-right corner. If current > target, move left; if current < target, move down.",
      workedExample: "Matrix:\n10 20 30 40\n15 25 35 45\n27 29 37 48\n32 33 39 50\nStart at 40, 40 >29, left to 30\n30 >29, left to 20\n20 <29, down to 25\n25 <29, down to 29, found",
      initialCode: "bool search(vector<vector<int>>& mat, int x) {\n    // Your code here\n}",
      solutions: {
        cpp: "bool search(vector<vector<int>>& mat, int x) {\n    int n = mat.size(), m = mat[0].size();\n    int i = 0, j = m - 1;\n    while (i < n && j >= 0) {\n        if (mat[i][j] == x) return true;\n        else if (mat[i][j] > x) j--;\n        else i++;\n    }\n    return false;\n}",
        c: "bool search(int** mat, int n, int m, int x) {\n    int i = 0, j = m - 1;\n    while (i < n && j >= 0) {\n        if (mat[i][j] == x) return true;\n        else if (mat[i][j] > x) j--;\n        else i++;\n    }\n    return false;\n}",
        python: "def search(mat, x):\n    n, m = len(mat), len(mat[0])\n    i, j = 0, m - 1\n    while i < n and j >= 0:\n        if mat[i][j] == x:\n            return True\n        elif mat[i][j] > x:\n            j -= 1\n        else:\n            i += 1\n    return False",
        java: "public boolean search(int[][] mat, int x) {\n    int n = mat.length, m = mat[0].length;\n    int i = 0, j = m - 1;\n    while (i < n && j >= 0) {\n        if (mat[i][j] == x) return true;\n        else if (mat[i][j] > x) j--;\n        else i++;\n    }\n    return false;\n}",
        javascript: "function search(mat, x) {\n    let n = mat.length, m = mat[0].length;\n    let i = 0, j = m - 1;\n    while (i < n && j >= 0) {\n        if (mat[i][j] === x) return true;\n        else if (mat[i][j] > x) j--;\n        else i++;\n    }\n    return false;\n}"
      }
    },
    {
      title: "Find Square Root",
      difficulty: "Easy",
      problemStatement: "Given a non-negative integer x, compute and return the square root of x. Since the return type is an integer, the decimal digits are truncated, and only the integer part of the result is returned.",
      examples: [
        {
          input: "x = 4",
          output: "2"
        },
        {
          input: "x = 8",
          output: "2"
        }
      ],
      testCases: [
        { input: "4", output: "2" },
        { input: "8", output: "2" },
        { input: "1", output: "1" },
        { input: "0", output: "0" },
        { input: "9", output: "3" },
        { input: "16", output: "4" },
        { input: "25", output: "5" },
        { input: "100", output: "10" }
      ],
      conceptExplanation: "Use binary search on the range 0 to x, find the largest mid where mid*mid <= x.",
      workedExample: "x=8, low=0, high=8\nmid=4, 4*4=16 >8, high=3\nmid=1, 1*1=1 <8, low=2\nmid=2, 2*2=4 <8, low=3\nmid=3, 3*3=9 >8, high=2, return 2",
      initialCode: "int mySqrt(int x) {\n    // Your code here\n}",
      solutions: {
        cpp: "int mySqrt(int x) {\n    if (x == 0 || x == 1) return x;\n    int low = 1, high = x;\n    int ans = 0;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (mid <= x / mid) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        c: "int mySqrt(int x) {\n    if (x == 0 || x == 1) return x;\n    int low = 1, high = x;\n    int ans = 0;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (mid <= x / mid) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        python: "def mySqrt(x):\n    if x == 0 or x == 1:\n        return x\n    low, high = 1, x\n    ans = 0\n    while low <= high:\n        mid = low + (high - low) // 2\n        if mid <= x // mid:\n            ans = mid\n            low = mid + 1\n        else:\n            high = mid - 1\n    return ans",
        java: "public int mySqrt(int x) {\n    if (x == 0 || x == 1) return x;\n    int low = 1, high = x;\n    int ans = 0;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        if (mid <= x / mid) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}",
        javascript: "function mySqrt(x) {\n    if (x === 0 || x === 1) return x;\n    let low = 1, high = x;\n    let ans = 0;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        if (mid <= Math.floor(x / mid)) {\n            ans = mid;\n            low = mid + 1;\n        } else {\n            high = mid - 1;\n        }\n    }\n    return ans;\n}"
      }
    },
    {
      title: "Find Nth Root",
      difficulty: "Medium",
      problemStatement: "Given two numbers N and M, find the Nth root of M. The Nth root of a number M is a number X such that X^N = M.",
      examples: [
        {
          input: "N = 2, M = 9",
          output: "3"
        },
        {
          input: "N = 3, M = 27",
          output: "3"
        }
      ],
      testCases: [
        { input: "2 9", output: "3" },
        { input: "3 27", output: "3" },
        { input: "2 16", output: "4" },
        { input: "3 8", output: "2" },
        { input: "4 16", output: "2" },
        { input: "2 1", output: "1" },
        { input: "5 32", output: "2" },
        { input: "3 1", output: "1" }
      ],
      conceptExplanation: "Use binary search on the range 1 to M, find the largest mid where mid^N <= M.",
      workedExample: "N=2, M=9, low=1, high=9\nmid=5, 5^2=25 >9, high=4\nmid=2, 2^2=4 <9, low=3\nmid=3, 3^2=9 ==9, return 3",
      initialCode: "int NthRoot(int n, int m) {\n    // Your code here\n}",
      solutions: {
        cpp: "int NthRoot(int n, int m) {\n    int low = 1, high = m;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        long long val = 1;\n        for (int i = 0; i < n; i++) {\n            val *= mid;\n            if (val > m) break;\n        }\n        if (val == m) return mid;\n        else if (val < m) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
        c: "int NthRoot(int n, int m) {\n    int low = 1, high = m;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        long long val = 1;\n        for (int i = 0; i < n; i++) {\n            val *= mid;\n            if (val > m) break;\n        }\n        if (val == m) return mid;\n        else if (val < m) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
        python: "def NthRoot(n, m):\n    low, high = 1, m\n    while low <= high:\n        mid = low + (high - low) // 2\n        val = 1\n        for _ in range(n):\n            val *= mid\n            if val > m:\n                break\n        if val == m:\n            return mid\n        elif val < m:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1",
        java: "public int NthRoot(int n, int m) {\n    int low = 1, high = m;\n    while (low <= high) {\n        int mid = low + (high - low) / 2;\n        long val = 1;\n        for (int i = 0; i < n; i++) {\n            val *= mid;\n            if (val > m) break;\n        }\n        if (val == m) return mid;\n        else if (val < m) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}",
        javascript: "function NthRoot(n, m) {\n    let low = 1, high = m;\n    while (low <= high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let val = 1;\n        for (let i = 0; i < n; i++) {\n            val *= mid;\n            if (val > m) break;\n        }\n        if (val === m) return mid;\n        else if (val < m) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}"
      }
    },
    {
      title: "Koko Eating Bananas",
      difficulty: "Medium",
      problemStatement: "Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Koko can decide her bananas-per-hour eating speed of k. Each hour, she chooses some pile of bananas and eats k bananas from that pile. If the pile has less than k bananas, she eats all of them instead and won't eat any more that hour. Koko likes to eat slowly but still wants to eat all the bananas before the guards return. Return the minimum integer k such that she can eat all the bananas within h hours.",
      examples: [
        {
          input: "piles = [3,6,7,11], h = 8",
          output: "4"
        }
      ],
      testCases: [
        { input: "4 8\n3 6 7 11", output: "4" },
        { input: "5 5\n30 11 23 4 20", output: "30" },
        { input: "1 1\n1", output: "1" },
        { input: "3 6\n1 2 3", output: "1" },
        { input: "4 4\n1 1 1 1", output: "1" },
        { input: "2 3\n3 6", output: "3" },
        { input: "6 7\n3 6 7 11 2 8", output: "5" },
        { input: "3 10\n1 2 3", output: "1" }
      ],
      conceptExplanation: "Binary search on k from 1 to max(piles). For each mid, calculate total hours needed.",
      workedExample: "piles=[3,6,7,11], h=8\nmax=11, low=1, high=11\nmid=6, hours=1+1+2+2=6 <8, high=5\nmid=3, hours=1+2+3+4=10 >8, low=4\nmid=4, hours=1+2+2+3=8 ==8, return 4",
      initialCode: "int minEatingSpeed(vector<int>& piles, int h) {\n    // Your code here\n}",
      solutions: {
        cpp: "int minEatingSpeed(vector<int>& piles, int h) {\n    int low = 1, high = *max_element(piles.begin(), piles.end());\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        long long hours = 0;\n        for (int p : piles) {\n            hours += (p + mid - 1) / mid;\n        }\n        if (hours <= h) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        c: "int minEatingSpeed(int piles[], int n, int h) {\n    int low = 1, high = piles[0];\n    for (int i = 1; i < n; i++) if (piles[i] > high) high = piles[i];\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        long long hours = 0;\n        for (int i = 0; i < n; i++) {\n            hours += (piles[i] + mid - 1) / mid;\n        }\n        if (hours <= h) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        python: "def minEatingSpeed(piles, h):\n    low, high = 1, max(piles)\n    while low < high:\n        mid = low + (high - low) // 2\n        hours = sum((p + mid - 1) // mid for p in piles)\n        if hours <= h:\n            high = mid\n        else:\n            low = mid + 1\n    return low",
        java: "public int minEatingSpeed(int[] piles, int h) {\n    int low = 1, high = Arrays.stream(piles).max().getAsInt();\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        long hours = 0;\n        for (int p : piles) {\n            hours += (p + mid - 1) / mid;\n        }\n        if (hours <= h) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        javascript: "function minEatingSpeed(piles, h) {\n    let low = 1, high = Math.max(...piles);\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let hours = 0;\n        for (let p of piles) {\n            hours += Math.ceil(p / mid);\n        }\n        if (hours <= h) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Minimum Days to Make M Bouquets",
      difficulty: "Medium",
      problemStatement: "You are given an integer array bloomDay, an integer m, and an integer k. You want to make m bouquets. To make a bouquet, you need to use k adjacent flowers from the garden. The garden consists of n flowers, the ith flower will bloom in the bloomDay[i] and then can be used in exactly one bouquet. Return the minimum number of days you need to wait to be able to make m bouquets from the garden. If it is impossible, return -1.",
      examples: [
        {
          input: "bloomDay = [1,10,3,10,2], m = 3, k = 1",
          output: "3"
        }
      ],
      testCases: [
        { input: "5 3 1\n1 10 3 10 2", output: "3" },
        { input: "7 2 3\n7 7 7 7 12 7 7", output: "12" },
        { input: "3 1 2\n1 2 3", output: "2" },
        { input: "4 2 2\n1 2 3 4", output: "3" },
        { input: "5 1 1\n1 2 3 4 5", output: "1" },
        { input: "6 3 2\n1 2 3 4 5 6", output: "5" },
        { input: "2 1 2\n1 2", output: "2" },
        { input: "4 2 1\n1 2 3 4", output: "2" }
      ],
      conceptExplanation: "Binary search on days from min to max bloomDay. For each mid, check if we can make m bouquets.",
      workedExample: "bloomDay=[1,10,3,10,2], m=3, k=1\nmin=1, max=10\nmid=5, check if can make 3 bouquets by day 5: flowers [1,2,3] bloom, can make 3, yes, high=4\nmid=2, flowers [1,2], can make 2, no, low=3\nmid=3, flowers [1,2,3], can make 3, yes, return 3",
      initialCode: "int minDays(vector<int>& bloomDay, int m, int k) {\n    // Your code here\n}",
      solutions: {
        cpp: "int minDays(vector<int>& bloomDay, int m, int k) {\n    int n = bloomDay.size();\n    if (n < (long long)m * k) return -1;\n    int low = *min_element(bloomDay.begin(), bloomDay.end());\n    int high = *max_element(bloomDay.begin(), bloomDay.end());\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0, flowers = 0;\n        for (int b : bloomDay) {\n            if (b <= mid) {\n                flowers++;\n                if (flowers == k) {\n                    bouquets++;\n                    flowers = 0;\n                }\n            } else {\n                flowers = 0;\n            }\n        }\n        if (bouquets >= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        c: "int minDays(int bloomDay[], int n, int m, int k) {\n    if (n < (long long)m * k) return -1;\n    int low = bloomDay[0], high = bloomDay[0];\n    for (int i = 1; i < n; i++) {\n        low = low < bloomDay[i] ? low : bloomDay[i];\n        high = high > bloomDay[i] ? high : bloomDay[i];\n    }\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0, flowers = 0;\n        for (int i = 0; i < n; i++) {\n            if (bloomDay[i] <= mid) {\n                flowers++;\n                if (flowers == k) {\n                    bouquets++;\n                    flowers = 0;\n                }\n            } else {\n                flowers = 0;\n            }\n        }\n        if (bouquets >= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        python: "def minDays(bloomDay, m, k):\n    n = len(bloomDay)\n    if n < m * k:\n        return -1\n    low, high = min(bloomDay), max(bloomDay)\n    while low < high:\n        mid = low + (high - low) // 2\n        bouquets = flowers = 0\n        for b in bloomDay:\n            if b <= mid:\n                flowers += 1\n                if flowers == k:\n                    bouquets += 1\n                    flowers = 0\n            else:\n                flowers = 0\n        if bouquets >= m:\n            high = mid\n        else:\n            low = mid + 1\n    return low",
        java: "public int minDays(int[] bloomDay, int m, int k) {\n    int n = bloomDay.length;\n    if (n < (long)m * k) return -1;\n    int low = Arrays.stream(bloomDay).min().getAsInt();\n    int high = Arrays.stream(bloomDay).max().getAsInt();\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int bouquets = 0, flowers = 0;\n        for (int b : bloomDay) {\n            if (b <= mid) {\n                flowers++;\n                if (flowers == k) {\n                    bouquets++;\n                    flowers = 0;\n                }\n            } else {\n                flowers = 0;\n            }\n        }\n        if (bouquets >= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        javascript: "function minDays(bloomDay, m, k) {\n    let n = bloomDay.length;\n    if (n < m * k) return -1;\n    let low = Math.min(...bloomDay);\n    let high = Math.max(...bloomDay);\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let bouquets = 0, flowers = 0;\n        for (let b of bloomDay) {\n            if (b <= mid) {\n                flowers++;\n                if (flowers === k) {\n                    bouquets++;\n                    flowers = 0;\n                }\n            } else {\n                flowers = 0;\n            }\n        }\n        if (bouquets >= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Split Array Largest Sum",
      difficulty: "Hard",
      problemStatement: "Given an array nums which consists of non-negative integers and an integer m, you can split the array into m non-empty continuous subarrays. Write an algorithm to minimize the largest sum among these m subarrays.",
      examples: [
        {
          input: "nums = [7,2,5,10,8], m = 2",
          output: "18"
        }
      ],
      testCases: [
        { input: "5 2\n7 2 5 10 8", output: "18" },
        { input: "4 3\n1 2 3 4", output: "4" },
        { input: "3 1\n1 2 3", output: "6" },
        { input: "6 3\n1 4 4 2 3 5", output: "7" },
        { input: "2 2\n1 2", output: "2" },
        { input: "5 4\n1 2 3 4 5", output: "5" },
        { input: "7 2\n1 2 3 4 5 6 7", output: "18" },
        { input: "4 2\n10 5 13 4", output: "18" }
      ],
      conceptExplanation: "Binary search on the possible largest sum, from max(nums) to sum(nums). For each mid, check if we can split into m subarrays with sum <= mid.",
      workedExample: "nums=[7,2,5,10,8], m=2\nlow=10, high=32\nmid=21, check if can split with max sum 21: [7,2,5]=14, [10,8]=18, yes, high=20\nmid=15, [7,2,5]=14, [10]=10, [8]=8, 3 subarrays >2, no, low=16\n... eventually 18",
      initialCode: "int splitArray(vector<int>& nums, int m) {\n    // Your code here\n}",
      solutions: {
        cpp: "int splitArray(vector<int>& nums, int m) {\n    int n = nums.size();\n    int low = *max_element(nums.begin(), nums.end());\n    int high = accumulate(nums.begin(), nums.end(), 0);\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 1, sum = 0;\n        for (int num : nums) {\n            sum += num;\n            if (sum > mid) {\n                count++;\n                sum = num;\n            }\n        }\n        if (count <= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        c: "int splitArray(int nums[], int n, int m) {\n    int low = nums[0], high = 0;\n    for (int i = 0; i < n; i++) {\n        low = low > nums[i] ? nums[i] : low;\n        high += nums[i];\n    }\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 1, sum = 0;\n        for (int i = 0; i < n; i++) {\n            sum += nums[i];\n            if (sum > mid) {\n                count++;\n                sum = nums[i];\n            }\n        }\n        if (count <= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        python: "def splitArray(nums, m):\n    low, high = max(nums), sum(nums)\n    while low < high:\n        mid = low + (high - low) // 2\n        count, s = 1, 0\n        for num in nums:\n            s += num\n            if s > mid:\n                count += 1\n                s = num\n        if count <= m:\n            high = mid\n        else:\n            low = mid + 1\n    return low",
        java: "public int splitArray(int[] nums, int m) {\n    int low = Arrays.stream(nums).max().getAsInt();\n    int high = Arrays.stream(nums).sum();\n    while (low < high) {\n        int mid = low + (high - low) / 2;\n        int count = 1, sum = 0;\n        for (int num : nums) {\n            sum += num;\n            if (sum > mid) {\n                count++;\n                sum = num;\n            }\n        }\n        if (count <= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        javascript: "function splitArray(nums, m) {\n    let low = Math.max(...nums);\n    let high = nums.reduce((a,b)=>a+b,0);\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let count = 1, sum = 0;\n        for (let num of nums) {\n            sum += num;\n            if (sum > mid) {\n                count++;\n                sum = num;\n            }\n        }\n        if (count <= m) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Painter's Partition",
      difficulty: "Hard",
      problemStatement: "Given an array A of non-negative integers representing the amount of time it takes to paint each board, and an integer K representing the number of painters, find the minimum time to paint all boards under the constraints that any painter will only paint continuous sections of boards.",
      examples: [
        {
          input: "A = [10, 20, 30, 40], K = 2",
          output: "60"
        }
      ],
      testCases: [
        { input: "4 2\n10 20 30 40", output: "60" },
        { input: "5 3\n5 10 30 20 15", output: "35" },
        { input: "3 1\n1 2 3", output: "6" },
        { input: "4 4\n1 2 3 4", output: "4" },
        { input: "6 2\n1 4 4 2 3 5", output: "9" },
        { input: "2 2\n10 10", output: "10" },
        { input: "7 3\n1 2 3 4 5 6 7", output: "11" },
        { input: "4 2\n100 200 300 400", output: "700" }
      ],
      conceptExplanation: "Similar to split array, binary search on time from max(A) to sum(A), check if can assign to K painters.",
      workedExample: "A=[10,20,30,40], K=2\nlow=40, high=100\nmid=70, check: [10,20,30]=60 <=70, [40]=40 <=70, yes, high=69\nmid=54, [10,20]=30 <=54, [30]=30 <=54, [40]=40 <=54, 3 >2, no, low=55\n... eventually 60",
      initialCode: "long long minTime(vector<int>& A, int K) {\n    // Your code here\n}",
      solutions: {
        cpp: "long long minTime(vector<int>& A, int K) {\n    int n = A.size();\n    long long low = *max_element(A.begin(), A.end());\n    long long high = accumulate(A.begin(), A.end(), 0LL);\n    while (low < high) {\n        long long mid = low + (high - low) / 2;\n        long long count = 1, sum = 0;\n        for (int a : A) {\n            sum += a;\n            if (sum > mid) {\n                count++;\n                sum = a;\n            }\n        }\n        if (count <= K) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        c: "long long minTime(int A[], int n, int K) {\n    long long low = A[0], high = 0;\n    for (int i = 0; i < n; i++) {\n        low = low > A[i] ? A[i] : low;\n        high += A[i];\n    }\n    while (low < high) {\n        long long mid = low + (high - low) / 2;\n        long long count = 1, sum = 0;\n        for (int i = 0; i < n; i++) {\n            sum += A[i];\n            if (sum > mid) {\n                count++;\n                sum = A[i];\n            }\n        }\n        if (count <= K) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        python: "def minTime(A, K):\n    low, high = max(A), sum(A)\n    while low < high:\n        mid = low + (high - low) // 2\n        count, s = 1, 0\n        for a in A:\n            s += a\n            if s > mid:\n                count += 1\n                s = a\n        if count <= K:\n            high = mid\n        else:\n            low = mid + 1\n    return low",
        java: "public long minTime(int[] A, int K) {\n    long low = Arrays.stream(A).max().getAsInt();\n    long high = Arrays.stream(A).sum();\n    while (low < high) {\n        long mid = low + (high - low) / 2;\n        long count = 1, sum = 0;\n        for (int a : A) {\n            sum += a;\n            if (sum > mid) {\n                count++;\n                sum = a;\n            }\n        }\n        if (count <= K) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}",
        javascript: "function minTime(A, K) {\n    let low = Math.max(...A);\n    let high = A.reduce((a,b)=>a+b,0);\n    while (low < high) {\n        let mid = Math.floor(low + (high - low) / 2);\n        let count = 1, sum = 0;\n        for (let a of A) {\n            sum += a;\n            if (sum > mid) {\n                count++;\n                sum = a;\n            }\n        }\n        if (count <= K) high = mid;\n        else low = mid + 1;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Minimize Max Distance to Gas Station",
      difficulty: "Hard",
      problemStatement: "You are given an integer array stations that represents the positions of the gas stations on a horizontal line. You are also given an integer k, which is the number of gas stations to add. You can add gas stations anywhere on the line. Find the minimum possible value of the maximum distance between any two adjacent gas stations after adding k gas stations.",
      examples: [
        {
          input: "stations = [1,2,3,4,5,6,7,8,9,10], k = 9",
          output: "0.5"
        }
      ],
      testCases: [
        { input: "10 9\n1 2 3 4 5 6 7 8 9 10", output: "0.5" },
        { input: "2 1\n1 2", output: "0.5" },
        { input: "3 1\n1 2 3", output: "1.0" },
        { input: "4 2\n1 2 3 4", output: "0.5" },
        { input: "5 1\n1 2 3 4 5", output: "1.0" },
        { input: "6 3\n1 2 3 4 5 6", output: "0.5" },
        { input: "3 0\n1 2 3", output: "1.0" },
        { input: "4 1\n1 2 3 4", output: "1.0" }
      ],
      conceptExplanation: "Binary search on the max distance, from 0 to max gap. For each mid, check if we can add k stations to make all gaps <= mid.",
      workedExample: "stations=[1,2,3,4,5], k=1\nlow=0, high=1\nmid=0.5, gaps:1,1,1,1, need 0 stations, yes, return 0.5",
      initialCode: "double minmaxGasDist(vector<int>& stations, int k) {\n    // Your code here\n}",
      solutions: {
        cpp: "double minmaxGasDist(vector<int>& stations, int K) {\n    int n = stations.size();\n    double low = 0, high = stations.back() - stations[0];\n    while (high - low > 1e-6) {\n        double mid = low + (high - low) / 2;\n        int count = 0;\n        for (int i = 1; i < n; i++) {\n            count += ceil((stations[i] - stations[i-1]) / mid) - 1;\n        }\n        if (count <= K) high = mid;\n        else low = mid;\n    }\n    return low;\n}",
        c: "double minmaxGasDist(int stations[], int n, int K) {\n    double low = 0, high = stations[n-1] - stations[0];\n    while (high - low > 1e-6) {\n        double mid = low + (high - low) / 2;\n        int count = 0;\n        for (int i = 1; i < n; i++) {\n            count += ceil((stations[i] - stations[i-1]) / mid) - 1;\n        }\n        if (count <= K) high = mid;\n        else low = mid;\n    }\n    return low;\n}",
        python: "def minmaxGasDist(stations, K):\n    import math\n    low, high = 0, stations[-1] - stations[0]\n    while high - low > 1e-6:\n        mid = low + (high - low) / 2\n        count = 0\n        for i in range(1, len(stations)):\n            count += math.ceil((stations[i] - stations[i-1]) / mid) - 1\n        if count <= K:\n            high = mid\n        else:\n            low = mid\n    return low",
        java: "public double minmaxGasDist(int[] stations, int K) {\n    double low = 0, high = stations[stations.length-1] - stations[0];\n    while (high - low > 1e-6) {\n        double mid = low + (high - low) / 2;\n        int count = 0;\n        for (int i = 1; i < stations.length; i++) {\n            count += Math.ceil((stations[i] - stations[i-1]) / mid) - 1;\n        }\n        if (count <= K) high = mid;\n        else low = mid;\n    }\n    return low;\n}",
        javascript: "function minmaxGasDist(stations, K) {\n    let low = 0, high = stations[stations.length-1] - stations[0];\n    while (high - low > 1e-6) {\n        let mid = low + (high - low) / 2;\n        let count = 0;\n        for (let i = 1; i < stations.length; i++) {\n            count += Math.ceil((stations[i] - stations[i-1]) / mid) - 1;\n        }\n        if (count <= K) high = mid;\n        else low = mid;\n    }\n    return low;\n}"
      }
    },
    {
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      problemStatement: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. The overall run time complexity should be O(log (m+n)).",
      examples: [
        {
          input: "nums1 = [1,3], nums2 = [2]",
          output: "2.00000"
        },
        {
          input: "nums1 = [1,2], nums2 = [3,4]",
          output: "2.50000"
        }
      ],
      testCases: [
        { input: "2 1\n1 3\n2", output: "2.00000" },
        { input: "2 2\n1 2\n3 4", output: "2.50000" },
        { input: "1 1\n1\n1", output: "1.00000" },
        { input: "3 3\n1 2 3\n4 5 6", output: "3.50000" },
        { input: "2 2\n1 3\n2 4", output: "2.50000" },
        { input: "1 2\n1\n2 3", output: "2.00000" },
        { input: "4 4\n1 2 3 4\n5 6 7 8", output: "4.50000" },
        { input: "3 1\n1 2 3\n4", output: "2.50000" }
      ],
      conceptExplanation: "Use binary search to partition the smaller array, find the median.",
      workedExample: "nums1=[1,3], nums2=[2]\nPartition nums1 at 1, left [1], right [3], nums2 left [2], right []\nMax left 1,2=2, min right 3,inf, yes, median 2",
      initialCode: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n}",
      solutions: {
        cpp: "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    if (nums1.size() > nums2.size()) swap(nums1, nums2);\n    int m = nums1.size(), n = nums2.size();\n    int low = 0, high = m;\n    while (low <= high) {\n        int i = low + (high - low) / 2;\n        int j = (m + n + 1) / 2 - i;\n        int maxLeft1 = (i == 0) ? INT_MIN : nums1[i-1];\n        int minRight1 = (i == m) ? INT_MAX : nums1[i];\n        int maxLeft2 = (j == 0) ? INT_MIN : nums2[j-1];\n        int minRight2 = (j == n) ? INT_MAX : nums2[j];\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 0) return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2.0;\n            else return max(maxLeft1, maxLeft2);\n        } else if (maxLeft1 > minRight2) high = i - 1;\n        else low = i + 1;\n    }\n    return 0.0;\n}",
        c: "double findMedianSortedArrays(int nums1[], int m, int nums2[], int n) {\n    if (m > n) {\n        int* temp = nums1; nums1 = nums2; nums2 = temp;\n        int t = m; m = n; n = t;\n    }\n    int low = 0, high = m;\n    while (low <= high) {\n        int i = low + (high - low) / 2;\n        int j = (m + n + 1) / 2 - i;\n        int maxLeft1 = (i == 0) ? INT_MIN : nums1[i-1];\n        int minRight1 = (i == m) ? INT_MAX : nums1[i];\n        int maxLeft2 = (j == 0) ? INT_MIN : nums2[j-1];\n        int minRight2 = (j == n) ? INT_MAX : nums2[j];\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 0) return (fmax(maxLeft1, maxLeft2) + fmin(minRight1, minRight2)) / 2.0;\n            else return fmax(maxLeft1, maxLeft2);\n        } else if (maxLeft1 > minRight2) high = i - 1;\n        else low = i + 1;\n    }\n    return 0.0;\n}",
        python: "def findMedianSortedArrays(nums1, nums2):\n    if len(nums1) > len(nums2):\n        nums1, nums2 = nums2, nums1\n    m, n = len(nums1), len(nums2)\n    low, high = 0, m\n    while low <= high:\n        i = low + (high - low) // 2\n        j = (m + n + 1) // 2 - i\n        maxLeft1 = float('-inf') if i == 0 else nums1[i-1]\n        minRight1 = float('inf') if i == m else nums1[i]\n        maxLeft2 = float('-inf') if j == 0 else nums2[j-1]\n        minRight2 = float('inf') if j == n else nums2[j]\n        if maxLeft1 <= minRight2 and maxLeft2 <= minRight1:\n            if (m + n) % 2 == 0:\n                return (max(maxLeft1, maxLeft2) + min(minRight1, minRight2)) / 2\n            else:\n                return max(maxLeft1, maxLeft2)\n        elif maxLeft1 > minRight2:\n            high = i - 1\n        else:\n            low = i + 1\n    return 0.0",
        java: "public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    if (nums1.length > nums2.length) {\n        int[] temp = nums1; nums1 = nums2; nums2 = temp;\n    }\n    int m = nums1.length, n = nums2.length;\n    int low = 0, high = m;\n    while (low <= high) {\n        int i = low + (high - low) / 2;\n        int j = (m + n + 1) / 2 - i;\n        int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i-1];\n        int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];\n        int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j-1];\n        int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 == 0) return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2.0;\n            else return Math.max(maxLeft1, maxLeft2);\n        } else if (maxLeft1 > minRight2) high = i - 1;\n        else low = i + 1;\n    }\n    return 0.0;\n}",
        javascript: "function findMedianSortedArrays(nums1, nums2) {\n    if (nums1.length > nums2.length) [nums1, nums2] = [nums2, nums1];\n    let m = nums1.length, n = nums2.length;\n    let low = 0, high = m;\n    while (low <= high) {\n        let i = Math.floor(low + (high - low) / 2);\n        let j = Math.floor((m + n + 1) / 2) - i;\n        let maxLeft1 = (i === 0) ? -Infinity : nums1[i-1];\n        let minRight1 = (i === m) ? Infinity : nums1[i];\n        let maxLeft2 = (j === 0) ? -Infinity : nums2[j-1];\n        let minRight2 = (j === n) ? Infinity : nums2[j];\n        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {\n            if ((m + n) % 2 === 0) return (Math.max(maxLeft1, maxLeft2) + Math.min(minRight1, minRight2)) / 2;\n            else return Math.max(maxLeft1, maxLeft2);\n        } else if (maxLeft1 > minRight2) high = i - 1;\n        else low = i + 1;\n    }\n    return 0.0;\n}"
      }
    }
  ]
};

async function ingest() {
  let topic = await db.query.topics.findFirst({
    where: (topics, { eq }) => eq(topics.slug, data.topic.slug),
  });

  if (!topic) {
    await db.insert(topics).values({
      title: data.topic.title,
      slug: data.topic.slug,
      description: data.topic.description,
      order: data.topic.order,
    });

    topic = await db.query.topics.findFirst({
      where: (topics, { eq }) => eq(topics.slug, data.topic.slug),
    });
  }

  if (!topic) throw new Error("Topic not found");

  for (const lang of ['cpp', 'c', 'python', 'java', 'javascript']) {
    await db.insert(topicExamples).values({
      topicSlug: data.topic.slug,
      language: lang,
      code: data.topic.codeExamples[lang],
    });
  }

  for (const problem of data.problems) {
    const [inserted] = await db.insert(problems).values({
      title: problem.title,
      description: problem.problemStatement,
      difficulty: problem.difficulty,
      topicId: topic.id,
      conceptExplanation: problem.conceptExplanation,
      workedExample: problem.workedExample,
      initialCode: problem.initialCode,
      testCases: "",
      order: 0,
    }).returning({ id: problems.id });

    for (const testCase of problem.testCases) {
      await db.insert(codeSnippets).values({
        problemId: inserted.id,
        language: 'test',
        code: `Input: ${testCase.input}\nOutput: ${testCase.output}`,
      });
    }

    for (const lang of ['cpp', 'c', 'python', 'java', 'javascript']) {
      await db.insert(codeSnippets).values({
        problemId: inserted.id,
        language: lang,
        code: problem.solutions[lang],
      });
    }
  }

  console.log("Binary Search ingested successfully!");
}

ingest().catch(console.error);