import { draftThreshold } from "../config/lead"
import { intentTier, intentTierLabels } from "../lib/intent"
import type { Lead } from "../model/types"
import { ScoreBadge } from "./score-badge"

/** Why the AI gave this score, one bar per reason. */
export function IntentBreakdown({ lead }: { lead: Lead }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <ScoreBadge score={lead.score} size="lg" />
        <div>
          <div className="text-sm font-medium">
            {intentTierLabels[intentTier(lead.score)]} intent — why the AI scored it {lead.score}/100
          </div>
          <div className="text-xs text-muted-foreground">Drafts are written for posts scoring {draftThreshold} or more</div>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {lead.reasons.map(([reason, points]) => (
          <li key={reason} className="grid grid-cols-[minmax(0,1fr)_80px_32px] items-center gap-3 text-sm">
            <span className="truncate">{reason}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-muted">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(4, (points / 40) * 100))}%` }} />
            </span>
            <span className="text-right font-mono text-xs tabular-nums text-muted-foreground">
              {points > 0 ? `+${points}` : "0"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
