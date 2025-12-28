import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DifficultyBadgeProps {
    difficulty: string | undefined;
    className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
    if (!difficulty) return null;

    const normalized = difficulty.trim().toLowerCase();

    const getStyle = () => {
        switch (normalized) {
            case "easy":
                return "border-green-500/50 text-green-400 bg-green-500/10";
            case "medium":
                return "border-yellow-500/50 text-yellow-400 bg-yellow-500/10";
            case "hard":
                return "border-red-500/50 text-red-400 bg-red-500/10";
            default:
                return "border-muted text-muted-foreground bg-muted/10";
        }
    };

    const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();

    return (
        <Badge
            variant="outline"
            className={cn("font-mono", getStyle(), className)}
        >
            {label}
        </Badge>
    );
}
