import { useRoute, Link } from "wouter";
import { useTopic, useTopicExamples } from "@/hooks/use-curriculum";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Code, BookOpen, Lightbulb, Target, CheckCircle, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LANGUAGES = [
  { id: "cpp", name: "C++", monaco: "cpp" },
  { id: "c", name: "C", monaco: "c" },
  { id: "python", name: "Python", monaco: "python" },
  { id: "java", name: "Java", monaco: "java" },
  { id: "javascript", name: "JavaScript", monaco: "javascript" },
];

function removeCodeFromText(text: string): string {
  if (!text) return text;

  // Remove code blocks (```code```)
  text = text.replace(/```[\s\S]*?```/g, '');

  // Remove inline code (`code`)
  text = text.replace(/`[^`\n]+`/g, '');

  // Remove indented code blocks (lines starting with 4+ spaces)
  text = text.replace(/^( {4,}.*)$/gm, '');

  // Clean up extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

function getAlgorithmExplanation(slug: string) {
  const explanations: Record<string, { title: string; content: string }> = {
    "arrays": {
      title: "Arrays: The Foundation of Data Structures",
      content: `
## What are Arrays?

Arrays are **contiguous memory locations** that store elements of the same data type. Think of them as a row of boxes where each box holds one item.

### Simple Example:
\`\`\`javascript
// Creating an array
let fruits = ["apple", "banana", "orange"];

// Accessing elements (0-based indexing)
console.log(fruits[0]); // "apple"
console.log(fruits[2]); // "orange"

// Modifying elements
fruits[1] = "grape";
console.log(fruits); // ["apple", "grape", "orange"]
\`\`\`

### Key Operations:
- **Access**: O(1) - Direct access by index
- **Search**: O(n) - May need to check each element
- **Insert/Delete**: O(n) - May need to shift elements

### Common Patterns:
1. **Traversal**: Visit each element once
2. **Two Pointers**: Use two indices to solve problems efficiently
3. **Sliding Window**: Maintain a window of elements for subarray problems
4. **Prefix Sum**: Precompute sums for range queries

### Real-World Applications:
- Storing student grades
- Managing inventory in a store
- Representing pixels in an image
- Implementing other data structures (stacks, queues)
      `
    },
    "binary-search": {
      title: "Binary Search: Divide and Conquer",
      content: `
## What is Binary Search?

Binary search is an efficient algorithm that finds the position of a target value within a **sorted array**. It works by repeatedly dividing the search interval in half.

### Simple Example:
Imagine searching for the number 7 in a sorted array: [1, 3, 5, 7, 9, 11, 13]

\`\`\`javascript
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid; // Found!
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }
  
  return -1; // Not found
}

console.log(binarySearch([1, 3, 5, 7, 9, 11, 13], 7)); // 3
\`\`\`

### Why O(log n) Time?
Each comparison reduces the search space by half:
- Array of 8 elements: 3 comparisons max
- Array of 1,000 elements: 10 comparisons max
- Array of 1,000,000 elements: 20 comparisons max

### Key Conditions:
- ✅ Array must be sorted
- ✅ Random access (arrays work, linked lists don't)
- ✅ Elements must be comparable

### Applications:
- Finding elements in sorted datasets
- Optimization problems (maximize/minimize)
- Finding boundaries (first/last occurrence)
      `
    },
    "strings": {
      title: "Strings: Text Processing Fundamentals",
      content: `
## What are Strings?

Strings are sequences of characters. In programming, they're arrays of characters with special operations for text manipulation.

### Simple Example:
\`\`\`javascript
// String creation and basic operations
let text = "Hello, World!";
console.log(text.length); // 13
console.log(text[0]); // "H"
console.log(text.toUpperCase()); // "HELLO, WORLD!"

// String comparison
console.log("apple" < "banana"); // true (lexicographical order)
\`\`\`

### Key Concepts:
- **Immutable**: Most operations create new strings
- **0-based indexing**: Same as arrays
- **ASCII/Unicode**: Character encoding matters

### Common Patterns:
1. **Two Pointers**: For palindrome checks, reversals
2. **Sliding Window**: For substring problems
3. **Hash Maps**: For character frequency counting
4. **String Building**: Efficient concatenation

### Real-World Applications:
- Text search and replace
- Password validation
- URL parsing
- DNA sequence analysis
- Text compression algorithms

### Important Edge Cases:
- Empty strings
- Single character strings
- Strings with special characters
- Case sensitivity
- Unicode characters
      `
    },
    "linked-list": {
      title: "Linked Lists: Dynamic Data Structures",
      content: `
## What are Linked Lists?

Linked lists are linear data structures where elements are stored in **nodes**, and each node points to the next node. Unlike arrays, they're not stored contiguously in memory.

### Simple Example:
\`\`\`javascript
// Node structure
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Creating a linked list: 1 -> 2 -> 3 -> null
let head = new Node(1);
head.next = new Node(2);
head.next.next = new Node(3);

console.log(head.value); // 1
console.log(head.next.value); // 2
\`\`\`

### Types of Linked Lists:
- **Singly Linked List**: Each node points to next
- **Doubly Linked List**: Each node points to both next and previous
- **Circular Linked List**: Last node points back to first

### Key Operations:
- **Insert**: O(1) at head, O(n) in middle/end
- **Delete**: O(1) at head (if we have reference), O(n) otherwise
- **Search**: O(n) - must traverse from head
- **Access by index**: O(n) - no random access

### Advantages over Arrays:
- ✅ Dynamic size (no fixed capacity)
- ✅ Efficient insertions/deletions
- ✅ Memory efficient for sparse data

### Disadvantages:
- ❌ No random access
- ❌ Extra memory for pointers
- ❌ Cache unfriendly (not contiguous)

### Real-World Applications:
- Implementing stacks and queues
- Music playlist management
- Browser history
- Hash table collision resolution
      `
    },
    "recursion": {
      title: "Recursion: Solving Problems by Breaking Them Down",
      content: `
## What is Recursion?

Recursion is a programming technique where a function **calls itself** to solve a problem by breaking it down into smaller, identical subproblems.

### Simple Example:
Calculating factorial iteratively vs recursively:

\`\`\`javascript
// Iterative approach
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Recursive approach
function factorialRecursive(n) {
  if (n <= 1) return 1; // Base case
  return n * factorialRecursive(n - 1); // Recursive case
}

console.log(factorialRecursive(5)); // 120
\`\`\`

### Key Components:
1. **Base Case**: When to stop recursing
2. **Recursive Case**: How to break down the problem
3. **Call Stack**: Memory management for recursive calls

### Recursion vs Iteration:
- **Recursion**: Elegant, sometimes more intuitive
- **Iteration**: Better performance, less memory usage

### Common Patterns:
1. **Divide and Conquer**: Break into smaller subproblems
2. **Backtracking**: Try different paths, backtrack on failure
3. **Tree Traversal**: Natural for tree structures
4. **Memoization**: Cache results to avoid recomputation

### Important Considerations:
- **Stack Overflow**: Too many recursive calls
- **Time Complexity**: Can be exponential without memoization
- **Space Complexity**: O(n) for call stack

### Real-World Applications:
- Tree traversals
- File system navigation
- Mathematical computations (Fibonacci, factorial)
- Sorting algorithms (QuickSort, MergeSort)
- Puzzle solving (Tower of Hanoi, N-Queens)
      `
    }
  };

  return explanations[slug] || {
    title: `${slug.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Overview`,
    content: `Learn about ${slug.replace('-', ' ')} and practice with curated problems from Striver's A2Z DSA Sheet.`
  };
}

