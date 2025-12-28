import { useLeaderboard } from "@/hooks/use-curriculum";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Flame, Target, Crown, Loader2, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function Leaderboard() {
    const { user } = useAuth();
    const { data: leaderboard, isLoading, refetch, dataUpdatedAt, isFetching } = useLeaderboard();
    const [lastUpdated, setLastUpdated] = useState<string>("");

    // Update the "last updated" timestamp
    useEffect(() => {
        const updateTimestamp = () => {
            if (dataUpdatedAt) {
                const seconds = Math.floor((Date.now() - dataUpdatedAt) / 1000);
                if (seconds < 60) {
                    setLastUpdated(`${seconds}s ago`);
                } else if (seconds < 3600) {
                    setLastUpdated(`${Math.floor(seconds / 60)}m ago`);
                } else {
                    setLastUpdated(`${Math.floor(seconds / 3600)}h ago`);
                }
            }
        };

        updateTimestamp();
        const interval = setInterval(updateTimestamp, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, [dataUpdatedAt]);

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
        if (rank === 2) return <Medal className="w-5 h-5 text-gray-300" />;
        if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-mono text-sm">#{rank}</span>;
    };

    const getRankStyle = (rank: number) => {
        if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 border-yellow-500/30";
        if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-400/5 border-gray-400/30";
        if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-600/5 border-amber-600/30";
        return "bg-card/50 border-border/50 hover:bg-white/5";
    };

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                <Trophy className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
                                <p className="text-muted-foreground">Compete with fellow coders and climb the ranks!</p>
                            </div>
                        </div>

                        {/* Refresh Controls */}
                        <div className="flex items-center gap-3">
                            {lastUpdated && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>Updated {lastUpdated}</span>
                                </div>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="gap-2"
                            >
                                <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Ranking Criteria Info */}
                    <div className="glass-panel rounded-xl p-4 mb-6 flex items-center gap-6 text-sm">
                        <span className="text-muted-foreground">Ranking priority:</span>
                        <div className="flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-green-400" />
                            <span className="text-white">Problems Solved</span>
                        </div>
                        <span className="text-muted-foreground">&lt;</span>
                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-primary" />
                            <span className="text-white">XP</span>
                        </div>
                        <span className="text-muted-foreground">&lt;</span>
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-400" />
                            <span className="text-white">Streak</span>
                        </div>
                        <div className="ml-auto text-xs text-muted-foreground">
                            Auto-refreshes every 5 min
                        </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="glass-panel rounded-2xl overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 md:px-6 py-4 border-b border-border/50 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            <div className="col-span-2 md:col-span-1">Rank</div>
                            <div className="col-span-6 md:col-span-5">User</div>
                            <div className="hidden md:block col-span-2 text-center">XP</div>
                            <div className="hidden md:block col-span-2 text-center">Solved</div>
                            <div className="col-span-4 md:col-span-2 text-center">Streak</div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Leaderboard Entries */}
                        {leaderboard && leaderboard.length > 0 ? (
                            <div className="divide-y divide-border/30">
                                {leaderboard.map((entry) => {
                                    const isCurrentUser = entry.userId === user?.id;
                                    return (
                                        <div
                                            key={entry.userId}
                                            className={cn(
                                                "grid grid-cols-12 gap-4 px-6 py-4 items-center transition-all border-l-2",
                                                getRankStyle(entry.rank),
                                                isCurrentUser && "ring-1 ring-primary/50 bg-primary/5"
                                            )}
                                        >
                                            {/* Rank */}
                                            <div className="col-span-2 md:col-span-1 flex items-center">
                                                {getRankIcon(entry.rank)}
                                            </div>

                                            {/* User */}
                                            <div className="col-span-6 md:col-span-5 flex items-center gap-2 md:gap-3">
                                                {entry.profileImageUrl ? (
                                                    <img
                                                        src={entry.profileImageUrl}
                                                        alt={entry.firstName}
                                                        className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-white/10"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                        {entry.firstName[0]}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className={cn(
                                                        "font-medium text-xs md:text-sm truncate",
                                                        isCurrentUser ? "text-primary" : "text-white"
                                                    )}>
                                                        {entry.firstName} {entry.lastName}
                                                        {isCurrentUser && <span className="hidden md:inline ml-2 text-[10px] text-primary">(You)</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* XP */}
                                            <div className="hidden md:block col-span-2 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                                                    <Target className="w-3 h-3" />
                                                    {entry.xp.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Solved */}
                                            <div className="hidden md:block col-span-2 text-center">
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-400 font-bold text-xs">
                                                    <Trophy className="w-3 h-3" />
                                                    {entry.solved}
                                                </span>
                                            </div>

                                            {/* Streak */}
                                            <div className="col-span-4 md:col-span-2 text-center">
                                                <span className="inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 font-bold text-[10px] md:text-xs">
                                                    <Flame className="w-3 h-3" />
                                                    {entry.streak}<span className="hidden md:inline"> days</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : !isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <Trophy className="w-16 h-16 mb-4 opacity-30" />
                                <p className="text-lg">No rankings yet</p>
                                <p className="text-sm">Start solving problems to appear on the leaderboard!</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            </main>
        </div>
    );
}
