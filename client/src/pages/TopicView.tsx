import { useRoute, Link } from "wouter";
import { useTopic } from "@/hooks/use-curriculum";
import { Sidebar } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Code, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopicView() {
  const [, params] = useRoute("/topic/:slug");
  const slug = params?.slug || "";
  const { data: topic, isLoading } = useTopic(slug);

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 pl-64">
        <div className="max-w-5xl mx-auto p-8">
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

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-border pb-2">Problems</h2>
            
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
                      <div className="pr-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button>Solve Problem</Button>
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
          </div>
        </div>
      </div>
    </div>
  );
}
