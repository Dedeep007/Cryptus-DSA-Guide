import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTopics, useUserStats } from "@/hooks/use-curriculum";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  Play,
  CheckCircle2,
  Circle,
  Trophy,
  Flame,
  Target,
  History
} from "lucide-react";

// XP values for reference
const XP_INFO = {
  Easy: 50,
  Medium: 100,
  Hard: 200,
};

function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { data: topics, isLoading: topicsLoading } = useTopics();
  const { data: userStats, isLoading: statsLoading } = useUserStats();

  // Last visited problem for "Continue Learning"
  const [lastProblem, setLastProblem] = useState<{
    problemId: number;
    problemTitle: string;
    difficulty: string;
    topicId: number;
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cryptus_last_problem');
      if (saved) {
        setLastProblem(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error reading last problem:', e);
    }
  }, []);

  if (authLoading || topicsLoading) {
    return <DashboardSkeleton />;
  }

  // Use real stats from API
  const stats = {
    solved: userStats?.solved || 0,
    total: userStats?.total || 0,
    streak: userStats?.streak || 0,
    xp: userStats?.xp || 0,
    easyCount: userStats?.easyCount || 0,
    mediumCount: userStats?.mediumCount || 0,
    hardCount: userStats?.hardCount || 0,
  };

  const progressPercentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      <Sidebar />
      <MobileNav />
      <div className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">

          {/* Welcome Header */}
          <header className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
              Welcome back, {user?.firstName || 'Developer'}
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to conquer Data Structures & Algorithms today?
            </p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/20 to-card border-primary/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <Target className="w-5 h-5" />
                  <span className="font-semibold uppercase text-xs tracking-wider">Progress</span>
                </div>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-4xl font-bold font-mono text-white">{stats.solved}</span>
                  <span className="text-muted-foreground mb-1">/ {stats.total} Solved</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-black/40" />
                {/* Difficulty breakdown */}
                {stats.solved > 0 && (
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="text-green-500">{stats.easyCount} Easy</span>
                    <span className="text-yellow-500">{stats.mediumCount} Medium</span>
                    <span className="text-red-500">{stats.hardCount} Hard</span>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-card border-border/50 hover:border-border transition-colors group">
              <div className="flex items-center gap-3 mb-4 text-orange-500">
                <Flame className="w-5 h-5 group-hover:animate-pulse" />
                <span className="font-semibold uppercase text-xs tracking-wider">Daily Streak</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold font-mono text-white">{stats.streak}</span>
                <span className="text-muted-foreground mb-1">{stats.streak === 1 ? 'Day' : 'Days'}</span>
              </div>
              {stats.streak === 0 && (
                <p className="text-xs text-muted-foreground mt-2">Solve a problem to start your streak!</p>
              )}
            </Card>

            <Card className="p-6 bg-card border-border/50 hover:border-border transition-colors">
              <div className="flex items-center gap-3 mb-4 text-yellow-500">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold uppercase text-xs tracking-wider">Total XP</span>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold font-mono text-white">{stats.xp.toLocaleString()}</span>
                <span className="text-muted-foreground mb-1">XP</span>
              </div>
              {/* XP breakdown tooltip */}
              <div className="text-xs text-muted-foreground mt-2">
                Easy: +{XP_INFO.Easy} • Medium: +{XP_INFO.Medium} • Hard: +{XP_INFO.Hard}
              </div>
            </Card>
          </div>

          {/* Continue Learning */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary fill-primary" />
              Continue Learning
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* Show last visited problem if available */}
              {lastProblem ? (
                <Link href={`/problem/${lastProblem.problemId}`}>
                  <div className="glass-panel p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group border border-primary/20 shadow-lg shadow-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">
                            <History className="w-3 h-3 mr-1" />
                            Continue
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              lastProblem.difficulty === 'Easy' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                                lastProblem.difficulty === 'Medium' ? 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10' :
                                  'border-red-500/50 text-red-400 bg-red-500/10'
                            }
                          >
                            {lastProblem.difficulty}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {lastProblem.problemTitle}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Pick up where you left off
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : topics && topics.length > 0 ? (
                <Link href={`/topic/${topics[0].slug}`}>
                  <div className="glass-panel p-6 rounded-2xl cursor-pointer hover:bg-white/5 transition-all group border border-primary/20 shadow-lg shadow-primary/5">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                          Recommended
                        </Badge>
                        <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                          {topics[0].title}
                        </h3>
                        <p className="text-muted-foreground max-w-2xl line-clamp-2">
                          {topics[0].description}
                        </p>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ) : null}
            </div>
          </section>

          {/* Topics Grid */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">All Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topics?.map((topic) => (
                <Link key={topic.id} href={`/topic/${topic.slug}`}>
                  <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group h-full flex flex-col">
                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-primary transition-colors">
                      {topic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">
                      {topic.description}
                    </p>
                    <div className="flex items-center text-xs font-medium text-muted-foreground gap-2 pt-4 border-t border-border/50">
                      <div className="w-2 h-2 rounded-full bg-secondary/50" />
                      <span>Start Topic</span>
                      <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="w-64 h-screen bg-card border-r border-border hidden md:block" />
      <div className="flex-1 p-8 space-y-8">
        <Skeleton className="h-12 w-64 bg-muted" />
        <div className="grid grid-cols-3 gap-6">
          <Skeleton className="h-32 bg-muted rounded-xl" />
          <Skeleton className="h-32 bg-muted rounded-xl" />
          <Skeleton className="h-32 bg-muted rounded-xl" />
        </div>
        <Skeleton className="h-48 w-full bg-muted rounded-xl" />
      </div>
    </div>
  );
}

export default Dashboard;

// Little helper
function ChevronRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
