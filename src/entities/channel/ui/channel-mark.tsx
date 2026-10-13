import { cn } from "@/shared/lib/utils"

/** Compact monogram for a channel (IG, f, TG, R, X). */
export function ChannelMark({ short, className }: { short: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid h-5 min-w-5 shrink-0 place-items-center rounded-md bg-muted px-1 font-mono text-[10px] font-medium text-muted-foreground",
        className,
      )}
    >
      {short}
    </span>
  )
}
