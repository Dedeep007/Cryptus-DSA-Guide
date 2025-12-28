import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import TopicView from "@/pages/TopicView";
import ProblemView from "@/pages/ProblemView";
import Leaderboard from "@/pages/Leaderboard";
import { AIAssistant } from "@/components/AIAssistant";

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/" component={user ? Dashboard : Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/topic/:slug" component={user ? TopicView : Landing} />
        <Route path="/problem/:id" component={user ? ProblemView : Landing} />
        <Route path="/leaderboard" component={user ? Leaderboard : Landing} />
        <Route component={NotFound} />
      </Switch>
      {user && <AIAssistant />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
