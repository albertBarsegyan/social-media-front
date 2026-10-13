import { cn } from "@/shared/lib/utils"
import { Progress } from "@/shared/ui/progress"

import type { BudgetSnapshot } from "../model/store"

const indicatorClasses: Record<BudgetSnapshot["level"], string> = {
  normal: "",
  high: "*:data-[slot=progress-indicator]:bg-warning",
  reached: "*:data-[slot=progress-indicator]:bg-destructive",
}

export function BudgetMeter({ budget, className }: { budget: BudgetSnapshot; className?: string }) {
  return (
    <Progress
      value={budget.percent}
      aria-label={`AI budget ${budget.percent}% used`}
      className={cn("h-1.5 bg-muted", indicatorClasses[budget.level], className)}
    />
  )
}
