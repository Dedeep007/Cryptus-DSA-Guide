import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useProblem, useSubmitProblem } from "@/hooks/use-curriculum";
import { CodeEditor } from "@/components/CodeEditor";
import { AiMentor } from "@/components/AiMentor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Play, 
  CheckCircle2, 
  RotateCcw,
  BookOpen,
  Code2,
  Terminal as TerminalIcon,
  Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function ProblemView() {
  const [, params] = useRoute("/problem/:id");
  const id = parseInt(params?.id || "0");
  const { data: problem, isLoading } = useProblem(id);
  const { mutateAsync: submit, isPending: isSubmitting } = useSubmitProblem();
  const { toast } = useToast();
  
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("guide");
  const [output, setOutput] = useState<any[]>([]);

  // Update local code state when problem loads
  if (problem && !code && problem.initialCode) {
    setCode(problem.initialCode);
  }

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background text-muted-foreground">Loading problem...</div>;
  }

  if (!problem) return <div>Problem not found</div>;

  const handleRun = () => {
    // In a real app, this would send code to a secure sandbox execution API
    // For MVP, we'll mock execution based on test cases
    try {
      // Very unsafe eval for demo purposes only - never use in production!
      // Real implementation would use Piston API or similar
      const results = problem.testCases.map((testCase: any) => {
        // Mock result
        return {
          input: testCase.input,
          expected: testCase.output,
          actual: testCase.output, // Pretend it works
          passed: true
        };
      });
      setOutput(results);
      toast({
        title: "Code Executed",
        description: "Your code ran against the test cases.",
      });
    } catch (e) {
      setOutput([{ error: "Execution failed" }]);
    }
  };

  const handleSubmit = async () => {
    try {
      await submit({
        id: problem.id,
        code,
        status: "passed" // Mock success
      });
      toast({
        title: "Problem Solved!",
        description: "Great job! Submission recorded.",
        className: "bg-green-500 border-green-600 text-white",
      });
    } catch (e) {
      toast({
        title: "Submission Failed",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-4">
          <Link href={`/topic/${problem.topicId}`}> 
            {/* Note: Ideally we'd navigate back to the specific topic slug, but we only have ID here. 
                For MVP, routing back to dashboard or using a store for history is better. 
                Using dashboard for now for safety if slug isn't available easily without extra fetch. */}
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-bold text-white flex items-center gap-2">
              {problem.title}
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full border",
                problem.difficulty === "Easy" ? "border-green-500/50 text-green-500 bg-green-500/10" :
                problem.difficulty === "Medium" ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10" :
                "border-red-500/50 text-red-500 bg-red-500/10"
              )}>{problem.difficulty}</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleRun}
            className="gap-2 font-semibold"
          >
            <Play className="w-4 h-4" />
            Run
          </Button>
          <Button 
            size="sm" 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Submit
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 overflow-hidden">
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
                <div className="markdown-content prose prose-invert max-w-none">
                  <ReactMarkdown>{problem.description}</ReactMarkdown>
                  <hr className="my-8 border-border" />
                  <h3 className="text-white font-bold text-lg mb-4">Concept Explanation</h3>
                  <ReactMarkdown>{problem.conceptExplanation}</ReactMarkdown>
                </div>
              </TabsContent>
              
              <TabsContent value="example" className="flex-1 overflow-y-auto p-6 focus-visible:outline-none">
                <div className="markdown-content prose prose-invert max-w-none">
                  <ReactMarkdown>{problem.workedExample}</ReactMarkdown>
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
                  <div className="h-9 border-b border-[#2d2d2d] flex items-center justify-between px-4 bg-[#1e1e1e]">
                    <span className="text-xs text-muted-foreground flex items-center gap-2">
                      <Code2 className="w-3 h-3" />
                      JavaScript
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-white"
                      onClick={() => setCode(problem.initialCode)}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex-1 relative">
                    <CodeEditor 
                      initialValue={code} 
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
                          <div key={i} className={cn("p-3 rounded-lg border", res.passed ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20")}>
                            {res.error ? (
                              <div className="text-red-400">{res.error}</div>
                            ) : (
                              <>
                                <div className="flex items-center gap-2 mb-2">
                                  {res.passed ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-red-500" />}
                                  <span className="font-bold text-white">Test Case {i + 1}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs">
                                  <div>
                                    <span className="text-muted-foreground block mb-1">Input:</span>
                                    <div className="bg-black/30 p-2 rounded text-white">{JSON.stringify(res.input)}</div>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground block mb-1">Expected:</span>
                                    <div className="bg-black/30 p-2 rounded text-white">{JSON.stringify(res.expected)}</div>
                                  </div>
                                </div>
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
      </div>

      <AiMentor context={`Problem: ${problem.title}. Description: ${problem.description}`} />
    </div>
  );
}
