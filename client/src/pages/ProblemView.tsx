import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useProblem, useSubmitProblem, useRunCode } from "@/hooks/use-curriculum";
import { CodeEditor } from "@/components/CodeEditor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Code2,
  Terminal as TerminalIcon,
  Loader2,
  ChevronDown,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Register languages for syntax highlighting
import 'react-syntax-highlighter/dist/esm/languages/prism/cpp';
import 'react-syntax-highlighter/dist/esm/languages/prism/c';
import 'react-syntax-highlighter/dist/esm/languages/prism/python';
import 'react-syntax-highlighter/dist/esm/languages/prism/java';
import 'react-syntax-highlighter/dist/esm/languages/prism/javascript';
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { SolutionCodeBlock } from "@/components/SolutionCodeBlock";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { setAIContext } from "@/components/AIAssistant";


// Individual signature component for Submission Format
function SubmissionSignature({ lang, signature }: { lang: string; signature: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(signature);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  const syntaxLang = lang.trim().toLowerCase();

  return (
    <div className="flex flex-col gap-2 group">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="px-2 py-0 h-5 text-[10px] font-bold tracking-widest uppercase text-white/60 border-white/20 bg-white/5">
          {lang.trim()}
        </Badge>
        <button
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-success" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={syntaxLang === 'cpp' ? 'cpp' : syntaxLang === 'python' ? 'python' : syntaxLang === 'java' ? 'java' : syntaxLang === 'javascript' || syntaxLang === 'js' ? 'javascript' : 'c'}
          style={vscDarkPlus as any}
          customStyle={{
            margin: 0,
            padding: '12px 16px',
            borderRadius: '12px',
            fontSize: '14px',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            fontFamily: 'var(--font-mono)',
          }}
          codeTagProps={{
            style: {
              color: '#ffffff',
            }
          }}
        >
          {signature.includes('{') || (syntaxLang === 'python' && signature.includes(':'))
            ? signature
            : (syntaxLang === 'python' ? `${signature}:\n    pass` : `${signature} {\n    \n}`)}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

function CodeSubmissionSignature({ format, language }: { format: string; language: string }) {
  return (
    <div className="space-y-4">
      {format.split('\n')
        .filter(line => line.includes(': `'))
        .filter(line => {
          const [lang] = line.split(': `');
          const l = lang.trim().toLowerCase();
          if (language === 'javascript') return l === 'javascript' || l === 'js';
          return l === language;
        })
        .map((line, idx) => {
          const [lang, signature] = line.split(': `');
          const cleanSignature = signature.replace('`', '');
          return (
            <SubmissionSignature
              key={idx}
              lang={lang}
              signature={cleanSignature}
            />
          );
        })}
    </div>
  );
}


// Copyable code block component
function CopyableCodeBlock({ code, label, language }: { code: string; label: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Format test case code based on language
  const formatTestCase = (code: string, language: string): string => {
    if (!code) return code;

    const lines = code.split('\n');
    const formattedLines = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return line;

      // Handle raw array input like [1, 2, 3, 4] (LeetCode style)
      // and treat it as a variable named 'input' or similar if no name is given
      const rawArrayMatch = trimmed.match(/^\[(.*)\]$/);
      if (rawArrayMatch) {
        const values = rawArrayMatch[1];
        switch (language) {
          case 'cpp':
            return `vector<int> arr = {${values}};`;
          case 'c':
            return `int arr[] = {${values}};`;
          case 'python':
            return `arr = [${values}]`;
          case 'java':
            return `int[] arr = {${values}};`;
          case 'javascript':
            return `let arr = [${values}];`;
          default:
            return line;
        }
      }

      // Handle array declarations like A[] = {1, 2, 3}
      const arrayMatch = trimmed.match(/^(\w+)\[\]\s*=\s*\{([^}]+)\}$|^((\w+)\s*=\s*(\[.*\]))$/);
      if (arrayMatch) {
        // pattern 1: A[] = {1, 2, 3}
        // pattern 2: A = [1, 2, 3]
        const varName = arrayMatch[1] || arrayMatch[4];
        let values = arrayMatch[2] || arrayMatch[5];

        // Convert [ ] to { } for C++ and C if they are using the { } style
        const braceValues = values.replace(/\[/g, '{').replace(/\]/g, '}');

        switch (language) {
          case 'cpp':
            return `vector<int> ${varName} = ${braceValues};`;
          case 'c':
            return `int ${varName}[] = ${braceValues};`;
          case 'python':
            return `${varName} = ${values}`;
          case 'java':
            return `int[] ${varName} = ${braceValues};`;
          case 'javascript':
            return `let ${varName} = ${values};`;
          default:
            return line;
        }
      }

      // Handle simple variable assignments like n = 5
      const varMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
      if (varMatch && !trimmed.includes('{') && !trimmed.includes('[') && !trimmed.includes('"') && !trimmed.includes("'")) {
        const [, varName, value] = varMatch;
        const numValue = value.trim();
        switch (language) {
          case 'cpp':
          case 'c':
            return `${language === 'c' ? 'int ' : ''}${varName} = ${numValue};`;
          case 'python':
            return `${varName} = ${numValue}`;
          case 'java':
            return `int ${varName} = ${numValue};`;
          case 'javascript':
            return `let ${varName} = ${numValue};`;
          default:
            return line;
        }
      }

      // Handle string inputs like "hello"
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        const content = trimmed.slice(1, -1);
        switch (language) {
          case 'cpp':
            return `string s = "${content}";`;
          case 'c':
            return `char* s = "${content}";`;
          case 'python':
            return `s = "${content}"`;
          case 'java':
            return `String s = "${content}";`;
          case 'javascript':
            return `let s = "${content}";`;
          default:
            return line;
        }
      }

      return line;
    });

    return formattedLines.join('\n');
  };

  const formattedCode = language ? formatTestCase(code, language) : code;

  // Map language IDs to syntax highlighter languages
  const getSyntaxLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      'cpp': 'cpp',
      'c': 'c',
      'python': 'python',
      'java': 'java',
      'javascript': 'javascript'
    };
    return languageMap[lang] || 'text';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-muted-foreground font-medium">{label}:</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="relative">
        <SyntaxHighlighter
          language={language ? getSyntaxLanguage(language) : 'text'}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            borderRadius: '6px',
            fontSize: '13px',
            background: '#1e1e1e',
            border: '1px solid #3d3d3d'
          }}
          codeTagProps={{
            style: {
              fontFamily: 'var(--font-mono)',
            }
          }}
        >
          {formattedCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}

