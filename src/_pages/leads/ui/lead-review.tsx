"use client"

import { ChevronLeftIcon, ExternalLinkIcon, InboxIcon } from "lucide-react"
import Link from "next/link"

import { IntentBreakdown, SourcePost, useBuyingIntent, useBuyingIntents } from "@/entities/buying-intent"
import { useCatalog } from "@/entities/catalog"
import { useCurrentWorkspace } from "@/entities/workspace"
import { setRaiseCapOpen } from "@/features/adjust-ai-cap"
import { useLeadFilters } from "@/features/filter-leads"
import { ReplyReview } from "@/features/review-reply"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

export function LeadReview({ intentId }: { intentId: string }) {
  const { workspaceId, role } = useCurrentWorkspace()
  const query = useBuyingIntent(workspaceId, intentId)
  const draftThreshold = useCatalog().data?.draftThreshold

  if (query.isPending) return <Skeleton className="h-96 rounded-xl" />
  if (query.isError) {
    return query.error.code === "NOT_FOUND" ? (
      <EmptyState
        icon={<InboxIcon />}
        title="Lead not found"
        description="It may belong to another workspace or have been removed."
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link href={routes.leads}>All leads</Link>
          </Button>
        }
      />
    ) : (
      <ErrorState error={query.error} onRetry={() => void query.refetch()} />
    )
  }

  const intent = query.data
  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 hidden md:inline-flex xl:hidden">
        <Link href={routes.leads}>
          <ChevronLeftIcon />
          All leads
        </Link>
      </Button>
      <SourcePost
        intent={intent}
        openAction={
          intent.postUrl ? (
            <Button variant="link" size="sm" asChild>
              <a href={intent.postUrl} target="_blank" rel="noopener noreferrer">
                Open original
                <ExternalLinkIcon />
              </a>
            </Button>
          ) : null
        }
      />
      <IntentBreakdown intent={intent} draftThreshold={draftThreshold} />
      <ReplyReview
        // Reset local edit state when switching between intents.
        key={intent.id}
        intent={intent}
        budgetAction={
          role === "operator" ? (
            <Button size="sm" onClick={() => setRaiseCapOpen(true)}>
              Raise cap
            </Button>
          ) : null
        }
      />
    </div>
  )
}

/** On wide screens the inbox shows the first matching lead next to the list. */
export function FirstLeadReview() {
  const { workspaceId } = useCurrentWorkspace()
  const filters = useLeadFilters()
  const first = useBuyingIntents(workspaceId, filters).data?.pages[0]?.items[0]
  return first ? <LeadReview intentId={first.id} /> : null
}
