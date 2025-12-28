
import fs from 'fs';

function fixTopic(filename, slug, title, description, codeExamples) {
    let data = JSON.parse(fs.readFileSync(filename, 'utf8'));

    // If it's an array, take the first element (assuming single topic per file)
    let wasArray = false;
    if (Array.isArray(data)) {
        data = data[0];
        wasArray = true;
    }

    // Standardize topic metadata
    data.topic = {
        slug: slug,
        title: title,
        description: description || (typeof data.topic === 'string' ? data.topic : title)
    };

    // Add code examples
    data.codeExamples = codeExamples;

    // Save back
    const output = wasArray ? [data] : data;
    fs.writeFileSync(filename, JSON.stringify(output, null, 2));
    console.log(`Updated ${filename}`);
}

const examples = {
    'bit-manipulation': [
        { language: 'cpp', code: 'int getBit(int n, int i) { return (n & (1 << i)) != 0; }\nint setBit(int n, int i) { return n | (1 << i); }\nint clearBit(int n, int i) { return n & ~(1 << i); }', explanation: 'Basic bit manipulation operations: GET, SET, and CLEAR a bit at position i.' },
        { language: 'python', code: 'def get_bit(n, i): return (n & (1 << i)) != 0\ndef set_bit(n, i): return n | (1 << i)\ndef clear_bit(n, i): return n & ~(1 << i)', explanation: 'Python bitwise operations mirror C++, allowing efficient bit manipulation.' },
        { language: 'java', code: 'int getBit(int n, int i) { return (n & (1 << i)) != 0 ? 1 : 0; }\nint setBit(int n, int i) { return n | (1 << i); }\nint clearBit(int n, int i) { return n & ~(1 << i); }', explanation: 'Standard bitwise operations in Java.' },
        { language: 'c', code: 'int getBit(int n, int i) { return (n & (1 << i)) != 0; }\nint setBit(int n, int i) { return n | (1 << i); }\nint clearBit(int n, int i) { return n & ~(1 << i); }', explanation: 'Bit manipulation in C is identical to C++.' },
        { language: 'javascript', code: 'const getBit = (n, i) => (n & (1 << i)) !== 0;\nconst setBit = (n, i) => n | (1 << i);\nconst clearBit = (n, i) => n & ~(1 << i);', explanation: 'JavaScript supports bitwise operators on 32-bit integers.' }
    ],
    'binary-trees': [
        { language: 'cpp', code: 'void inorder(Node* root) {\n    if(!root) return;\n    inorder(root->left);\n    cout << root->data << " ";\n    inorder(root->right);\n}', explanation: 'Inorder traversal (Left, Root, Right) using recursion.' },
        { language: 'python', code: 'def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val)\n    inorder(root.right)', explanation: 'Recursive inorder traversal in Python.' },
        { language: 'java', code: 'void inorder(Node root) {\n    if(root == null) return;\n    inorder(root.left);\n    System.out.print(root.data + " ");\n    inorder(root.right);\n}', explanation: 'Inorder traversal in Java.' },
        { language: 'c', code: 'void inorder(struct Node* root) {\n    if(root == NULL) return;\n    inorder(root->left);\n    printf("%d ", root->data);\n    inorder(root->right);\n}', explanation: 'Standard C recursive traversal.' },
        { language: 'javascript', code: 'function inorder(root) {\n    if(!root) return;\n    inorder(root.left);\n    console.log(root.val);\n    inorder(root.right);\n}', explanation: 'JavaScript recursive inorder traversal.' }
    ],
    'bst': [
        { language: 'cpp', code: 'Node* insert(Node* root, int val) {\n    if(!root) return new Node(val);\n    if(val < root->data) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}', explanation: 'Inserting a value into a BST while maintaining its property.' },
        { language: 'python', code: 'def insert(root, val):\n    if not root: return Node(val)\n    if val < root.val: root.left = insert(root.left, val)\n    else: root.right = insert(root.right, val)\n    return root', explanation: 'Recursive BST insertion in Python.' },
        { language: 'java', code: 'public Node insert(Node root, int val) {\n    if(root == null) return new Node(val);\n    if(val < root.data) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}', explanation: 'BST insertion in Java.' },
        { language: 'c', code: 'struct Node* insert(struct Node* root, int val) {\n    if(!root) return createNode(val);\n    if(val < root->data) root->left = insert(root->left, val);\n    else root->right = insert(root->right, val);\n    return root;\n}', explanation: 'C implementation of BST insertion.' },
        { language: 'javascript', code: 'function insert(root, val) {\n    if(!root) return new Node(val);\n    if(val < root.val) root.left = insert(root.left, val);\n    else root.right = insert(root.right, val);\n    return root;\n}', explanation: 'JS BST insertion.' }
    ],
    'graphs': [
        { language: 'cpp', code: 'void bfs(int start, vector<vector<int>>& adj) {\n    vector<bool> visited(adj.size(), false);\n    queue<int> q;\n    q.push(start); visited[start] = true;\n    while(!q.empty()) {\n        int node = q.front(); q.pop();\n        for(int nbr : adj[node]) if(!visited[nbr]) { visited[nbr] = true; q.push(nbr); }\n    }\n}', explanation: 'Breadth-First Search (BFS) explores nodes level by level.' },
        { language: 'python', code: 'from collections import deque\ndef bfs(start, adj):\n    visited = [False] * len(adj)\n    q = deque([start])\n    visited[start] = True\n    while q:\n        node = q.popleft()\n        for nbr in adj[node]:\n            if not visited[nbr]:\n                visited[nbr] = True\n                q.append(nbr)', explanation: 'Python BFS using deque for efficient queue operations.' },
        { language: 'java', code: 'void bfs(int start, List<List<Integer>> adj) {\n    boolean[] visited = new boolean[adj.size()];\n    Queue<Integer> q = new LinkedList<>();\n    q.add(start); visited[start] = true;\n    while(!q.isEmpty()) {\n        int node = q.poll();\n        for(int nbr : adj.get(node)) if(!visited[nbr]) { visited[nbr] = true; q.add(nbr); }\n    }\n}', explanation: 'BFS implementation in Java.' },
        { language: 'c', code: '// C BFS requires a queue implementation.\nvoid bfs(int start, int** adj, int n) {\n    int visited[n]; for(int i=0; i<n; i++) visited[i] = 0;\n    int q[n], f=0, r=0;\n    q[r++] = start; visited[start] = 1;\n    while(f < r) {\n        int node = q[f++];\n        for(int i=0; i<n; i++) if(adj[node][i] && !visited[i]) { visited[i] = 1; q[r++] = i; }\n    }\n}', explanation: 'C BFS using a simple array-based queue for adjacency matrix.' },
        { language: 'javascript', code: 'function bfs(start, adj) {\n    let visited = new Array(adj.length).fill(false);\n    let q = [start]; visited[start] = true;\n    while(q.length) {\n        let node = q.shift();\n        for(let nbr of adj[node]) if(!visited[nbr]) { visited[nbr] = true; q.push(nbr); }\n    }\n}', explanation: 'JS BFS using array as a queue.' }
    ],
    'heaps': [
        { language: 'cpp', code: 'void heapifyUp(int idx, vector<int>& heap) {\n    while(idx > 0 && heap[(idx-1)/2] < heap[idx]) {\n        swap(heap[(idx-1)/2], heap[idx]);\n        idx = (idx-1)/2;\n    }\n}', explanation: 'Maintaining max-heap property after insertion by "bubbling up".' },
        { language: 'python', code: 'import heapq\n# Python uses min-heaps by default\nheap = []\nheapq.heappush(heap, 4)\nheapq.heappush(heap, 1)\nval = heapq.heappop(heap) # returns 1', explanation: 'Using Pythons built-in heapq module for efficient heap operations.' },
        { language: 'java', code: 'PriorityQueue<Integer> pq = new PriorityQueue<>();\npq.add(4); pq.add(1);\nint val = pq.poll(); // returns 1', explanation: 'Java PriorityQueue provides a min-heap implementation.' },
        { language: 'c', code: 'void swap(int *a, int *b) { int t = *a; *a = *b; *b = t; }\nvoid heapify(int arr[], int n, int i) {\n    int largest = i, l = 2*i + 1, r = 2*i + 2;\n    if (l < n && arr[l] > arr[largest]) largest = l;\n    if (r < n && arr[r] > arr[largest]) largest = r;\n    if (largest != i) { swap(&arr[i], &arr[largest]); heapify(arr, n, largest); }\n}', explanation: 'Standard heapify implementation in C.' },
        { language: 'javascript', code: '// Min-heap push simulation\nfunction push(val, heap) {\n    heap.push(val);\n    let idx = heap.length - 1;\n    while(idx > 0 && heap[Math.floor((idx-1)/2)] > heap[idx]) {\n        [heap[Math.floor((idx-1)/2)], heap[idx]] = [heap[idx], heap[Math.floor((idx-1)/2)]];\n        idx = Math.floor((idx-1)/2);\n    }\n}', explanation: 'JavaScript min-heap insertion logic.' }
    ],
    'linked-list': [
        { language: 'cpp', code: 'ListNode* reverseList(ListNode* head) {\n    ListNode *prev = NULL, *curr = head;\n    while(curr) {\n        ListNode* next = curr->next;\n        curr->next = prev; prev = curr; curr = next;\n    }\n    return prev;\n}', explanation: 'Iterative approach to reverse a linked list by re-pointing each node.' },
        { language: 'python', code: 'def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev', explanation: 'Python implementation of iterative list reversal.' },
        { language: 'java', code: 'public ListNode reverseList(ListNode head) {\n    ListNode prev = null, curr = head;\n    while(curr != null) {\n        ListNode next = curr.next;\n        curr.next = prev; prev = curr; curr = next;\n    }\n    return prev;\n}', explanation: 'Java iterative reversal.' },
        { language: 'c', code: 'struct ListNode* reverseList(struct ListNode* head) {\n    struct ListNode *prev = NULL, *curr = head;\n    while(curr) {\n        struct ListNode* next = curr->next;\n        curr->next = prev; prev = curr; curr = next;\n    }\n    return prev;\n}', explanation: 'C list reversal using pointer manipulation.' },
        { language: 'javascript', code: 'function reverseList(head) {\n    let prev = null, curr = head;\n    while(curr) {\n        let next = curr.next;\n        curr.next = prev; prev = curr; curr = next;\n    }\n    return prev;\n}', explanation: 'JavaScript list reversal logic.' }
    ],
    'sliding-window': [
        { language: 'cpp', code: 'int maxSum(vector<int>& arr, int k) {\n    int n = arr.size(), windowSum = 0, maxSum = 0;\n    for(int i=0; i<k; i++) windowSum += arr[i];\n    maxSum = windowSum;\n    for(int i=k; i<n; i++) {\n        windowSum += arr[i] - arr[i-k];\n        maxSum = max(maxSum, windowSum);\n    }\n    return maxSum;\n}', explanation: 'Finding the maximum sum of a fixed-size window by sliding it across the array.' },
        { language: 'python', code: 'def max_sum(arr, k):\n    n = len(arr)\n    if n < k: return 0\n    curr_sum = sum(arr[:k])\n    max_val = curr_sum\n    for i in range(n - k):\n        curr_sum = curr_sum - arr[i] + arr[i+k]\n        max_val = max(max_val, curr_sum)\n    return max_val', explanation: 'Python sliding window for max sum subarray.' },
        { language: 'java', code: 'public int maxSum(int[] arr, int k) {\n    int n = arr.length, windowSum = 0, maxSum = 0;\n    for(int i=0; i<k; i++) windowSum += arr[i];\n    maxSum = windowSum;\n    for(int i=k; i<n; i++) {\n        windowSum += arr[i] - arr[i-k];\n        maxSum = Math.max(maxSum, windowSum);\n    }\n    return maxSum;\n}', explanation: 'Java sliding window implementation.' },
        { language: 'c', code: 'int maxSum(int arr[], int n, int k) {\n    int windowSum = 0, maxVal = 0;\n    for(int i=0; i<k; i++) windowSum += arr[i];\n    maxVal = windowSum;\n    for(int i=k; i<n; i++) {\n        windowSum += arr[i] - arr[i-k];\n        if(windowSum > maxVal) maxVal = windowSum;\n    }\n    return maxVal;\n}', explanation: 'C sliding window logic.' },
        { language: 'javascript', code: 'function maxSum(arr, k) {\n    let windowSum = 0, maxVal = 0;\n    for(let i=0; i<k; i++) windowSum += arr[i];\n    maxVal = windowSum;\n    for(let i=k; i<arr.length; i++) {\n        windowSum += arr[i] - arr[i-k];\n        maxVal = Math.max(maxVal, windowSum);\n    }\n    return maxVal;\n}', explanation: 'JS sliding window.' }
    ],
    'stack-queues': [
        { language: 'cpp', code: 'stack<int> st; st.push(1); int x = st.top(); st.pop();\nqueue<int> q; q.push(1); int y = q.front(); q.pop();', explanation: 'Using C++ STL stack and queue containers.' },
        { language: 'python', code: 'stack = [1]; stack.append(2); x = stack.pop()\nfrom collections import deque; q = deque([1]); q.append(2); y = q.popleft()', explanation: 'Python lists as stacks and deque as queues.' },
        { language: 'java', code: 'Stack<Integer> st = new Stack<>(); st.push(1); int x = st.pop();\nQueue<Integer> q = new LinkedList<>(); q.add(1); int y = q.poll();', explanation: 'Java built-in Stack and Queue interface.' },
        { language: 'c', code: 'int stack[100], top = -1;\nvoid push(int x) { stack[++top] = x; }\nint pop() { return stack[top--]; }', explanation: 'Simple array-based stack implementation in C.' },
        { language: 'javascript', code: 'let stack = []; stack.push(1); let x = stack.pop();\nlet queue = []; queue.push(1); let y = queue.shift();', explanation: 'JavaScript arrays easily simulate stacks (push/pop) and queues (push/shift).' }
    ],
    'strings': [
        { language: 'cpp', code: 'bool isPal(string s) {\n    int i = 0, j = s.size()-1;\n    while(i < j) if(s[i++] != s[j--]) return false;\n    return true;\n}', explanation: 'Checking if a string is a palindrome using two pointers.' },
        { language: 'python', code: 'def is_palindrome(s):\n    return s == s[::-1]', explanation: 'Concise palindrome check in Python using slicing.' },
        { language: 'java', code: 'public boolean isPal(String s) {\n    int i = 0, j = s.length()-1;\n    while(i < j) if(s.charAt(i++) != s.charAt(j--)) return false;\n    return true;\n}', explanation: 'Java two-pointer palindrome check.' },
        { language: 'c', code: 'int isPal(char s[]) {\n    int i = 0, j = strlen(s)-1;\n    while(i < j) if(s[i++] != s[j--]) return 0;\n    return 1;\n}', explanation: 'C string palindrome check.' },
        { language: 'javascript', code: 'const isPal = s => s === s.split("").reverse().join("");', explanation: 'JavaScript implementation using array methods.' }
    ]
};

