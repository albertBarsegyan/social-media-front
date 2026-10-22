import type { BuyingIntent } from "@/shared/api"

import { tierLabels } from "../config/buying-intent"
import { ScoreBadge } from "./score-badge"

/** Why the AI gave this score, one bar per reason. */
export function IntentBreakdown({ intent, draftThreshold }: { intent: BuyingIntent; draftThreshold?: number }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <ScoreBadge score={intent.score} tier={intent.tier} size="lg" />
        <div>
          <div className="text-sm font-medium">
            {tierLabels[intent.tier]} intent — why it scored {intent.score}/100
          </div>
          {draftThreshold !== undefined ? (
            <div className="text-xs text-muted-foreground">Drafts are written for posts scoring {draftThreshold} or more</div>
          ) : null}
        </div>
      </div>
      {intent.reasons.length ? (
        <ul className="mt-4 space-y-2">
          {intent.reasons.map((reason, index) => (
            <li key={`${reason.label}-${index}`} className="grid grid-cols-[minmax(0,1fr)_80px_32px] items-center gap-3 text-sm">
              <span className="truncate">{reason.label}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-muted">
                <span
                  className="block h-full rounded-full bg-primary"
                  style={{ width: `${Math.min(100, Math.max(4, (reason.points / 40) * 100))}%` }}
                />
              </span>
              <span className="text-right font-mono text-xs text-muted-foreground tabular-nums">
                {reason.points > 0 ? `+${reason.points}` : "0"}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No scoring reasons recorded.</p>
      )}
    </div>
  )
}
