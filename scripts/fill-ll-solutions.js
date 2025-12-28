
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

const llUpdates = {
    "Introduction to Doubly Linked List": [
        { "language": "python", "code": "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n        self.prev = None\n\ndef constructDLL(arr):\n    if not arr: return None\n    head = Node(arr[0])\n    curr = head\n    for i in range(1, len(arr)):\n        new_node = Node(arr[i])\n        curr.next = new_node\n        new_node.prev = curr\n        curr = new_node\n    return head" },
        { "language": "java", "code": "class Node {\n    int data; Node next, prev;\n    Node(int data) { this.data = data; }\n}\npublic Node constructDLL(int[] arr) {\n    if(arr.length == 0) return null;\n    Node head = new Node(arr[0]);\n    Node curr = head;\n    for(int i=1; i<arr.length; i++) {\n        Node newNode = new Node(arr[i]);\n        curr.next = newNode; newNode.prev = curr; curr = newNode;\n    }\n    return head;\n}" },
        { "language": "c", "code": "struct Node* constructDLL(int arr[], int n) {\n    if (n == 0) return NULL;\n    struct Node* head = createNode(arr[0]);\n    struct Node* curr = head;\n    for(int i=1; i<n; i++) {\n        struct Node* newNode = createNode(arr[i]);\n        curr->next = newNode; newNode->prev = curr; curr = newNode;\n    }\n    return head;\n}" },
        { "language": "javascript", "code": "function constructDLL(arr) {\n    if (!arr.length) return null;\n    let head = new Node(arr[0]);\n    let curr = head;\n    for (let i = 1; i < arr.length; i++) {\n        let newNode = new Node(arr[i]);\n        curr.next = newNode; newNode.prev = curr; curr = newNode;\n    }\n    return head;\n}" }
    ],
    "Delete all occurrences of a key in DLL": [
        { "language": "python", "code": "def deleteAllOccurrences(head, x):\n    curr = head\n    while curr:\n        if curr.data == x:\n            if curr == head: head = curr.next\n            if curr.next: curr.next.prev = curr.prev\n            if curr.prev: curr.prev.next = curr.next\n        curr = curr.next\n    return head" },
        { "language": "java", "code": "public Node deleteAllOccurrences(Node head, int x) {\n    Node curr = head;\n    while (curr != null) {\n        if (curr.data == x) {\n            if (curr == head) head = head.next;\n            if (curr.next != null) curr.next.prev = curr.prev;\n            if (curr.prev != null) curr.prev.next = curr.next;\n        }\n        curr = curr.next;\n    }\n    return head;\n}" },
        { "language": "c", "code": "void deleteAllOccurrences(struct Node** head_ref, int x) {\n    struct Node* curr = *head_ref;\n    while (curr != NULL) {\n        if (curr->data == x) {\n            struct Node* next = curr->next;\n            if (*head_ref == curr) *head_ref = next;\n            if (next != NULL) next->prev = curr->prev;\n            if (curr->prev != NULL) curr->prev->next = next;\n            free(curr); curr = next;\n        } else curr = curr->next;\n    }\n}" },
        { "language": "javascript", "code": "function deleteAllOccurrences(head, x) {\n    let curr = head;\n    while (curr) {\n        if (curr.data === x) {\n            if (curr === head) head = head.next;\n            if (curr.next) curr.next.prev = curr.prev;\n            if (curr.prev) curr.prev.next = curr.next;\n        }\n        curr = curr.next;\n    }\n    return head;\n}" }
    ],
    "Find pairs with given sum in DLL": [
        { "language": "python", "code": "def findPairs(head, target):\n    res = []\n    if not head: return res\n    left = head\n    right = head\n    while right.next: right = right.next\n    while left.data < right.data:\n        s = left.data + right.data\n        if s == target:\n            res.append((left.data, right.data))\n            left = left.next\n            right = right.prev\n        elif s < target: left = left.next\n        else: right = right.prev\n    return res" },
        { "language": "java", "code": "public List<int[]> findPairs(Node head, int target) {\n    List<int[]> pairs = new ArrayList<>();\n    if (head == null) return pairs;\n    Node left = head, right = head;\n    while (right.next != null) right = right.next;\n    while (left.data < right.data) {\n        int sum = left.data + right.data;\n        if (sum == target) {\n            pairs.add(new int[]{left.data, right.data});\n            left = left.next; right = right.prev;\n        } else if (sum < target) left = left.next;\n        else right = right.prev;\n    }\n    return pairs;\n}" },
        { "language": "c", "code": "void findPairs(struct Node* head, int target) {\n    struct Node* left = head;\n    struct Node* right = head;\n    while (right->next != NULL) right = right->next;\n    while (left != NULL && right != NULL && left != right && right->next != left) {\n        if (left->data + right->data == target) {\n            printf(\"(%d, %d)\\n\", left->data, right->data);\n            left = left->next; right = right->prev;\n        } else if (left->data + right->data < target) left = left->next;\n        else right = right->prev;\n    }\n}" },
        { "language": "javascript", "code": "function findPairs(head, target) {\n    let res = [], left = head, right = head;\n    if (!head) return res;\n    while (right.next) right = right.next;\n    while (left.data < right.data) {\n        let sum = left.data + right.data;\n        if (sum === target) {\n            res.push([left.data, right.data]);\n            left = left.next; right = right.prev;\n        } else if (sum < target) left = left.next;\n        else right = right.prev;\n    }\n    return res;\n}" }
    ],
    "Remove duplicates from sorted DLL": [
        { "language": "python", "code": "def removeDuplicates(head):\n    curr = head\n    while curr and curr.next:\n        if curr.data == curr.next.data:\n            duplicate = curr.next\n            curr.next = duplicate.next\n            if duplicate.next: duplicate.next.prev = curr\n        else: curr = curr.next\n    return head" },
        { "language": "java", "code": "public Node removeDuplicates(Node head) {\n    Node curr = head;\n    while (curr != null && curr.next != null) {\n        if (curr.data == curr.next.data) {\n            Node duplicate = curr.next;\n            curr.next = duplicate.next;\n            if (duplicate.next != null) duplicate.next.prev = curr;\n        } else curr = curr.next;\n    }\n    return head;\n}" },
        { "language": "c", "code": "void removeDuplicates(struct Node* head) {\n    struct Node* curr = head;\n    while (curr != NULL && curr->next != NULL) {\n        if (curr->data == curr->next->data) {\n            struct Node* next = curr->next->next;\n            free(curr->next);\n            curr->next = next;\n            if (next != NULL) next->prev = curr;\n        } else curr = curr->next;\n    }\n}" },
        { "language": "javascript", "code": "function removeDuplicates(head) {\n    let curr = head;\n    while (curr && curr.next) {\n        if (curr.data === curr.next.data) {\n            let next = curr.next.next;\n            curr.next = next;\n            if (next) next.prev = curr;\n        } else curr = curr.next;\n    }\n    return head;\n}" }
    ]
};

updateSolutions('linked-list-topic.json', llUpdates);
updateSolutions('curriculum-data.json', llUpdates);
