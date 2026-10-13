import { StatRow } from "@/shared/ui/stat-row"

import type { BudgetSnapshot } from "../model/store"

export function BudgetBreakdown({ budget }: { budget: BudgetSnapshot }) {
  return (
    <div className="space-y-1.5">
      {budget.breakdown.map((row) => (
        <StatRow key={row.label} label={row.label} value={row.value} />
      ))}
    </div>
  )
}
