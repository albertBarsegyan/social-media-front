import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

/** A label / value line used in summaries and breakdowns. */
export function StatRow({ label, value, className }: { label: ReactNode; value: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 text-sm", className)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}
