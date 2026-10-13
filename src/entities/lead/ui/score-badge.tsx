import { cn } from "@/shared/lib/utils"

import { intentTier, type IntentTier } from "../lib/intent"

const tierClasses: Record<IntentTier, string> = {
  hot: "bg-success-muted text-success-muted-foreground",
  warm: "bg-warning-muted text-warning-muted-foreground",
  cold: "bg-muted text-muted-foreground",
}

export function ScoreBadge({ score, size = "sm", className }: { score: number; size?: "sm" | "lg"; className?: string }) {
  return (
    <span
      aria-label={`Intent ${score} of 100`}
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-mono font-semibold tabular-nums",
        size === "sm" ? "size-9 text-sm" : "size-12 text-lg",
        tierClasses[intentTier(score)],
        className,
      )}
    >
      {score}
    </span>
  )
}