function getCleanAlgorithmExplanation(slug: string) {
  const explanation = getAlgorithmExplanation(slug);
  return {
    title: explanation.title,
    content: removeCodeFromText(explanation.content)
  };
}

export default function TopicView() {
  const [, params] = useRoute("/topic/:slug");
  const slug = params?.slug || "";
  const { data: topic, isLoading } = useTopic(slug);
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [codeExample, setCodeExample] = useState("");
  const [loadingExample, setLoadingExample] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch code example when language or slug changes
  useEffect(() => {
    if (!slug) return;

    setLoadingExample(true);
    fetch(`/api/topics/${slug}/examples/${selectedLanguage}`)
      .then(res => res.json())
      .then(data => {
        if (data.code) {
          setCodeExample(data.code);
        }
      })
      .catch(err => {
        console.error("Failed to load code example:", err);
        setCodeExample("// No example available for this language");
      })
      .finally(() => {
        setLoadingExample(false);
      });
  }, [slug, selectedLanguage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeExample);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <div className="flex-1 pl-64 p-8">
          <Skeleton className="h-8 w-24 mb-4" />
          <Skeleton className="h-16 w-96 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!topic) return <div>Topic not found</div>;

  const explanation = { title: topic.title, content: topic.description };

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <Link href="/">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent text-muted-foreground hover:text-white gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-display font-bold text-white mb-4">{topic.title}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {topic.description}
            </p>
          </div>

          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Algorithm Guide
              </TabsTrigger>
              <TabsTrigger value="problems" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Practice Problems
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-6">
              <Card className="p-8 bg-card border-border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{explanation.title}</h2>
                    <p className="text-muted-foreground">Master the fundamentals before diving into problems</p>
                  </div>
                </div>

                <MarkdownRenderer>
                  {explanation.content}
                </MarkdownRenderer>

                {/* Code Example Section */}
                <div className="mt-8 border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary" />
                      Code Example
                    </h3>
                    <div className="flex items-center gap-3">
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LANGUAGES.map((lang) => (
                            <SelectItem key={lang.id} value={lang.id}>
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        disabled={loadingExample || !codeExample}
                        className="flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="h-96 border border-border rounded-lg overflow-hidden">
                    {loadingExample ? (
                      <div className="h-full flex items-center justify-center bg-card">
                        <p className="text-muted-foreground">Loading example...</p>
                      </div>
                    ) : (
                      <CodeEditor
                        initialValue={codeExample}
                        language={LANGUAGES.find(l => l.id === selectedLanguage)?.monaco || "cpp"}
                        readOnly={true}
                      />
                    )}
                  </div>
                </div>

                <div className="mt-8 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-primary mb-2">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Ready to Practice?</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Now that you understand the algorithm, switch to the "Practice Problems" tab to solve curated problems from Striver's A2Z DSA Sheet.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="problems" className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Practice Problems</h2>
                  <p className="text-muted-foreground">Apply your knowledge with hands-on coding challenges</p>
                </div>
              </div>

              <div className="grid gap-4">
                {topic.problems?.map((problem, index) => (
                  <Link key={problem.id} href={`/problem/${problem.id}`}>
                    <Card className="p-0 overflow-hidden bg-card border-border hover:border-primary/50 transition-all cursor-pointer group">
                      <div className="flex items-center">
                        <div className="w-16 h-24 bg-muted/20 flex items-center justify-center font-mono text-xl text-muted-foreground font-bold border-r border-border group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {index + 1}
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">
                              {problem.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              <span>Code Practice</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              <span>Concept Guide</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 pr-6">
                          <Badge
                            variant="outline"
                            className={cn(
                              "border-0 font-mono",
                              problem.difficulty === "Easy" && "bg-green-500/10 text-green-500",
                              problem.difficulty === "Medium" && "bg-yellow-500/10 text-yellow-500",
                              problem.difficulty === "Hard" && "bg-red-500/10 text-red-500",
                            )}
                          >
                            {problem.difficulty}
                          </Badge>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button>Solve Problem</Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}

                {(!topic.problems || topic.problems.length === 0) && (
                  <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground">No problems added to this topic yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
