import type { IntentTier } from "@/shared/api"
import { cn } from "@/shared/lib/utils"

const tierClasses: Record<IntentTier, string> = {
  hot: "bg-success-muted text-success-muted-foreground",
  warm: "bg-warning-muted text-warning-muted-foreground",
  cold: "bg-muted text-muted-foreground",
}

export function ScoreBadge({
  score,
  tier,
  size = "sm",
  className,
}: {
  score: number
  tier: IntentTier
  size?: "sm" | "lg"
  className?: string
}) {
  return (
    <span
      aria-label={`Intent ${score} of 100`}
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-mono font-semibold tabular-nums",
        size === "sm" ? "size-9 text-sm" : "size-12 text-lg",
        tierClasses[tier],
        className,
      )}
    >
      {score}
    </span>
  )
}
