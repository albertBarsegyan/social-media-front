"use client"

import { BudgetBreakdown, BudgetMeter, budgetPeriod, formatMoney, useAiBudget } from "@/entities/ai-budget"
import { mockMembers, MemberRow } from "@/entities/member"
import { CapSettings } from "@/features/adjust-ai-cap"
import { KeywordSetsEditor, SourcesEditor, useWeeklyEstimate } from "@/features/configure-listening"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { StatRow } from "@/shared/ui/stat-row"

import { SectionCard } from "./section-card"

export function KeywordsSection() {
  const estimate = useWeeklyEstimate()
  return (
    <div className="space-y-4">
      <SectionCard
        title="Keyword sets"
        description="Phrases buyers use when asking for a recommendation, in each language."
        action={
          <Button size="sm" variant="outline" onClick={() => toast("Keyword set editor coming soon")}>
            Add set
          </Button>
        }
      >
        <KeywordSetsEditor showNegative />
      </SectionCard>
      <SectionCard title="Sources">
        <SourcesEditor />
        <p className="mt-3 text-xs text-muted-foreground">
          Scanned every 30 min · about {estimate} matches a week at current settings
        </p>
      </SectionCard>
    </div>
  )
}

export function TeamSection() {
  return (
    <SectionCard
      title="Team & roles"
      description="Approvers can approve from Telegram without a web login."
      action={
        <Button size="sm" onClick={() => toast("Invite sent")}>
          Invite
        </Button>
      }
    >
      <div className="divide-y">
        {mockMembers.map((member) => (
          <MemberRow key={member.email} member={member} />
        ))}
      </div>
    </SectionCard>
  )
}

export function UsageSection() {
  const budget = useAiBudget()
  return (
    <div className="space-y-4">
      <SectionCard title="AI budget" description="Monthly cap for scoring, drafting and repurposing in this workspace.">
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">{formatMoney(budget.used)}</span>
            <span className="text-sm text-muted-foreground">
              of {formatMoney(budget.cap)} · resets {budgetPeriod.resetsOn}
            </span>
          </div>
          <BudgetMeter budget={budget} />
          <BudgetBreakdown budget={budget} />
          <Separator />
          <CapSettings />
        </div>
      </SectionCard>
      <SectionCard title="Other usage this month">
        <div className="space-y-1.5">
          <StatRow label="Apify scraping credits" value="$2.10 / $5.00" />
          <StatRow label="Buffer · 3 channels (shared)" value="agency plan" />
          <StatRow label="Blotato · X replies" value="3 posts" />
        </div>
      </SectionCard>
    </div>
  )
}
