import { Button } from "@/components/ui/button";
import { Code2, ArrowRight, Zap, Users, Brain } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-background/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-white">CRYPTUS</span>
          </div>
          <a href="/api/login">
            <Button>Login with Replit</Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 py-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-primary animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Systematic Learning Path
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Master Data Structures<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              & Algorithms
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Follow the curated Striver's A2Z DSA Sheet path. 
            Learn concepts, visualize examples, and solve problems with an AI mentor by your side.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a href="/api/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
                Start Learning Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 pb-20 mt-12">
          <div className="glass-panel p-8 rounded-2xl text-left hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Structured Path</h3>
            <p className="text-muted-foreground">
              Don't get lost. Follow a proven step-by-step roadmap from basics to advanced topics.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl text-left hover:border-secondary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Mentorship</h3>
            <p className="text-muted-foreground">
              Stuck? Ask your personal AI mentor for hints, explanations, and code reviews instantly.
            </p>
          </div>
          
          <div className="glass-panel p-8 rounded-2xl text-left hover:border-accent/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Hands-on IDE</h3>
            <p className="text-muted-foreground">
              Write, run, and test your code directly in the browser with our powerful Monaco-based editor.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
