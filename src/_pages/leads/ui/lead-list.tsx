"use client"

import { InboxIcon } from "lucide-react"
import Link from "next/link"

import { BuyingIntentRow, useBuyingIntentCounts, useBuyingIntents } from "@/entities/buying-intent"
import { useCurrentWorkspace } from "@/entities/workspace"
import { filtersOnly, hasActiveFilters, leadFilterActions, LeadFilters, useLeadFilters } from "@/features/filter-leads"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

/** Filterable inbox of buying intents; each row opens its review. */
export function LeadList({ selectedId }: { selectedId?: string }) {
  const { workspaceId } = useCurrentWorkspace()
  const filters = useLeadFilters()
  const list = useBuyingIntents(workspaceId, filters)
  const counts = useBuyingIntentCounts(workspaceId, filtersOnly(filters))
  const items = list.data?.pages.flatMap((page) => page.items) ?? []
  const activeId = selectedId ?? items[0]?.id

  return (
    <div className="space-y-3">
      <LeadFilters counts={counts.data} />
      {list.isPending ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : list.isError ? (
        <ErrorState error={list.error} onRetry={() => void list.refetch()} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<InboxIcon />}
          title="No leads here"
          description="Buying-intent posts land here (and in Telegram) as sources are scanned."
          actions={
            <>
              {hasActiveFilters(filters) ? (
                <Button size="sm" variant="outline" onClick={leadFilterActions.clear}>
                  Clear filters
                </Button>
              ) : null}
              <Button size="sm" variant="outline" asChild>
                <Link href={routes.settings("keywords")}>Keywords & sources</Link>
              </Button>
            </>
          }
        />
      ) : (
        <>
          <ul className="divide-y overflow-hidden rounded-xl border bg-card">
            {items.map((intent) => (
              <li key={intent.id}>
                <Link
                  href={routes.lead(intent.id)}
                  aria-current={intent.id === activeId ? "page" : undefined}
                  className="block hover:bg-muted/60 xl:aria-[current=page]:bg-muted"
                >
                  <BuyingIntentRow intent={intent} />
                </Link>
              </li>
            ))}
          </ul>
          {list.hasNextPage ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={list.isFetchingNextPage}
              onClick={() => void list.fetchNextPage()}
            >
              {list.isFetchingNextPage ? "Loading…" : "Load more"}
            </Button>
          ) : null}
        </>
      )}
    </div>
  )
}
