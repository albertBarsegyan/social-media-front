import type { AiBudget } from "@/shared/api"
import { formatCount, formatUsdMicros } from "@/shared/lib/format"
import { StatRow } from "@/shared/ui/stat-row"

import { jobLabels } from "../config/budget"

export function BudgetBreakdown({ budget }: { budget: AiBudget }) {
  return (
    <div className="space-y-1.5">
      {budget.breakdown.map((row) => (
        <StatRow
          key={row.job}
          label={`${jobLabels[row.job]} · ${formatCount(row.count)}`}
          value={formatUsdMicros(row.usdMicros)}
        />
      ))}
    </div>
  )
}
