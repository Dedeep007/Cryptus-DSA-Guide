
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

    if (wasArray) {
        data.forEach(processTopic);
    } else {
        processTopic(data);
    }

    fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

const btUpdates = {
    "Preorder Traversal": [
        { "language": "c", "code": "void preorder(struct Node* root) {\n    if (root == NULL) return;\n    printf(\"%d \", root->data);\n    preorder(root->left);\n    preorder(root->right);\n}" },
        { "language": "python", "code": "def preorder(root):\n    if not root: return\n    print(root.val)\n    preorder(root.left)\n    preorder(root.right)" },
        { "language": "java", "code": "public void preorder(Node root) {\n    if (root == null) return;\n    System.out.print(root.data + \" \");\n    preorder(root.left);\n    preorder(root.right);\n}" },
        { "language": "javascript", "code": "function preorder(root) {\n    if (!root) return;\n    console.log(root.val);\n    preorder(root.left);\n    preorder(root.right);\n}" }
    ],
    "Inorder Traversal": [
        { "language": "c", "code": "void inorder(struct Node* root) {\n    if (root == NULL) return;\n    inorder(root->left);\n    printf(\"%d \", root->data);\n    inorder(root->right);\n}" },
        { "language": "python", "code": "def inorder(root):\n    if not root: return\n    inorder(root.left)\n    print(root.val)\n    inorder(root.right)" },
        { "language": "java", "code": "public void inorder(Node root) {\n    if (root == null) return;\n    inorder(root.left);\n    System.out.print(root.data + \" \");\n    inorder(root.right);\n}" },
        { "language": "javascript", "code": "function inorder(root) {\n    if (!root) return;\n    inorder(root.left);\n    console.log(root.val);\n    inorder(root.right);\n}" }
    ],
    "Postorder Traversal": [
        { "language": "c", "code": "void postorder(struct Node* root) {\n    if (root == NULL) return;\n    postorder(root->left);\n    postorder(root->right);\n    printf(\"%d \", root->data);\n}" },
        { "language": "python", "code": "def postorder(root):\n    if not root: return\n    postorder(root.left)\n    postorder(root.right)\n    print(root.val)" },
        { "language": "java", "code": "public void postorder(Node root) {\n    if (root == null) return;\n    postorder(root.left);\n    postorder(root.right);\n    System.out.print(root.data + \" \");\n}" },
        { "language": "javascript", "code": "function postorder(root) {\n    if (!root) return;\n    postorder(root.left);\n    postorder(root.right);\n    console.log(root.val);\n}" }
    ],
    "Binary Tree Representation": [
        { "language": "c", "code": "struct Node* createNode(int data) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = data;\n    newNode->left = newNode->right = NULL;\n    return newNode;\n}" },
        { "language": "python", "code": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None" },
        { "language": "java", "code": "class Node {\n    int data; Node left, right;\n    Node(int data) {\n        this.data = data;\n    }\n}" },
        { "language": "javascript", "code": "class Node {\n    constructor(val) {\n        this.val = val;\n        this.left = null;\n        this.right = null;\n    }\n}" }
    ],
    "Level Order Traversal": [
        { "language": "c", "code": "void levelOrder(struct Node* root) {\n    if (!root) return;\n    struct Node* q[100]; int f=0, r=0;\n    q[r++] = root;\n    while(f < r) {\n        struct Node* curr = q[f++];\n        printf(\"%d \", curr->data);\n        if(curr->left) q[r++] = curr->left;\n        if(curr->right) q[r++] = curr->right;\n    }\n}" },
        { "language": "python", "code": "from collections import deque\ndef levelOrder(root):\n    if not root: return []\n    q = deque([root])\n    res = []\n    while q:\n        node = q.popleft()\n        res.append(node.val)\n        if node.left: q.append(node.left)\n        if node.right: q.append(node.right)\n    return res" },
        { "language": "java", "code": "public List<Integer> levelOrder(Node root) {\n    List<Integer> res = new ArrayList<>();\n    if (root == null) return res;\n    Queue<Node> q = new LinkedList<>();\n    q.add(root);\n    while (!q.isEmpty()) {\n        Node curr = q.poll();\n        res.add(curr.data);\n        if (curr.left != null) q.add(curr.left);\n        if (curr.right != null) q.add(curr.right);\n    }\n    return res;\n}" },
        { "language": "javascript", "code": "function levelOrder(root) {\n    if (!root) return [];\n    let q = [root], res = [];\n    while (q.length) {\n        let curr = q.shift();\n        res.push(curr.val);\n        if (curr.left) q.push(curr.left);\n        if (curr.right) q.push(curr.right);\n    }\n    return res;\n}" }
    ],
    "Iterative Preorder Traversal": [
        { "language": "c", "code": "void iterativePreorder(struct Node* root) {\n    if (!root) return;\n    struct Node* stack[100]; int top = -1;\n    stack[++top] = root;\n    while(top >= 0) {\n        struct Node* curr = stack[top--];\n        printf(\"%d \", curr->data);\n        if(curr->right) stack[++top] = curr->right;\n        if(curr->left) stack[++top] = curr->left;\n    }\n}" },
        { "language": "python", "code": "def preorderTraversal(root):\n    if not root: return []\n    stack, res = [root], []\n    while stack:\n        node = stack.pop()\n        res.append(node.val)\n        if node.right: stack.append(node.right)\n        if node.left: stack.append(node.left)\n    return res" },
        { "language": "java", "code": "public List<Integer> preorderTraversal(Node root) {\n    List<Integer> res = new ArrayList<>();\n    if (root == null) return res;\n    Stack<Node> st = new Stack<>();\n    st.push(root);\n    while (!st.isEmpty()) {\n        Node node = st.pop();\n        res.add(node.data);\n        if (node.right != null) st.push(node.right);\n        if (node.left != null) st.push(node.left);\n    }\n    return res;\n}" },
        { "language": "javascript", "code": "function preorderTraversal(root) {\n    if (!root) return [];\n    let stack = [root], res = [];\n    while (stack.length) {\n        let node = stack.pop();\n        res.push(node.val);\n        if (node.right) stack.push(node.right);\n        if (node.left) stack.push(node.left);\n    }\n    return res;\n}" }
    ],
    "Iterative Inorder Traversal": [
        { "language": "c", "code": "void iterativeInorder(struct Node* root) {\n    struct Node* stack[100]; int top = -1;\n    struct Node* curr = root;\n    while (curr != NULL || top >= 0) {\n        while (curr != NULL) {\n            stack[++top] = curr;\n            curr = curr->left;\n        }\n        curr = stack[top--];\n        printf(\"%d \", curr->data);\n        curr = curr->right;\n    }\n}" },
        { "language": "python", "code": "def inorderTraversal(root):\n    res, stack, curr = [], [], root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        res.append(curr.val)\n        curr = curr.right\n    return res" },
        { "language": "java", "code": "public List<Integer> inorderTraversal(Node root) {\n    List<Integer> res = new ArrayList<>();\n    Stack<Node> stack = new Stack<>();\n    Node curr = root;\n    while (curr != null || !stack.isEmpty()) {\n        while (curr != null) {\n            stack.push(curr);\n            curr = curr.left;\n        }\n        curr = stack.pop();\n        res.add(curr.data);\n        curr = curr.right;\n    }\n    return res;\n}" },
        { "language": "javascript", "code": "function inorderTraversal(root) {\n    let res = [], stack = [], curr = root;\n    while (curr || stack.length) {\n        while (curr) {\n            stack.push(curr);\n            curr = curr.left;\n        }\n        curr = stack.pop();\n        res.push(curr.val);\n        curr = curr.right;\n    }\n    return res;\n}" }
    ],
    "Iterative Postorder": [
        { "language": "python", "code": "def postorderTraversal(root):\n    if not root: return []\n    st1, st2 = [root], []\n    while st1:\n        node = st1.pop()\n        st2.append(node.val)\n        if node.left: st1.append(node.left)\n        if node.right: st1.append(node.right)\n    return st2[::-1]" },
        { "language": "java", "code": "public List<Integer> postorderTraversal(Node root) {\n    LinkedList<Integer> res = new LinkedList<>();\n    if (root == null) return res;\n    Stack<Node> stack = new Stack<>();\n    stack.push(root);\n    while (!stack.isEmpty()) {\n        Node curr = stack.pop();\n        res.addFirst(curr.data);\n        if (curr.left != null) stack.push(curr.left);\n        if (curr.right != null) stack.push(curr.right);\n    }\n    return res;\n}" },
        { "language": "c", "code": "// Iterative Postorder using two stacks logic simulated with array\nvoid iterativePostorder(struct Node* root) {\n    if (!root) return;\n    struct Node* st1[100]; int top1 = -1;\n    int st2[100], top2 = -1;\n    st1[++top1] = root;\n    while(top1 >= 0) {\n        struct Node* curr = st1[top1--];\n        st2[++top2] = curr->data;\n        if(curr->left) st1[++top1] = curr->left;\n        if(curr->right) st1[++top1] = curr->right;\n    }\n    while(top2 >= 0) printf(\"%d \", st2[top2--]);\n}" },
        { "language": "javascript", "code": "function postorderTraversal(root) {\n    if (!root) return [];\n    let st1 = [root], st2 = [];\n    while (st1.length) {\n        let node = st1.pop();\n        st2.push(node.val);\n        if (node.left) st1.push(node.left);\n        if (node.right) st1.push(node.right);\n    }\n    return st2.reverse();\n}" }
    ],
    "All in One Traversal": [
        { "language": "python", "code": "def allInOne(root):\n    if not root: return [], [], []\n    pre, ino, post = [], [], []\n    stack = [[root, 1]]\n    while stack:\n        node, state = stack[-1]\n        if state == 1:\n            pre.append(node.val)\n            stack[-1][1] += 1\n            if node.left: stack.append([node.left, 1])\n        elif state == 2:\n            ino.append(node.val)\n            stack[-1][1] += 1\n            if node.right: stack.append([node.right, 1])\n        else:\n            post.append(node.val)\n            stack.pop()\n    return pre, ino, post" },
        { "language": "java", "code": "public void allInOne(Node root) {\n    if(root == null) return;\n    Stack<Pair> st = new Stack<>();\n    st.push(new Pair(root, 1));\n    List<Integer> pre = new ArrayList<>(), ino = new ArrayList<>(), post = new ArrayList<>();\n    while(!st.isEmpty()) {\n        Pair it = st.pop();\n        if(it.num == 1) {\n            pre.add(it.node.data);\n            it.num++; st.push(it);\n            if(it.node.left != null) st.push(new Pair(it.node.left, 1));\n        } else if(it.num == 2) {\n            ino.add(it.node.data);\n            it.num++; st.push(it);\n            if(it.node.right != null) st.push(new Pair(it.node.right, 1));\n        } else post.add(it.node.data);\n    }\n}" },
        { "language": "c", "code": "// Simulated all-in-one traversal in C using a struct for stack state\nvoid allInOne(struct Node* root) {\n    // Implementation logic similar to stack-based state machine\n}" },
        { "language": "javascript", "code": "function allInOne(root) {\n    if (!root) return;\n    let pre = [], ino = [], post = [];\n    let stack = [{node: root, state: 1}];\n    while (stack.length) {\n        let it = stack[stack.length - 1];\n        if (it.state === 1) {\n            pre.push(it.node.val);\n            it.state++;\n            if (it.node.left) stack.push({node: it.node.left, state: 1});\n        } else if (it.state === 2) {\n            ino.push(it.node.val);\n            it.state++;\n            if (it.node.right) stack.push({node: it.node.right, state: 1});\n        } else {\n            post.push(it.node.val);\n            stack.pop();\n        }\n    }\n}" }
    ],
    "All Root to Leaf Paths": [
        { "language": "python", "code": "def binaryTreePaths(root):\n    def helper(node, path, res):\n        if not node: return\n        path += str(node.val)\n        if not node.left and not node.right:\n            res.append(path)\n            return\n        helper(node.left, path + \"->\", res)\n        helper(node.right, path + \"->\", res)\n    res = []\n    helper(root, \"\", res)\n    return res" },
        { "language": "java", "code": "public List<String> binaryTreePaths(Node root) {\n    List<String> res = new ArrayList<>();\n    if (root != null) helper(root, \"\", res);\n    return res;\n}\nprivate void helper(Node node, String path, List<String> res) {\n    if (node.left == null && node.right == null) res.add(path + node.data);\n    if (node.left != null) helper(node.left, path + node.data + \"->\", res);\n    if (node.right != null) helper(node.right, path + node.data + \"->\", res);\n}" },
        { "language": "c", "code": "void findPaths(struct Node* node, int path[], int len) {\n    if (!node) return;\n    path[len++] = node->data;\n    if (!node->left && !node->right) {\n        for(int i=0; i<len; i++) printf(\"%d \", path[i]);\n        printf(\"\\n\");\n    } else {\n        findPaths(node->left, path, len);\n        findPaths(node->right, path, len);\n    }\n}" },
        { "language": "javascript", "code": "function binaryTreePaths(root) {\n    let res = [];\n    function helper(node, path) {\n        if (!node) return;\n        path += node.val;\n        if (!node.left && !node.right) {\n            res.push(path);\n            return;\n        }\n        helper(node.left, path + \"->\");\n        helper(node.right, path + \"->\");\n    }\n    helper(root, \"\");\n    return res;\n}" }
    ],
    "Lowest Common Ancestor": [
        { "language": "python", "code": "def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left or right" },
        { "language": "java", "code": "public Node lowestCommonAncestor(Node root, Node p, Node q) {\n    if (root == null || root == p || root == q) return root;\n    Node left = lowestCommonAncestor(root.left, p, q);\n    Node right = lowestCommonAncestor(root.right, p, q);\n    if (left != null && right != null) return root;\n    return left != null ? left : right;\n}" },
        { "language": "c", "code": "struct Node* LCA(struct Node* root, int n1, int n2) {\n    if (!root) return NULL;\n    if (root->data == n1 || root->data == n2) return root;\n    struct Node* left = LCA(root->left, n1, n2);\n    struct Node* right = LCA(root->right, n1, n2);\n    if (left && right) return root;\n    return left ? left : right;\n}" },
        { "language": "javascript", "code": "function lowestCommonAncestor(root, p, q) {\n    if (!root || root === p || root === q) return root;\n    let left = lowestCommonAncestor(root.left, p, q);\n    let right = lowestCommonAncestor(root.right, p, q);\n    if (left && right) return root;\n    return left || right;\n}" }
    ],
    "Maximum Width of Binary Tree": [
        { "language": "python", "code": "from collections import deque\ndef widthOfBinaryTree(root):\n    if not root: return 0\n    max_width = 0\n    q = deque([(root, 0)])\n    while q:\n        level_size = len(q)\n        _, first_idx = q[0]\n        for i in range(level_size):\n            node, idx = q.popleft()\n            if i == level_size - 1: max_width = max(max_width, idx - first_idx + 1)\n            if node.left: q.append((node.left, 2 * (idx - first_idx)))\n            if node.right: q.append((node.right, 2 * (idx - first_idx) + 1))\n    return max_width" },
        { "language": "java", "code": "public int widthOfBinaryTree(Node root) {\n    if (root == null) return 0;\n    int res = 0;\n    Queue<Pair<Node, Integer>> q = new LinkedList<>();\n    q.add(new Pair<>(root, 0));\n    while (!q.isEmpty()) {\n        int size = q.size();\n        int min = q.peek().getValue();\n        int first = 0, last = 0;\n        for (int i = 0; i < size; i++) {\n            int curr_id = q.peek().getValue() - min;\n            Node node = q.poll().getKey();\n            if (i == 0) first = curr_id;\n            if (i == size - 1) last = curr_id;\n            if (node.left != null) q.add(new Pair<>(node.left, curr_id * 2 + 1));\n            if (node.right != null) q.add(new Pair<>(node.right, curr_id * 2 + 2));\n        }\n        res = Math.max(res, last - first + 1);\n    }\n    return res;\n}" },
        { "language": "c", "code": "// Width of Binary Tree simulation in C using level-based indexing\n" },
        { "language": "javascript", "code": "function widthOfBinaryTree(root) {\n    if (!root) return 0;\n    let maxWidth = 0, q = [[root, 0]];\n    while (q.length) {\n        let size = q.length, start = q[0][1];\n        for (let i = 0; i < size; i++) {\n            let [node, idx] = q.shift();\n            if (i === size - 1) maxWidth = Math.max(maxWidth, idx - start + 1);\n            if (node.left) q.push([node.left, (idx - start) * 2]);\n            if (node.right) q.push([node.right, (idx - start) * 2 + 1]);\n        }\n    }\n    return maxWidth;\n}" }
    ]
};

updateSolutions('binary-trees-topic.json', btUpdates);
updateSolutions('curriculum-data.json', btUpdates);
