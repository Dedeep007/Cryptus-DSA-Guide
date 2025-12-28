import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTopics } from "@/hooks/use-curriculum";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Code2,
  LayoutDashboard,
  Trophy,
  LogOut,
  ChevronRight,
  BookOpen,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const { data: topics } = useTopics();

  return (
    <div className="flex flex-col h-full bg-card">
      <Link href="/">
        <div
          className="p-6 border-b border-border/50 cursor-pointer hover:bg-white/5 transition-colors"
          onClick={onClose}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight text-white">CRYPTUS</h1>
              <p className="text-xs text-muted-foreground font-mono">Master DSA</p>
            </div>
          </div>
        </div>
      </Link>

      <ScrollArea className="flex-1 py-4 px-3">
        <div className="space-y-1 mb-8">
          <Link href="/">
            <div
              className={cn("nav-item cursor-pointer", location === "/" && "active")}
              onClick={onClose}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </Link>
          <Link href="/leaderboard">
            <div
              className={cn("nav-item cursor-pointer", location === "/leaderboard" && "active")}
              onClick={onClose}
            >
              <Trophy className="w-4 h-4" />
              <span>Leaderboard</span>
            </div>
          </Link>
        </div>

        <div className="px-4 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Curriculum</h3>
        </div>

        <div className="space-y-1">
          {topics?.map((topic) => (
            <Link key={topic.id} href={`/topic/${topic.slug}`}>
              <div
                className={cn(
                  "nav-item cursor-pointer group justify-between",
                  location.includes(`/topic/${topic.slug}`) && "active"
                )}
                onClick={onClose}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="truncate">{topic.title}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-primary/50" />
              </div>
            </Link>
          ))}
          {!topics && (
            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
              Loading topics...
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 bg-black/20">
        {user ? (
          <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white/5">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.firstName || 'User'}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                {user.firstName?.[0] || user.email?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-white">{user.firstName || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        ) : null}

        <Button
          variant="outline"
          className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-card border-r border-border flex-col fixed left-0 top-0 z-20 hidden md:flex">
      <SidebarContent />
    </div>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-border bg-card/80 backdrop-blur-md z-30 px-4 flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white tracking-tight">CRYPTUS</span>
        </div>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="w-6 h-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 border-r border-border bg-card">
          <SidebarContent onClose={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}

