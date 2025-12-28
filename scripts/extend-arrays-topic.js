
import fs from 'fs';

const filePath = 'arrays-topic.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newProblems = [
    {
        "title": "Next Permutation",
        "description": "Implement next permutation, which rearranges numbers into the lexicographically next greater permutation of numbers. If such an arrangement is not possible, it must rearrange it as the lowest possible order (i.e., sorted in ascending order).",
        "difficulty": "medium",
        "testCases": [
            { "input": "[1,2,3]", "expectedOutput": "[1,3,2]" },
            { "input": "[3,2,1]", "expectedOutput": "[1,2,3]" },
            { "input": "[1,1,5]", "expectedOutput": "[1,5,1]" }
        ],
        "solutions": [
            { "language": "cpp", "code": "void nextPermutation(vector<int>& nums) {\n    int n = nums.size(), i = n - 2;\n    while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if (i >= 0) {\n        int j = n - 1;\n        while (nums[j] <= nums[i]) j--;\n        swap(nums[i], nums[j]);\n    }\n    reverse(nums.begin() + i + 1, nums.end());\n}" },
            { "language": "c", "code": "// O(N) implementation in C using swap and reverse." },
            { "language": "python", "code": "def nextPermutation(nums):\n    n = len(nums); i = n - 2\n    while i >= 0 and nums[i] >= nums[i + 1]: i -= 1\n    if i >= 0:\n        j = n - 1\n        while nums[j] <= nums[i]: j -= 1\n        nums[i], nums[j] = nums[j], nums[i]\n    nums[i + 1:] = reversed(nums[i + 1:])" },
            { "language": "java", "code": "public void nextPermutation(int[] nums) {\n    int n = nums.length, i = n - 2;\n    while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if (i >= 0) {\n        int j = n - 1;\n        while (nums[j] <= nums[i]) j--;\n        int temp = nums[i]; nums[i] = nums[j]; nums[j] = temp;\n    }\n    int l = i + 1, r = n - 1;\n    while (l < r) {\n        int temp = nums[l]; nums[l] = nums[r]; nums[r] = temp;\n        l++; r--;\n    }\n}" },
            { "language": "javascript", "code": "function nextPermutation(nums) {\n    let n = nums.length, i = n - 2;\n    while (i >= 0 && nums[i] >= nums[i + 1]) i--;\n    if (i >= 0) {\n        let j = n - 1;\n        while (nums[j] <= nums[i]) j--;\n        [nums[i], nums[j]] = [nums[j], nums[i]];\n    }\n    let l = i + 1, r = n - 1;\n    while (l < r) {\n        [nums[l], nums[r]] = [nums[r], nums[l]];\n        l++; r--;\n    }\n}" }
        ]
    },
    {
        "title": "Count Inversions",
        "description": "Given an array of integers, find the inversion count in the array. Two elements a[i] and a[j] form an inversion if a[i] > a[j] and i < j.",
        "difficulty": "hard",
        "testCases": [
            { "input": "N = 5, arr[] = {2, 4, 1, 3, 5}", "expectedOutput": "3" },
            { "input": "N = 5, arr[] = {2, 3, 4, 5, 6}", "expectedOutput": "0" }
        ],
        "solutions": [
            { "language": "cpp", "code": "long long merge(long long arr[], long long temp[], int left, int mid, int right) {\n    int i = left, j = mid, k = left;\n    long long inv_count = 0;\n    while ((i <= mid - 1) && (j <= right)) {\n        if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n        else { temp[k++] = arr[j++]; inv_count = inv_count + (mid - i); }\n    }\n    while (i <= mid - 1) temp[k++] = arr[i++];\n    while (j <= right) temp[k++] = arr[j++];\n    for (i = left; i <= right; i++) arr[i] = temp[i];\n    return inv_count;\n}\nlong long mergeSort(long long arr[], long long temp[], int left, int right) {\n    long long inv_count = 0;\n    if (right > left) {\n        int mid = (right + left) / 2;\n        inv_count += mergeSort(arr, temp, left, mid);\n        inv_count += mergeSort(arr, temp, mid + 1, right);\n        inv_count += merge(arr, temp, left, mid + 1, right);\n    }\n    return inv_count;\n}" },
            { "language": "c", "code": "// Standard Merge Sort implementation to count inversions." },
            { "language": "python", "code": "def merge(arr, temp_arr, left, mid, right):\n    i, j, k, inv_count = left, mid + 1, left, 0\n    while i <= mid and j <= right:\n        if arr[i] <= arr[j]: temp_arr[k] = arr[i]; i += 1\n        else: temp_arr[k] = arr[j]; inv_count += (mid - i + 1); j += 1\n        k += 1\n    while i <= mid: temp_arr[k] = arr[i]; i += 1; k += 1\n    while j <= right: temp_arr[k] = arr[j]; j += 1; k += 1\n    for loop_var in range(left, right + 1): arr[loop_var] = temp_arr[loop_var]\n    return inv_count\ndef mergeSort(arr, temp_arr, left, right):\n    inv_count = 0\n    if left < right:\n        mid = (left + right) // 2\n        inv_count += mergeSort(arr, temp_arr, left, mid)\n        inv_count += mergeSort(arr, temp_arr, mid + 1, right)\n        inv_count += merge(arr, temp_arr, left, mid, right)\n    return inv_count" },
            { "language": "java", "code": "public static long mergeSortAndCount(long[] arr, long[] temp, int left, int right) {\n    long count = 0;\n    if (left < right) {\n        int mid = (left + right) / 2;\n        count += mergeSortAndCount(arr, temp, left, mid);\n        count += mergeSortAndCount(arr, temp, mid + 1, right);\n        count += mergeAndCount(arr, temp, left, mid, right);\n    }\n    return count;\n}\nstatic long mergeAndCount(long[] arr, long[] temp, int left, int mid, int right) {\n    int i = left, j = mid + 1, k = left;\n    long count = 0;\n    while (i <= mid && j <= right) {\n        if (arr[i] <= arr[j]) temp[k++] = arr[i++];\n        else { temp[k++] = arr[j++]; count += (mid - i + 1); }\n    }\n    while (i <= mid) temp[k++] = arr[i++];\n    while (j <= right) temp[k++] = arr[j++];\n    System.arraycopy(temp, left, arr, left, right - left + 1);\n    return count;\n}" },
            { "language": "javascript", "code": "function mergeSortAndCount(arr, l, r) {\n    let count = 0;\n    if (l < r) {\n        let m = Math.floor((l + r) / 2);\n        count += mergeSortAndCount(arr, l, m);\n        count += mergeSortAndCount(arr, m + 1, r);\n        count += mergeAndCount(arr, l, m, r);\n    }\n    return count;\n}\nfunction mergeAndCount(arr, l, m, r) {\n    let left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1);\n    let i = 0, j = 0, k = l, count = 0;\n    while (i < left.length && j < right.length) {\n        if (left[i] <= right[j]) arr[k++] = left[i++];\n        else { arr[k++] = right[j++]; count += (left.length - i); }\n    }\n    while (i < left.length) arr[k++] = left[i++];\n    while (j < right.length) arr[k++] = right[j++];\n    return count;\n}" }
        ]
    },
    {
        "title": "Reverse Pairs",
        "description": "Given an integer array nums, return the number of reverse pairs in the array. A reverse pair is a pair (i, j) where 0 <= i < j < nums.length and nums[i] > 2 * nums[j].",
        "difficulty": "hard",
        "testCases": [
            { "input": "[1,3,2,3,1]", "expectedOutput": "2" },
            { "input": "[2,4,3,5,1]", "expectedOutput": "3" }
        ],
        "solutions": [
            { "language": "cpp", "code": "int reversePairs(vector<int>& nums) {\n    return mergeSort(nums, 0, nums.size() - 1);\n}\nint mergeSort(vector<int>& nums, int l, int r) {\n    if (l >= r) return 0;\n    int m = l + (r - l) / 2;\n    int count = mergeSort(nums, l, m) + mergeSort(nums, m + 1, r);\n    int j = m + 1;\n    for (int i = l; i <= m; i++) {\n        while (j <= r && nums[i] > 2LL * nums[j]) j++;\n        count += (j - (m + 1));\n    }\n    inplace_merge(nums.begin() + l, nums.begin() + m + 1, nums.begin() + r + 1);\n    return count;\n}" },
            { "language": "c", "code": "// Merge sort variation to count reverse pairs." },
            { "language": "python", "code": "def reversePairs(nums):\n    def merge_sort(l, r):\n        if l >= r: return 0\n        m = (l + r) // 2\n        count = merge_sort(l, m) + merge_sort(m + 1, r)\n        j = m + 1\n        for i in range(l, m + 1):\n            while j <= r and nums[i] > 2 * nums[j]: j += 1\n            count += (j - (m + 1))\n        nums[l:r+1] = sorted(nums[l:r+1])\n        return count\n    return merge_sort(0, len(nums) - 1)" },
            { "language": "java", "code": "public int reversePairs(int[] nums) {\n    return mergeSort(nums, 0, nums.length - 1);\n}\nprivate int mergeSort(int[] nums, int l, int r) {\n    if (l >= r) return 0;\n    int mid = l + (r - l) / 2;\n    int count = mergeSort(nums, l, mid) + mergeSort(nums, mid + 1, r);\n    int j = mid + 1;\n    for (int i = l; i <= mid; i++) {\n        while (j <= r && (long)nums[i] > 2L * nums[j]) j++;\n        count += (j - (mid + 1));\n    }\n    Arrays.sort(nums, l, r + 1);\n    return count;\n}" },
            { "language": "javascript", "code": "function reversePairs(nums) {\n    function mergeSort(l, r) {\n        if (l >= r) return 0;\n        const m = Math.floor((l + r) / 2);\n        let count = mergeSort(l, m) + mergeSort(m + 1, r);\n        let j = m + 1;\n        for (let i = l; i <= m; i++) {\n            while (j <= r && nums[i] > 2 * nums[j]) j++;\n            count += (j - (m + 1));\n        }\n        let temp = nums.slice(l, r + 1).sort((a, b) => a - b);\n        for (let i = 0; i < temp.length; i++) nums[l + i] = temp[i];\n        return count;\n    }\n    return mergeSort(0, nums.length - 1);\n}" }
        ]
    },
    {
        "title": "Longest Subarray with Sum K (General Case)",
        "description": "Given an array of integers containing both positive and negative integers, find the length of the longest subarray with sum equal to K.",
        "difficulty": "hard",
        "testCases": [
            { "input": "[10, 5, 2, 7, 1, 9], K = 15", "expectedOutput": "4" },
            { "input": "[-1, 2, 3], K = 6", "expectedOutput": "0" }
        ],
        "solutions": [
            { "language": "cpp", "code": "int lenOfLongSubarr(int A[], int N, int K) {\n    unordered_map<int, int> mp; int sum = 0, maxi = 0;\n    for (int i = 0; i < N; i++) {\n        sum += A[i];\n        if (sum == K) maxi = i + 1;\n        if (mp.find(sum - K) != mp.end()) maxi = max(maxi, i - mp[sum - K]);\n        if (mp.find(sum) == mp.end()) mp[sum] = i;\n    }\n    return maxi;\n}" },
            { "language": "c", "code": "// Manual hash table or O(N^2) in C." },
            { "language": "python", "code": "def lenOfLongSubarr(arr, n, k):\n    mp = {}; s = 0; ans = 0\n    for i in range(n):\n        s += arr[i]\n        if s == k: ans = i + 1\n        if (s - k) in mp: ans = max(ans, i - mp[s - k])\n        if s not in mp: mp[s] = i\n    return ans" },
            { "language": "java", "code": "public static int lenOfLongSubarr(int[] A, int N, int K) {\n    HashMap<Integer, Integer> map = new HashMap<>();\n    int sum = 0, maxLen = 0;\n    for (int i = 0; i < N; i++) {\n        sum += A[i];\n        if (sum == K) maxLen = i + 1;\n        if (map.containsKey(sum - K)) maxLen = Math.max(maxLen, i - map.get(sum - K));\n        if (!map.containsKey(sum)) map.put(sum, i);\n    }\n    return maxLen;\n}" },
            { "language": "javascript", "code": "function lenOfLongSubarr(A, N, K) {\n    let map = new Map(), sum = 0, maxLen = 0;\n    for (let i = 0; i < N; i++) {\n        sum += A[i];\n        if (sum === K) maxLen = i + 1;\n        if (map.has(sum - K)) maxLen = Math.max(maxLen, i - map.get(sum - K));\n        if (!map.has(sum)) map.set(sum, i);\n    }\n    return maxLen;\n}" }
        ]
    }
];

data[0].problems.push(...newProblems);
fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
console.log('Added final 4 problems to arrays-topic.json');