fixTopic('binary-search-trees-topic.json', 'binary-search-trees', 'Binary Search Trees', 'Binary Search Trees are node-based binary tree data structures which have the following properties: The left subtree of a node contains only nodes with keys lesser than the nodes key. The right subtree of a node contains only nodes with keys greater than the nodes key.', examples.bst);
fixTopic('binary-trees-topic.json', 'binary-trees', 'Binary Trees', 'A binary tree is a tree data structure in which each node has at most two children, which are referred to as the left child and the right child.', examples['binary-trees']);
fixTopic('bit-manipulation-topic.json', 'bit-manipulation', 'Bit Manipulation', 'Bit manipulation is the act of algorithmically manipulating bits or other pieces of data shorter than a word.', examples['bit-manipulation']);
fixTopic('graphs-topic.json', 'graphs', 'Graphs', 'A Graph is a non-linear data structure consisting of nodes and edges. The nodes are sometimes also referred to as vertices and the edges are lines or arcs that connect any two nodes in the graph.', examples.graphs);
fixTopic('heaps-topic.json', 'heaps', 'Heaps', 'A Heap is a special Tree-based data structure in which the tree is a complete binary tree.', examples.heaps);
fixTopic('linked-list-topic.json', 'linked-list', 'Linked List', 'A linked list is a linear data structure, in which the elements are not stored at contiguous memory locations.', examples['linked-list']);
fixTopic('sliding-window-topic.json', 'sliding-window', 'Sliding Window', 'Sliding Window problems usually involve finding a range in an array or string that satisfies certain criteria.', examples['sliding-window']);
fixTopic('stack-queues-topic.json', 'stack-queues', 'Stack and Queues', 'Stack and Queues are fundamental linear data structures that follow LIFO and FIFO principles respectively.', examples['stack-queues']);
fixTopic('strings-topic.json', 'strings', 'Strings', 'Strings are sequences of characters. In many programming languages, strings are objects.', examples.strings);
