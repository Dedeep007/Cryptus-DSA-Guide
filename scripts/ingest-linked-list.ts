import 'dotenv/config';
import { db } from "../server/db";
import { topics, problems, codeSnippets, topicExamples } from "../shared/schema";

const linkedListData = {
  topic: {
    title: "Linked List",
    slug: "linkedlist",
    description: "Linked Lists are linear data structures where elements are stored in nodes, and each node points to the next node in the sequence. They provide dynamic memory allocation and efficient insertions/deletions compared to arrays.",
    order: 4,
    explanation: "A linked list is a linear data structure consisting of nodes where each node contains a data field and a reference (link) to the next node in the sequence. Unlike arrays, linked lists do not store elements in contiguous memory locations. The first node is called the head, and the last node's next pointer is null. Linked lists are dynamic data structures that can grow or shrink as needed. Common operations include traversal, insertion, deletion, searching, and reversal. They are particularly useful when frequent insertions and deletions are required. Types of linked lists include singly linked lists, doubly linked lists, and circular linked lists. Understanding linked lists is crucial for mastering more complex data structures and algorithms.",
    codeExamples: {
      cpp: "#include <iostream>\nusing namespace std;\n\nstruct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n\nvoid traverse(Node* head) {\n    Node* temp = head;\n    while (temp != nullptr) {\n        cout << temp->data << \" \";\n        temp = temp->next;\n    }\n    cout << endl;\n}\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    traverse(head);\n    return 0;\n}",
      c: "#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node* next;\n};\n\nstruct Node* createNode(int val) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = val;\n    newNode->next = NULL;\n    return newNode;\n}\n\nvoid traverse(struct Node* head) {\n    struct Node* temp = head;\n    while (temp != NULL) {\n        printf(\"%d \", temp->data);\n        temp = temp->next;\n    }\n    printf(\"\\n\");\n}\n\nint main() {\n    struct Node* head = createNode(1);\n    head->next = createNode(2);\n    head->next->next = createNode(3);\n    traverse(head);\n    return 0;\n}",
      python: "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\ndef traverse(head):\n    temp = head\n    while temp:\n        print(temp.data, end=' ')\n        temp = temp.next\n    print()\n\n# Create linked list: 1 -> 2 -> 3\nhead = Node(1)\nhead.next = Node(2)\nhead.next.next = Node(3)\ntraverse(head)",
      java: "class Node {\n    int data;\n    Node next;\n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\npublic class LinkedList {\n    static void traverse(Node head) {\n        Node temp = head;\n        while (temp != null) {\n            System.out.print(temp.data + \" \");\n            temp = temp.next;\n        }\n        System.out.println();\n    }\n\n    public static void main(String[] args) {\n        Node head = new Node(1);\n        head.next = new Node(2);\n        head.next.next = new Node(3);\n        traverse(head);\n    }\n}",
      javascript: "class Node {\n    constructor(data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nfunction traverse(head) {\n    let temp = head;\n    while (temp) {\n        console.log(temp.data);\n        temp = temp.next;\n    }\n}\n\n// Create linked list: 1 -> 2 -> 3\nlet head = new Node(1);\nhead.next = new Node(2);\nhead.next.next = new Node(3);\ntraverse(head);"
    }
  },
  problems: [
    {
      title: "Introduction to Linked List",
      difficulty: "easy",
      problemStatement: "Create a singly linked list with nodes containing integer data. Implement a function to create a linked list from an array and another to print the linked list.",
      examples: [
        {
          input: "[1, 2, 3, 4, 5]",
          output: "1 2 3 4 5",
          explanation: "The linked list is created with nodes 1->2->3->4->5 and printed."
        }
      ],
      testCases: [
        { input: "[1,2,3]", output: "1 2 3" },
        { input: "[5]", output: "5" },
        { input: "[]", output: "" }
      ],
      conceptExplanation: "A linked list is a data structure where each element (node) contains data and a reference to the next node. The first node is called the head.",
      workedExample: "To create from array [1,2,3]: Create node1(1), node2(2), node3(3). Set node1.next = node2, node2.next = node3. Head = node1.",
      initialCode: "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\ndef createLinkedList(arr):\n    # Your code here\n\ndef printLinkedList(head):\n    # Your code here",
      solutions: {
        cpp: "struct Node {\n    int data;\n    Node* next;\n    Node(int val) : data(val), next(nullptr) {}\n};\n\nNode* createLinkedList(vector<int>& arr) {\n    if (arr.empty()) return nullptr;\n    Node* head = new Node(arr[0]);\n    Node* temp = head;\n    for (int i = 1; i < arr.size(); i++) {\n        temp->next = new Node(arr[i]);\n        temp = temp->next;\n    }\n    return head;\n}\n\nvoid printLinkedList(Node* head) {\n    Node* temp = head;\n    while (temp) {\n        cout << temp->data << \" \";\n        temp = temp->next;\n    }\n    cout << endl;\n}",
        c: "struct Node {\n    int data;\n    struct Node* next;\n};\n\nstruct Node* createNode(int val) {\n    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));\n    newNode->data = val;\n    newNode->next = NULL;\n    return newNode;\n}\n\nstruct Node* createLinkedList(int arr[], int n) {\n    if (n == 0) return NULL;\n    struct Node* head = createNode(arr[0]);\n    struct Node* temp = head;\n    for (int i = 1; i < n; i++) {\n        temp->next = createNode(arr[i]);\n        temp = temp->next;\n    }\n    return head;\n}\n\nvoid printLinkedList(struct Node* head) {\n    struct Node* temp = head;\n    while (temp) {\n        printf(\"%d \", temp->data);\n        temp = temp->next;\n    }\n    printf(\"\\n\");\n}",
        python: "class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\ndef createLinkedList(arr):\n    if not arr:\n        return None\n    head = Node(arr[0])\n    temp = head\n    for val in arr[1:]:\n        temp.next = Node(val)\n        temp = temp.next\n    return head\n\ndef printLinkedList(head):\n    temp = head\n    while temp:\n        print(temp.data, end=' ')\n        temp = temp.next\n    print()",
        java: "class Node {\n    int data;\n    Node next;\n    Node(int data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\npublic class Solution {\n    static Node createLinkedList(int[] arr) {\n        if (arr.length == 0) return null;\n        Node head = new Node(arr[0]);\n        Node temp = head;\n        for (int i = 1; i < arr.length; i++) {\n            temp.next = new Node(arr[i]);\n            temp = temp.next;\n        }\n        return head;\n    }\n\n    static void printLinkedList(Node head) {\n        Node temp = head;\n        while (temp != null) {\n            System.out.print(temp.data + \" \");\n            temp = temp.next;\n        }\n        System.out.println();\n    }\n}",
        javascript: "class Node {\n    constructor(data) {\n        this.data = data;\n        this.next = null;\n    }\n}\n\nfunction createLinkedList(arr) {\n    if (arr.length === 0) return null;\n    let head = new Node(arr[0]);\n    let temp = head;\n    for (let i = 1; i < arr.length; i++) {\n        temp.next = new Node(arr[i]);\n        temp = temp.next;\n    }\n    return head;\n}\n\nfunction printLinkedList(head) {\n    let temp = head;\n    while (temp) {\n        console.log(temp.data);\n        temp = temp.next;\n    }\n}"
      }
    },
    {
      title: "Traversal of Linked List",
      difficulty: "easy",
      problemStatement: "Given the head of a singly linked list, write a function to traverse the linked list and return a list of all node values.",
      examples: [
        {
          input: "1 -> 2 -> 3 -> 4 -> 5",
          output: "[1, 2, 3, 4, 5]",
          explanation: "Traverse from head to end, collecting each node's data."
        }
      ],
      testCases: [
        { input: "1->2->3", output: "[1,2,3]" },
        { input: "5", output: "[5]" },
        { input: "null", output: "[]" }
      ],
      conceptExplanation: "Traversal involves starting from the head and following the next pointers until reaching null.",
      workedExample: "Start at head (1), add 1 to list, move to 2, add 2, move to 3, add 3, etc., until null.",
      initialCode: "def traverseLinkedList(head):\n    # Your code here\n    pass",
      solutions: {
        cpp: "vector<int> traverseLinkedList(Node* head) {\n    vector<int> result;\n    Node* temp = head;\n    while (temp) {\n        result.push_back(temp->data);\n        temp = temp->next;\n    }\n    return result;\n}",
        c: "int* traverseLinkedList(struct Node* head, int* size) {\n    int count = 0;\n    struct Node* temp = head;\n    while (temp) {\n        count++;\n        temp = temp->next;\n    }\n    int* result = (int*)malloc(count * sizeof(int));\n    temp = head;\n    for (int i = 0; i < count; i++) {\n        result[i] = temp->data;\n        temp = temp->next;\n    }\n    *size = count;\n    return result;\n}",
        python: "def traverseLinkedList(head):\n    result = []\n    temp = head\n    while temp:\n        result.append(temp.data)\n        temp = temp.next\n    return result",
        java: "public List<Integer> traverseLinkedList(Node head) {\n    List<Integer> result = new ArrayList<>();\n    Node temp = head;\n    while (temp != null) {\n        result.add(temp.data);\n        temp = temp.next;\n    }\n    return result;\n}",
        javascript: "function traverseLinkedList(head) {\n    let result = [];\n    let temp = head;\n    while (temp) {\n        result.push(temp.data);\n        temp = temp.next;\n    }\n    return result;\n}"
      }
    },
    {
      title: "Insert at Beginning",
      difficulty: "easy",
      problemStatement: "Given the head of a linked list and a value, insert a new node with the given value at the beginning of the linked list.",
      examples: [
        {
          input: "head = 1->2->3, value = 0",
          output: "0->1->2->3",
          explanation: "New node 0 is inserted at the beginning."
        }
      ],
      testCases: [
        { input: "1->2->3, 0", output: "0->1->2->3" },
        { input: "null, 5", output: "5" },
        { input: "1, 2", output: "2->1" }
      ],
      conceptExplanation: "To insert at beginning, create a new node, set its next to current head, and update head to new node.",
      workedExample: "Create newNode(0), newNode.next = head (1->2->3), head = newNode (0->1->2->3).",
      initialCode: "def insertAtBeginning(head, value):\n    # Your code here",
      solutions: {
        cpp: "Node* insertAtBeginning(Node* head, int value) {\n    Node* newNode = new Node(value);\n    newNode->next = head;\n    return newNode;\n}",
        c: "struct Node* insertAtBeginning(struct Node* head, int value) {\n    struct Node* newNode = createNode(value);\n    newNode->next = head;\n    return newNode;\n}",
        python: "def insertAtBeginning(head, value):\n    newNode = Node(value)\n    newNode.next = head\n    return newNode",
        java: "public Node insertAtBeginning(Node head, int value) {\n    Node newNode = new Node(value);\n    newNode.next = head;\n    return newNode;\n}",
        javascript: "function insertAtBeginning(head, value) {\n    let newNode = new Node(value);\n    newNode.next = head;\n    return newNode;\n}"
      }
    },
    {
      title: "Insert at End",
      difficulty: "easy",
      problemStatement: "Given the head of a linked list and a value, insert a new node with the given value at the end of the linked list.",
      examples: [
        {
          input: "head = 1->2->3, value = 4",
          output: "1->2->3->4",
          explanation: "New node 4 is inserted at the end."
        }
      ],
      testCases: [
        { input: "1->2->3, 4", output: "1->2->3->4" },
        { input: "null, 5", output: "5" },
        { input: "1, 2", output: "1->2" }
      ],
      conceptExplanation: "To insert at end, traverse to the last node, create new node, and set last.next to new node.",
      workedExample: "Traverse to last node (3), create newNode(4), 3.next = newNode.",
      initialCode: "def insertAtEnd(head, value):\n    # Your code here",
      solutions: {
        cpp: "Node* insertAtEnd(Node* head, int value) {\n    Node* newNode = new Node(value);\n    if (!head) return newNode;\n    Node* temp = head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n    return head;\n}",
        c: "struct Node* insertAtEnd(struct Node* head, int value) {\n    struct Node* newNode = createNode(value);\n    if (!head) return newNode;\n    struct Node* temp = head;\n    while (temp->next) temp = temp->next;\n    temp->next = newNode;\n    return head;\n}",
        python: "def insertAtEnd(head, value):\n    newNode = Node(value)\n    if not head:\n        return newNode\n    temp = head\n    while temp.next:\n        temp = temp.next\n    temp.next = newNode\n    return head",
        java: "public Node insertAtEnd(Node head, int value) {\n    Node newNode = new Node(value);\n    if (head == null) return newNode;\n    Node temp = head;\n    while (temp.next != null) temp = temp.next;\n    temp.next = newNode;\n    return head;\n}",
        javascript: "function insertAtEnd(head, value) {\n    let newNode = new Node(value);\n    if (!head) return newNode;\n    let temp = head;\n    while (temp.next) temp = temp.next;\n    temp.next = newNode;\n    return head;\n}"
      }
    },
    {
      title: "Delete from Beginning",
      difficulty: "easy",
      problemStatement: "Given the head of a linked list, delete the first node and return the new head.",
      examples: [
        {
          input: "1->2->3",
          output: "2->3",
          explanation: "First node 1 is deleted, new head is 2."
        }
      ],
      testCases: [
        { input: "1->2->3", output: "2->3" },
        { input: "5", output: "null" },
        { input: "null", output: "null" }
      ],
      conceptExplanation: "To delete from beginning, update head to head.next, and free the old head if necessary.",
      workedExample: "head = head.next (2->3), delete old head (1).",
      initialCode: "def deleteFromBeginning(head):\n    # Your code here",
      solutions: {
        cpp: "Node* deleteFromBeginning(Node* head) {\n    if (!head) return nullptr;\n    Node* temp = head;\n    head = head->next;\n    delete temp;\n    return head;\n}",
        c: "struct Node* deleteFromBeginning(struct Node* head) {\n    if (!head) return NULL;\n    struct Node* temp = head;\n    head = head->next;\n    free(temp);\n    return head;\n}",
        python: "def deleteFromBeginning(head):\n    if not head:\n        return None\n    return head.next",
        java: "public Node deleteFromBeginning(Node head) {\n    if (head == null) return null;\n    return head.next;\n}",
        javascript: "function deleteFromBeginning(head) {\n    if (!head) return null;\n    return head.next;\n}"
      }
    },
    {
      title: "Delete from End",
      difficulty: "easy",
      problemStatement: "Given the head of a linked list, delete the last node and return the head.",
      examples: [
        {
          input: "1->2->3",
          output: "1->2",
          explanation: "Last node 3 is deleted."
        }
      ],
      testCases: [
        { input: "1->2->3", output: "1->2" },
        { input: "5", output: "null" },
        { input: "null", output: "null" }
      ],
      conceptExplanation: "To delete from end, traverse to second last node, set its next to null, and free the last node.",
      workedExample: "Traverse to node 2, 2.next = null, delete 3.",
      initialCode: "def deleteFromEnd(head):\n    # Your code here",
      solutions: {
        cpp: "Node* deleteFromEnd(Node* head) {\n    if (!head || !head->next) return nullptr;\n    Node* temp = head;\n    while (temp->next->next) temp = temp->next;\n    delete temp->next;\n    temp->next = nullptr;\n    return head;\n}",
        c: "struct Node* deleteFromEnd(struct Node* head) {\n    if (!head || !head->next) return NULL;\n    struct Node* temp = head;\n    while (temp->next->next) temp = temp->next;\n    free(temp->next);\n    temp->next = NULL;\n    return head;\n}",
        python: "def deleteFromEnd(head):\n    if not head or not head.next:\n        return None\n    temp = head\n    while temp.next.next:\n        temp = temp.next\n    temp.next = None\n    return head",
        java: "public Node deleteFromEnd(Node head) {\n    if (head == null || head.next == null) return null;\n    Node temp = head;\n    while (temp.next.next != null) temp = temp.next;\n    temp.next = null;\n    return head;\n}",
        javascript: "function deleteFromEnd(head) {\n    if (!head || !head.next) return null;\n    let temp = head;\n    while (temp.next.next) temp = temp.next;\n    temp.next = null;\n    return head;\n}"
      }
    },
    {
      title: "Search in Linked List",
      difficulty: "easy",
      problemStatement: "Given the head of a linked list and a target value, return true if the value exists in the list, false otherwise.",
      examples: [
        {
          input: "1->2->3, target=2",
          output: "true",
          explanation: "2 exists in the list."
        }
      ],
      testCases: [
        { input: "1->2->3, 2", output: "true" },
        { input: "1->2->3, 4", output: "false" },
        { input: "5, 5", output: "true" }
      ],
      conceptExplanation: "Traverse the list, check if any node's data matches the target.",
      workedExample: "Start at 1, 1 != 2, move to 2, 2 == 2, return true.",
      initialCode: "def searchLinkedList(head, target):\n    # Your code here",
      solutions: {
        cpp: "bool searchLinkedList(Node* head, int target) {\n    Node* temp = head;\n    while (temp) {\n        if (temp->data == target) return true;\n        temp = temp->next;\n    }\n    return false;\n}",
        c: "bool searchLinkedList(struct Node* head, int target) {\n    struct Node* temp = head;\n    while (temp) {\n        if (temp->data == target) return true;\n        temp = temp->next;\n    }\n    return false;\n}",
        python: "def searchLinkedList(head, target):\n    temp = head\n    while temp:\n        if temp.data == target:\n            return True\n        temp = temp.next\n    return False",
        java: "public boolean searchLinkedList(Node head, int target) {\n    Node temp = head;\n    while (temp != null) {\n        if (temp.data == target) return true;\n        temp = temp.next;\n    }\n    return false;\n}",
        javascript: "function searchLinkedList(head, target) {\n    let temp = head;\n    while (temp) {\n        if (temp.data === target) return true;\n        temp = temp.next;\n    }\n    return false;\n}"
      }
    },
    {
      title: "Reverse Linked List",
      difficulty: "medium",
      problemStatement: "Given the head of a singly linked list, reverse the list and return the new head.",
      examples: [
        {
          input: "1->2->3->4->5",
          output: "5->4->3->2->1",
          explanation: "The list is reversed."
        }
      ],
      testCases: [
        { input: "1->2->3", output: "3->2->1" },
        { input: "1", output: "1" },
        { input: "null", output: "null" }
      ],
      conceptExplanation: "Use three pointers: prev, curr, next. Iterate through the list, reversing the next pointers.",
      workedExample: "Initialize prev=null, curr=1, next=2. Set 1.next=null, prev=1, curr=2, next=3. Set 2.next=1, prev=2, curr=3, next=4. And so on.",
      initialCode: "def reverseLinkedList(head):\n    # Your code here",
      solutions: {
        cpp: "Node* reverseLinkedList(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n    while (curr) {\n        Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
        c: "struct Node* reverseLinkedList(struct Node* head) {\n    struct Node* prev = NULL;\n    struct Node* curr = head;\n    while (curr) {\n        struct Node* next = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
        python: "def reverseLinkedList(head):\n    prev = None\n    curr = head\n    while curr:\n        next_node = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_node\n    return prev",
        java: "public Node reverseLinkedList(Node head) {\n    Node prev = null;\n    Node curr = head;\n    while (curr != null) {\n        Node next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}",
        javascript: "function reverseLinkedList(head) {\n    let prev = null;\n    let curr = head;\n    while (curr) {\n        let next = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = next;\n    }\n    return prev;\n}"
      }
    },
    {
      title: "Detect Cycle in Linked List",
      difficulty: "medium",
      problemStatement: "Given the head of a linked list, determine if there is a cycle in the list.",
      examples: [
        {
          input: "1->2->3->2 (cycle)",
          output: "true",
          explanation: "There is a cycle in the list."
        }
      ],
      testCases: [
        { input: "1->2->3->1 (cycle)", output: "true" },
        { input: "1->2->3", output: "false" },
        { input: "1", output: "false" }
      ],
      conceptExplanation: "Use Floyd's cycle detection algorithm with slow and fast pointers. If they meet, there's a cycle.",
      workedExample: "Slow moves 1 step, fast 2 steps. If cycle, they meet eventually.",
      initialCode: "def hasCycle(head):\n    # Your code here",
      solutions: {
        cpp: "bool hasCycle(Node* head) {\n    if (!head) return false;\n    Node* slow = head;\n    Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
        c: "bool hasCycle(struct Node* head) {\n    if (!head) return false;\n    struct Node* slow = head;\n    struct Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
        python: "def hasCycle(head):\n    if not head:\n        return False\n    slow = head\n    fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            return True\n    return False",
        java: "public boolean hasCycle(Node head) {\n    if (head == null) return false;\n    Node slow = head;\n    Node fast = head;\n    while (fast.next != null && fast.next.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}",
        javascript: "function hasCycle(head) {\n    if (!head) return false;\n    let slow = head;\n    let fast = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}"
      }
    },
    {
      title: "Remove Cycle from Linked List",
      difficulty: "medium",
      problemStatement: "Given the head of a linked list with a cycle, remove the cycle and return the head.",
      examples: [
        {
          input: "1->2->3->2 (cycle)",
          output: "1->2->3",
          explanation: "Cycle is removed."
        }
      ],
      testCases: [
        { input: "1->2->3->1 (cycle)", output: "1->2->3" },
        { input: "1->2->1 (cycle)", output: "1->2" }
      ],
      conceptExplanation: "First detect cycle using Floyd's algorithm, then find cycle start, then remove cycle by setting last node.next = null.",
      workedExample: "Find meeting point, then move slow to head, move both until they meet at cycle start, then find last node in cycle and set next to null.",
      initialCode: "def removeCycle(head):\n    # Your code here",
      solutions: {
        cpp: "void removeCycle(Node* head) {\n    if (!head) return;\n    Node* slow = head;\n    Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) break;\n    }\n    if (slow != fast) return;\n    slow = head;\n    while (slow->next != fast->next) {\n        slow = slow->next;\n        fast = fast->next;\n    }\n    fast->next = nullptr;\n}",
        c: "void removeCycle(struct Node* head) {\n    if (!head) return;\n    struct Node* slow = head;\n    struct Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) break;\n    }\n    if (slow != fast) return;\n    slow = head;\n    while (slow->next != fast->next) {\n        slow = slow->next;\n        fast = fast->next;\n    }\n    fast->next = NULL;\n}",
        python: "def removeCycle(head):\n    if not head:\n        return\n    slow = head\n    fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast:\n            break\n    else:\n        return\n    slow = head\n    while slow.next != fast.next:\n        slow = slow.next\n        fast = fast.next\n    fast.next = None",
        java: "public void removeCycle(Node head) {\n    if (head == null) return;\n    Node slow = head;\n    Node fast = head;\n    while (fast.next != null && fast.next.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) break;\n    }\n    if (slow != fast) return;\n    slow = head;\n    while (slow.next != fast.next) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n    fast.next = null;\n}",
        javascript: "function removeCycle(head) {\n    if (!head) return;\n    let slow = head;\n    let fast = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) break;\n    }\n    if (slow !== fast) return;\n    slow = head;\n    while (slow.next !== fast.next) {\n        slow = slow.next;\n        fast = fast.next;\n    }\n    fast.next = null;\n}"
      }
    },
    {
      title: "Find Middle of Linked List",
      difficulty: "medium",
      problemStatement: "Given the head of a singly linked list, find the middle node. If there are two middle nodes, return the second one.",
      examples: [
        {
          input: "1->2->3->4->5",
          output: "3",
          explanation: "Middle node is 3."
        }
      ],
      testCases: [
        { input: "1->2->3->4->5", output: "3" },
        { input: "1->2->3->4", output: "3" },
        { input: "1", output: "1" }
      ],
      conceptExplanation: "Use slow and fast pointers. Slow moves 1 step, fast 2 steps. When fast reaches end, slow is at middle.",
      workedExample: "Slow:1, fast:1; slow:2, fast:3; slow:3, fast:5; fast at end, slow at 3.",
      initialCode: "def findMiddle(head):\n    # Your code here",
      solutions: {
        cpp: "Node* findMiddle(Node* head) {\n    if (!head) return nullptr;\n    Node* slow = head;\n    Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}",
        c: "struct Node* findMiddle(struct Node* head) {\n    if (!head) return NULL;\n    struct Node* slow = head;\n    struct Node* fast = head;\n    while (fast->next && fast->next->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}",
        python: "def findMiddle(head):\n    if not head:\n        return None\n    slow = head\n    fast = head\n    while fast.next and fast.next.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow",
        java: "public Node findMiddle(Node head) {\n    if (head == null) return null;\n    Node slow = head;\n    Node fast = head;\n    while (fast.next != null && fast.next.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}",
        javascript: "function findMiddle(head) {\n    if (!head) return null;\n    let slow = head;\n    let fast = head;\n    while (fast.next && fast.next.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}"
      }
    },
    {
      title: "Merge Two Sorted Linked Lists",
      difficulty: "medium",
      problemStatement: "Merge two sorted linked lists and return the merged sorted list.",
      examples: [
        {
          input: "1->3->5, 2->4->6",
          output: "1->2->3->4->5->6",
          explanation: "Lists are merged in sorted order."
        }
      ],
      testCases: [
        { input: "1->3, 2->4", output: "1->2->3->4" },
        { input: "1->2, 3->4", output: "1->2->3->4" },
        { input: "null, 1->2", output: "1->2" }
      ],
      conceptExplanation: "Use a dummy node, compare heads of both lists, append smaller to result, move pointers.",
      workedExample: "Compare 1 and 2, append 1, move first list. Compare 3 and 2, append 2, move second. And so on.",
      initialCode: "def mergeTwoLists(list1, list2):\n    # Your code here",
      solutions: {
        cpp: "Node* mergeTwoLists(Node* list1, Node* list2) {\n    Node* dummy = new Node(0);\n    Node* tail = dummy;\n    while (list1 && list2) {\n        if (list1->data < list2->data) {\n            tail->next = list1;\n            list1 = list1->next;\n        } else {\n            tail->next = list2;\n            list2 = list2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = list1 ? list1 : list2;\n    return dummy->next;\n}",
        c: "struct Node* mergeTwoLists(struct Node* list1, struct Node* list2) {\n    struct Node* dummy = createNode(0);\n    struct Node* tail = dummy;\n    while (list1 && list2) {\n        if (list1->data < list2->data) {\n            tail->next = list1;\n            list1 = list1->next;\n        } else {\n            tail->next = list2;\n            list2 = list2->next;\n        }\n        tail = tail->next;\n    }\n    tail->next = list1 ? list1 : list2;\n    return dummy->next;\n}",
        python: "def mergeTwoLists(list1, list2):\n    dummy = Node(0)\n    tail = dummy\n    while list1 and list2:\n        if list1.data < list2.data:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n    tail.next = list1 if list1 else list2\n    return dummy.next",
        java: "public Node mergeTwoLists(Node list1, Node list2) {\n    Node dummy = new Node(0);\n    Node tail = dummy;\n    while (list1 != null && list2 != null) {\n        if (list1.data < list2.data) {\n            tail.next = list1;\n            list1 = list1.next;\n        } else {\n            tail.next = list2;\n            list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = (list1 != null) ? list1 : list2;\n    return dummy.next;\n}",
        javascript: "function mergeTwoLists(list1, list2) {\n    let dummy = new Node(0);\n    let tail = dummy;\n    while (list1 && list2) {\n        if (list1.data < list2.data) {\n            tail.next = list1;\n            list1 = list1.next;\n        } else {\n            tail.next = list2;\n            list2 = list2.next;\n        }\n        tail = tail.next;\n    }\n    tail.next = list1 || list2;\n    return dummy.next;\n}"
      }
    },
    {
      title: "Remove Duplicates from Sorted Linked List",
      difficulty: "medium",
      problemStatement: "Given the head of a sorted linked list, delete all duplicates such that each element appears only once.",
      examples: [
        {
          input: "1->1->2->3->3",
          output: "1->2->3",
          explanation: "Duplicates are removed."
        }
      ],
      testCases: [
        { input: "1->1->2", output: "1->2" },
        { input: "1->2->2->3", output: "1->2->3" },
        { input: "1->1->1", output: "1" }
      ],
      conceptExplanation: "Traverse the list, if current.data == current.next.data, skip next.",
      workedExample: "At 1, next is 1, skip second 1. At 1, next is 2, keep. At 2, next is 3, keep. At 3, next is 3, skip.",
      initialCode: "def deleteDuplicates(head):\n    # Your code here",
      solutions: {
        cpp: "Node* deleteDuplicates(Node* head) {\n    Node* curr = head;\n    while (curr && curr->next) {\n        if (curr->data == curr->next->data) {\n            Node* temp = curr->next;\n            curr->next = curr->next->next;\n            delete temp;\n        } else {\n            curr = curr->next;\n        }\n    }\n    return head;\n}",
        c: "struct Node* deleteDuplicates(struct Node* head) {\n    struct Node* curr = head;\n    while (curr && curr->next) {\n        if (curr->data == curr->next->data) {\n            struct Node* temp = curr->next;\n            curr->next = curr->next->next;\n            free(temp);\n        } else {\n            curr = curr->next;\n        }\n    }\n    return head;\n}",
        python: "def deleteDuplicates(head):\n    curr = head\n    while curr and curr.next:\n        if curr.data == curr.next.data:\n            curr.next = curr.next.next\n        else:\n            curr = curr.next\n    return head",
        java: "public Node deleteDuplicates(Node head) {\n    Node curr = head;\n    while (curr != null && curr.next != null) {\n        if (curr.data == curr.next.data) {\n            curr.next = curr.next.next;\n        } else {\n            curr = curr.next;\n        }\n    }\n    return head;\n}",
        javascript: "function deleteDuplicates(head) {\n    let curr = head;\n    while (curr && curr.next) {\n        if (curr.data === curr.next.data) {\n            curr.next = curr.next.next;\n        } else {\n            curr = curr.next;\n        }\n    }\n    return head;\n}"
      }
    },
    {
      title: "Intersection Point of Two Linked Lists",
      difficulty: "hard",
      problemStatement: "Given the heads of two singly linked lists, find the node at which the two lists intersect.",
      examples: [
        {
          input: "1->2->3->4, 5->3->4",
          output: "3",
          explanation: "Intersection at node 3."
        }
      ],
      testCases: [
        { input: "1->2->3, 4->3", output: "3" },
        { input: "1->2, 3->4", output: "null" },
        { input: "1->2->3, 1->2->3", output: "1" }
      ],
      conceptExplanation: "Calculate lengths, align starts, then traverse together until common node.",
      workedExample: "Len1=4, len2=3, diff=1. Move head1 1 step. Then traverse both until equal.",
      initialCode: "def getIntersectionNode(headA, headB):\n    # Your code here",
      solutions: {
        cpp: "Node* getIntersectionNode(Node* headA, Node* headB) {\n    if (!headA || !headB) return nullptr;\n    Node* a = headA;\n    Node* b = headB;\n    while (a != b) {\n        a = a ? a->next : headB;\n        b = b ? b->next : headA;\n    }\n    return a;\n}",
        c: "struct Node* getIntersectionNode(struct Node* headA, struct Node* headB) {\n    if (!headA || !headB) return NULL;\n    struct Node* a = headA;\n    struct Node* b = headB;\n    while (a != b) {\n        a = a ? a->next : headB;\n        b = b ? b->next : headA;\n    }\n    return a;\n}",
        python: "def getIntersectionNode(headA, headB):\n    if not headA or not headB:\n        return None\n    a = headA\n    b = headB\n    while a != b:\n        a = a.next if a else headB\n        b = b.next if b else headA\n    return a",
        java: "public Node getIntersectionNode(Node headA, Node headB) {\n    if (headA == null || headB == null) return null;\n    Node a = headA;\n    Node b = headB;\n    while (a != b) {\n        a = (a != null) ? a.next : headB;\n        b = (b != null) ? b.next : headA;\n    }\n    return a;\n}",
        javascript: "function getIntersectionNode(headA, headB) {\n    if (!headA || !headB) return null;\n    let a = headA;\n    let b = headB;\n    while (a !== b) {\n        a = a ? a.next : headB;\n        b = b ? b.next : headA;\n    }\n    return a;\n}"
      }
    },
    {
      title: "Add Two Numbers Represented by Linked Lists",
      difficulty: "hard",
      problemStatement: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
      examples: [
        {
          input: "2->4->3, 5->6->4",
          output: "7->0->8",
          explanation: "342 + 465 = 807, reversed as 7->0->8."
        }
      ],
      testCases: [
        { input: "2->4->3, 5->6->4", output: "7->0->8" },
        { input: "0, 0", output: "0" },
        { input: "9->9->9, 1", output: "0->0->0->1" }
      ],
      conceptExplanation: "Traverse both lists, add digits with carry, create new nodes for sum.",
      workedExample: "2+5=7, carry=0; 4+6=10, 0 carry=1; 3+4+1=8, carry=0. Result 7->0->8.",
      initialCode: "def addTwoNumbers(l1, l2):\n    # Your code here",
      solutions: {
        cpp: "Node* addTwoNumbers(Node* l1, Node* l2) {\n    Node* dummy = new Node(0);\n    Node* curr = dummy;\n    int carry = 0;\n    while (l1 || l2 || carry) {\n        int sum = carry;\n        if (l1) {\n            sum += l1->data;\n            l1 = l1->next;\n        }\n        if (l2) {\n            sum += l2->data;\n            l2 = l2->next;\n        }\n        carry = sum / 10;\n        curr->next = new Node(sum % 10);\n        curr = curr->next;\n    }\n    return dummy->next;\n}",
        c: "struct Node* addTwoNumbers(struct Node* l1, struct Node* l2) {\n    struct Node* dummy = createNode(0);\n    struct Node* curr = dummy;\n    int carry = 0;\n    while (l1 || l2 || carry) {\n        int sum = carry;\n        if (l1) {\n            sum += l1->data;\n            l1 = l1->next;\n        }\n        if (l2) {\n            sum += l2->data;\n            l2 = l2->next;\n        }\n        carry = sum / 10;\n        curr->next = createNode(sum % 10);\n        curr = curr->next;\n    }\n    return dummy->next;\n}",
        python: "def addTwoNumbers(l1, l2):\n    dummy = Node(0)\n    curr = dummy\n    carry = 0\n    while l1 or l2 or carry:\n        sum_val = carry\n        if l1:\n            sum_val += l1.data\n            l1 = l1.next\n        if l2:\n            sum_val += l2.data\n            l2 = l2.next\n        carry = sum_val // 10\n        curr.next = Node(sum_val % 10)\n        curr = curr.next\n    return dummy.next",
        java: "public Node addTwoNumbers(Node l1, Node l2) {\n    Node dummy = new Node(0);\n    Node curr = dummy;\n    int carry = 0;\n    while (l1 != null || l2 != null || carry != 0) {\n        int sum = carry;\n        if (l1 != null) {\n            sum += l1.data;\n            l1 = l1.next;\n        }\n        if (l2 != null) {\n            sum += l2.data;\n            l2 = l2.next;\n        }\n        carry = sum / 10;\n        curr.next = new Node(sum % 10);\n        curr = curr.next;\n    }\n    return dummy.next;\n}",
        javascript: "function addTwoNumbers(l1, l2) {\n    let dummy = new Node(0);\n    let curr = dummy;\n    let carry = 0;\n    while (l1 || l2 || carry) {\n        let sum = carry;\n        if (l1) {\n            sum += l1.data;\n            l1 = l1.next;\n        }\n        if (l2) {\n            sum += l2.data;\n            l2 = l2.next;\n        }\n        carry = Math.floor(sum / 10);\n        curr.next = new Node(sum % 10);\n        curr = curr.next;\n    }\n    return dummy.next;\n}"
      }
    },
    {
      title: "Sort Linked List",
      difficulty: "hard",
      problemStatement: "Given the head of a linked list, sort the list in ascending order and return the sorted list.",
      examples: [
        {
          input: "4->2->1->3",
          output: "1->2->3->4",
          explanation: "List is sorted."
        }
      ],
      testCases: [
        { input: "4->2->1->3", output: "1->2->3->4" },
        { input: "-1->5->3->4->0", output: "-1->0->3->4->5" },
        { input: "1", output: "1" }
      ],
      conceptExplanation: "Use merge sort: find middle, recursively sort halves, merge sorted halves.",
      workedExample: "Find middle 2, sort left 4->2 to 2->4, right 1->3 to 1->3, merge 1->2->3->4.",
      initialCode: "def sortList(head):\n    # Your code here",
      solutions: {
        cpp: "Node* sortList(Node* head) {\n    if (!head || !head->next) return head;\n    Node* mid = findMiddle(head);\n    Node* left = head;\n    Node* right = mid->next;\n    mid->next = nullptr;\n    left = sortList(left);\n    right = sortList(right);\n    return mergeTwoLists(left, right);\n}",
        c: "struct Node* sortList(struct Node* head) {\n    if (!head || !head->next) return head;\n    struct Node* mid = findMiddle(head);\n    struct Node* left = head;\n    struct Node* right = mid->next;\n    mid->next = NULL;\n    left = sortList(left);\n    right = sortList(right);\n    return mergeTwoLists(left, right);\n}",
        python: "def sortList(head):\n    if not head or not head.next:\n        return head\n    mid = findMiddle(head)\n    left = head\n    right = mid.next\n    mid.next = None\n    left = sortList(left)\n    right = sortList(right)\n    return mergeTwoLists(left, right)",
        java: "public Node sortList(Node head) {\n    if (head == null || head.next == null) return head;\n    Node mid = findMiddle(head);\n    Node left = head;\n    Node right = mid.next;\n    mid.next = null;\n    left = sortList(left);\n    right = sortList(right);\n    return mergeTwoLists(left, right);\n}",
        javascript: "function sortList(head) {\n    if (!head || !head.next) return head;\n    let mid = findMiddle(head);\n    let left = head;\n    let right = mid.next;\n    mid.next = null;\n    left = sortList(left);\n    right = sortList(right);\n    return mergeTwoLists(left, right);\n}"
      }
    }
  ]
};

async function main() {
  // Insert topic
  const topicResult = await db.insert(topics).values(linkedListData.topic).returning();
  const topicId = topicResult[0].id;

  // Insert problems
  for (const problem of linkedListData.problems) {
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
    }).returning();
    const problemId = problemResult[0].id;

    // Insert code snippets
    for (const [language, code] of Object.entries(problem.solutions)) {
      await db.insert(codeSnippets).values({
        problemId,
        language,
        type: "solution",
        code,
      });
    }
  }

  console.log('Linked List curriculum data inserted successfully');
}

main().catch(console.error);