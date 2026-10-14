"use client"

import { BudgetBreakdown, BudgetMeter, useAiBudget } from "@/entities/ai-budget"
import { useListeningConfig } from "@/entities/listening"
import { MemberRow, useMembers } from "@/entities/member"
import { useCurrentWorkspace } from "@/entities/workspace"
import { CapSettings } from "@/features/adjust-ai-cap"
import { KeywordSetsEditor, SourcesEditor } from "@/features/configure-listening"
import { IntegrationList } from "@/features/connect-integration"
import { BrandProfileEditor } from "@/features/edit-brand-profile"
import { formatDate, formatUsdMicros } from "@/shared/lib/format"
import { Button } from "@/shared/ui/button"
import { ErrorState } from "@/shared/ui/error-state"
import { Separator } from "@/shared/ui/separator"
import { Skeleton } from "@/shared/ui/skeleton"

import { SectionCard } from "./section-card"

export function BrandSection() {
  const { workspaceId, role } = useCurrentWorkspace()
  return (
    <SectionCard title="Brand profile" description="The AI reads this before every reply and post.">
      <BrandProfileEditor wid={workspaceId} canEdit={role === "operator"} />
    </SectionCard>
  )
}

export function KeywordsSection() {
  const { workspaceId, role } = useCurrentWorkspace()
  const query = useListeningConfig(workspaceId)
  const canEdit = role === "operator"

  if (query.isPending) return <Skeleton className="h-96 rounded-xl" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />

  return (
    <div className="space-y-4">
      <SectionCard title="Keyword sets" description="Phrases buyers use when asking for a recommendation, in each language.">
        <KeywordSetsEditor wid={workspaceId} config={query.data} canEdit={canEdit} showNegative />
      </SectionCard>
      <SectionCard title="Sources">
        <SourcesEditor wid={workspaceId} config={query.data} canEdit={canEdit} />
        <p className="mt-3 text-xs text-muted-foreground">
          Scanned every {query.data.scanIntervalMinutes} min · about {query.data.estimatedWeeklyMatches} matches a week at current
          settings
        </p>
      </SectionCard>
    </div>
  )
}

export function ChannelsSection() {
  const { workspaceId, role } = useCurrentWorkspace()
  return (
    <SectionCard title="Channels" description="We publish only through approved wrapper APIs — never mass DMs or gated platform APIs.">
      <IntegrationList wid={workspaceId} canManage={role === "operator"} />
    </SectionCard>
  )
}

export function TeamSection() {
  const { workspaceId } = useCurrentWorkspace()
  const members = useMembers(workspaceId)
  const rows = members.data?.pages.flatMap((page) => page.items) ?? []
  return (
    <SectionCard title="Team & roles" description="Approvers can approve from Telegram without a web login.">
      {members.isPending ? (
        <Skeleton className="h-40" />
      ) : members.isError ? (
        <ErrorState error={members.error} onRetry={() => void members.refetch()} />
      ) : (
        <>
          <div className="divide-y">
            {rows.map((member) => (
              <MemberRow key={member.userId} member={member} />
            ))}
          </div>
          {members.hasNextPage ? (
            <Button variant="outline" size="sm" disabled={members.isFetchingNextPage} onClick={() => void members.fetchNextPage()}>
              Load more
            </Button>
          ) : null}
        </>
      )}
    </SectionCard>
  )
}

export function UsageSection() {
  const { workspaceId } = useCurrentWorkspace()
  const budget = useAiBudget(workspaceId)
  return (
    <SectionCard title="AI budget" description="Monthly cap for scoring, drafting and repurposing in this workspace.">
      {budget.isPending ? (
        <Skeleton className="h-64" />
      ) : budget.isError ? (
        <ErrorState error={budget.error} onRetry={() => void budget.refetch()} />
      ) : (
        <div className="space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">{formatUsdMicros(budget.data.usedUsdMicros)}</span>
            <span className="text-sm text-muted-foreground">
              of {formatUsdMicros(budget.data.capUsdMicros)} · resets {formatDate(budget.data.resetsOn)}
            </span>
          </div>
          <BudgetMeter budget={budget.data} />
          <BudgetBreakdown budget={budget.data} />
          <Separator />
          <CapSettings budget={budget.data} />
        </div>
      )}
    </SectionCard>
  )
}