// Language configurations
const LANGUAGES = [
  { id: "cpp", label: "C++", monaco: "cpp" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "c", label: "C", monaco: "c" },
  { id: "java", label: "Java", monaco: "java" },
  { id: "javascript", label: "JavaScript", monaco: "javascript" },
] as const;

const DEFAULT_CODE: Record<string, string> = {
  cpp: `int solution(vector<int>& nums) {
    
}
`,
  python: `def solution():
    pass
`,
  c: `int solution(int arr[], int n) {
    
}
`,
  java: `public int solution(int[] nums) {
    
}
`,
  javascript: `function solution() {
    
}
`,
};

export default function ProblemView() {
  const [, params] = useRoute("/problem/:id");
  const id = parseInt(params?.id || "0");
  const { data: problem, isLoading } = useProblem(id);
  const { mutateAsync: runCode, isPending: isRunning } = useRunCode();
  const { mutateAsync: submit, isPending: isSubmitting } = useSubmitProblem();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Helper to get boilerplate from submission format
  const getBoilerplate = (problem: any, lang: string) => {
    if (!problem?.submissionFormat) return DEFAULT_CODE[lang] || "";

    const lines = problem.submissionFormat.split('\n');
    const langKey = lang === 'javascript' ? 'JAVASCRIPT:' : lang.toUpperCase() + ':';
    const sigLine = lines.find((l: string) => l.toUpperCase().startsWith(langKey));

    if (sigLine && sigLine.includes('`')) {
      const signature = sigLine.split('`')[1];
      if (lang === 'python') {
        return `${signature}:\n    pass`;
      } else if (lang === 'cpp') {
        return `#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\n${signature} {\n    \n}`;
      } else if (lang === 'java') {
        return `${signature} {\n    \n}`;
      } else {
        return `${signature} {\n    \n}`;
      }
    }

    return DEFAULT_CODE[lang] || "";
  };

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("guide");
  const [output, setOutput] = useState<any[]>([]);
  const [language, setLanguage] = useState("cpp"); // Default to C++

  // Save this problem as last visited for "Continue Learning" feature
  useEffect(() => {
    if (problem) {
      const lastVisited = {
        problemId: problem.id,
        problemTitle: problem.title,
        difficulty: problem.difficulty,
        topicId: problem.topicId,
        timestamp: Date.now(),
      };
      localStorage.setItem('cryptus_last_problem', JSON.stringify(lastVisited));
    }
  }, [problem]);

  // Update local code state when problem loads
  useEffect(() => {
    if (problem && !code) {
      if (problem.initialCode && problem.initialCode !== '// Write your solution here') {
        setCode(problem.initialCode);
      } else {
        setCode(getBoilerplate(problem, language));
      }
    }
  }, [problem, language]);

  // Sync code and problem context with AI Assistant
  useEffect(() => {
    if (problem) {
      setAIContext(code, {
        problemId: problem.id,
        problemTitle: problem.title,
        difficulty: problem.difficulty,
      });
    }
  }, [code, problem]);

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-muted-foreground">Loading problem...</div>;
  }

  if (!problem) return <div>Problem not found</div>;

  const handleRun = async () => {
    try {
      const results = await runCode({
        id: problem.id,
        code,
        language
      });
      setOutput(results);
      toast({
        title: "Code Executed",
        description: "Your code ran against the test cases.",
      });
    } catch (e: any) {
      setOutput([{ error: e.message || "Execution failed" }]);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await submit({
        id: problem.id,
        code,
        language
      });

      setOutput(response.results);
      const allPassed = response.results.every((r: any) => r.passed);

      if (allPassed) {
        toast({
          title: "Problem Solved!",
          description: "Great job! Your submission has been recorded.",
          className: "bg-green-500 border-green-600 text-white",
        });
      } else {
        toast({
          title: "Submission Failed",
          description: "Some test cases did not pass. Try again!",
          variant: "destructive"
        });
      }
    } catch (e: any) {
      toast({
        title: "Submission Error",
        description: e.message || "There was an error submitting your code.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 md:h-16 border-b border-border bg-card flex items-center justify-between px-2 md:px-4 z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <Link href={`/topic/${problem.topicId}`}>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white shrink-0">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="font-bold text-white truncate text-sm md:text-base">
            {problem.title}
          </h1>
          <span className={cn(
            "text-[10px] md:text-xs px-2 py-0.5 rounded-full border shrink-0",
            problem.difficulty === "Easy" ? "border-green-500/50 text-green-500 bg-green-500/10" :
              problem.difficulty === "Medium" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
                "border-red-500/50 text-red-500 bg-red-500/10"
          )}>{problem.difficulty}</span>
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="gap-1 md:gap-2 font-semibold h-8 md:h-9 text-xs md:text-sm px-2 md:px-4"
          >
            {isRunning ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <Play className="w-3 h-3 md:w-4 md:h-4" />}
            <span className="hidden xs:inline">Run</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1 md:gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold h-8 md:h-9 text-xs md:text-sm px-2 md:px-4"
          >
            {isSubmitting ? <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> : <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />}
            <span>Submit</span>
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden relative">
        {isMobile ? (
          <Tabs defaultValue="editor" className="h-full flex flex-col">
            <div className="border-b border-border bg-card px-2">
              <TabsList className="bg-transparent h-12 w-full justify-start gap-4">
                <TabsTrigger value="guide" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full">Problem</TabsTrigger>
                <TabsTrigger value="editor" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full">Code</TabsTrigger>
                <TabsTrigger value="console" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-2 h-full">Console</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="guide" className="flex-1 overflow-y-auto m-0 p-4 focus-visible:outline-none bg-card">
              <Tabs defaultValue="instructions" className="w-full">
                <TabsList className="bg-muted/50 p-1 mb-4 h-8">
                  <TabsTrigger value="instructions" className="text-xs h-6">Guide</TabsTrigger>
                  <TabsTrigger value="example" className="text-xs h-6">Example</TabsTrigger>
                </TabsList>
                <TabsContent value="instructions" className="m-0">
                  <MarkdownRenderer language={language}>{problem.description}</MarkdownRenderer>
                  <div className="mt-6 p-4 glass-panel rounded-xl">
                    <h3 className="text-white font-bold text-base mb-3 flex items-center gap-2">
                      <TerminalIcon className="w-4 h-4 text-primary" />
                      Submission Format
                    </h3>
                    <CodeSubmissionSignature format={problem.submissionFormat} language={language} />
                  </div>
                </TabsContent>
                <TabsContent value="example" className="m-0">
                  <MarkdownRenderer language={language}>{problem.workedExample}</MarkdownRenderer>
                </TabsContent>
              </Tabs>
            </TabsContent>

            <TabsContent value="editor" className="flex-1 m-0 p-0 focus-visible:outline-none">
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 bg-muted/30 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">language:</span>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-transparent text-xs text-white border-none focus:ring-0 cursor-pointer font-bold"
                    >
                      <option value="cpp">C++</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="javascript">JavaScript</option>
                      <option value="c">C</option>
                    </select>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setCode(getBoilerplate(language, problem.submissionFormat))}>
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <CodeEditor
                    value={code}
                    language={language}
                    onChange={(val) => setCode(val || "")}
                    theme="vs-dark"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="console" className="flex-1 overflow-y-auto m-0 p-4 focus-visible:outline-none bg-black/40">
              <ExecutionConsole results={output} isRunning={isRunning} />
            </TabsContent>
          </Tabs>
        ) : (
          <ResizablePanelGroup direction="horizontal">

            {/* Left Panel: Guide/Instructions */}
            <ResizablePanel defaultSize={40} minSize={25} maxSize={60} className="bg-card">
              <Tabs defaultValue="guide" className="h-full flex flex-col">
                <div className="border-b border-border px-4 pt-2">
                  <TabsList className="bg-transparent p-0 gap-4">
                    <TabsTrigger
                      value="guide"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-2"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Guide
                    </TabsTrigger>
                    <TabsTrigger
                      value="example"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-0 py-2"
                    >
                      <Code2 className="w-4 h-4 mr-2" />
                      Worked Example
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="guide" className="flex-1 overflow-y-auto p-6 focus-visible:outline-none">
                  <div className="h-full">
                    <MarkdownRenderer language={language}>{problem.description}</MarkdownRenderer>

                    <div className="mt-8 p-6 glass-panel rounded-2xl">
                      <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                        <TerminalIcon className="w-5 h-5 text-primary glow-text" />
                        Submission Format
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Implement the function exactly as shown for your preferred language to ensure proper test case execution.
                      </p>
                      <CodeSubmissionSignature format={problem.submissionFormat} language={language} />
                    </div>

                    {/* Test Cases as Examples */}
                    {problem.testCases && problem.testCases.length > 0 && (
                      <>
                        <hr className="my-8 border-border" />
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-white font-bold text-lg">Examples</h3>
                        </div>
                        <div className="space-y-6">
                          {problem.testCases.slice(0, 1).map((testCase: any, index: number) => (
                            <div key={index} className="space-y-3">
                              <div className="space-y-3">
                                <CopyableCodeBlock code={testCase.input} label="Input" language={language} />
                                <CopyableCodeBlock code={testCase.output} label="Output" language={language} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    <hr className="my-8 border-border" />
                    <h3 className="text-white font-bold text-lg mb-4">Concept Explanation</h3>
                    <MarkdownRenderer language={language}>{problem.conceptExplanation}</MarkdownRenderer>
                  </div>
                </TabsContent>

                <TabsContent value="example" className="flex-1 overflow-y-auto p-6 focus-visible:outline-none">
                  <div className="h-full">
                    <MarkdownRenderer language={language}>{problem.workedExample}</MarkdownRenderer>
                    <h3 className="text-white font-bold text-lg mt-8 mb-4">Solution Code</h3>
                    <SolutionCodeBlock problemId={problem.id} defaultLanguage={language} />
                  </div>
                </TabsContent>
              </Tabs>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel: Editor & Output */}
            <ResizablePanel defaultSize={60}>
              <ResizablePanelGroup direction="vertical">

                {/* Code Editor */}
                <ResizablePanel defaultSize={70} minSize={30}>
                  <div className="h-full flex flex-col bg-[#1e1e1e]">
                    <div className="h-10 border-b border-[#2d2d2d] flex items-center justify-between px-4 bg-[#1e1e1e]">
                      <div className="flex items-center gap-3">
                        <Code2 className="w-3 h-3 text-muted-foreground" />
                        <Select value={language} onValueChange={(val) => {
                          setLanguage(val);
                          setCode(getBoilerplate(problem, val));
                        }}>
                          <SelectTrigger className="w-[130px] h-7 text-xs bg-[#2d2d2d] border-[#3d3d3d] focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#2d2d2d] border-[#3d3d3d]">
                            {LANGUAGES.map((lang) => (
                              <SelectItem
                                key={lang.id}
                                value={lang.id}
                                className="text-xs cursor-pointer hover:bg-[#3d3d3d]"
                              >
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-white"
                        onClick={() => setCode(getBoilerplate(problem, language))}
                        title="Reset code"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-1 relative">
                      <CodeEditor
                        initialValue={code}
                        language={LANGUAGES.find(l => l.id === language)?.monaco || "cpp"}
                        onChange={(val) => setCode(val || "")}
                      />
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Console/Output */}
                <ResizablePanel defaultSize={30} minSize={10}>
                  <div className="h-full flex flex-col bg-card border-t border-border">
                    <div className="h-9 border-b border-border flex items-center px-4 bg-muted/20">
                      <span className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                        <TerminalIcon className="w-3 h-3" />
                        Console Output
                      </span>
                    </div>
                    <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
                      {output.length === 0 ? (
                        <div className="text-muted-foreground italic opacity-50">
                          Run code to see output...
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {output.map((res, i) => (
                            <div key={i} className={cn(
                              "p-4 rounded-xl border transition-all duration-200",
                              res.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                            )}>
                              {res.error ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2 text-red-500 font-bold text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Runtime Error
                                  </div>
                                  <pre className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap font-mono">
                                    {res.error}
                                  </pre>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                      {res.passed ? (
                                        <div className="bg-green-500/20 p-1 rounded-full">
                                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                      ) : (
                                        <div className="bg-red-500/20 p-1 rounded-full">
                                          <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin-slow" />
                                        </div>
                                      )}
                                      <span className="font-bold text-white text-sm">
                                        Test Case {i + 1}
                                        {res.isHidden && <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded">Hidden</span>}
                                      </span>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                      "text-[10px] uppercase font-bold",
                                      res.passed ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                                    )}>
                                      {res.passed ? "Passed" : "Failed"}
                                    </Badge>
                                  </div>

                                  {!res.isHidden ? (
                                    <div className="grid grid-cols-1 gap-3">
                                      <div className="space-y-1.5">
                                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Input</span>
                                        <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-white break-all">
                                          {typeof res.input === 'string' ? res.input : JSON.stringify(res.input)}
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Expected</span>
                                          <div className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs text-green-400/80">
                                            {res.expected}
                                          </div>
                                        </div>
                                        <div className="space-y-1.5">
                                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Actual</span>
                                          <div className={cn(
                                            "bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-xs",
                                            res.passed ? "text-green-400" : "text-red-400"
                                          )}>
                                            {res.actual || "No output"}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-muted-foreground italic bg-black/20 p-2 rounded border border-white/5">
                                      Input and output are hidden for this test case to maintain problem integrity.
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ResizablePanel>

              </ResizablePanelGroup>
            </ResizablePanel>

          </ResizablePanelGroup>
        )}
      </div>
    </div>
  );
}
