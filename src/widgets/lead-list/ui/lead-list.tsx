"use client"

import { InboxIcon } from "lucide-react"
import Link from "next/link"

import { LeadRow, useLeads } from "@/entities/lead"
import {
  countByTab,
  filterLeads,
  hasActiveFilters,
  leadFilterActions,
  LeadFilters,
  useLeadFilters,
} from "@/features/filter-leads"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"

/** Filterable inbox of leads; each row opens the lead. */
export function LeadList({ selectedId }: { selectedId?: string }) {
  const leads = useLeads()
  const filters = useLeadFilters()
  const visible = filterLeads(leads, filters)
  const activeId = selectedId ?? visible[0]?.id

  return (
    <div className="space-y-3">
      <LeadFilters counts={countByTab(leads)} />
      {visible.length === 0 ? (
        <EmptyState
          icon={<InboxIcon />}
          title="No leads here"
          description="Sources are scanned every 30 minutes. New buying-intent posts land here and in Telegram."
          actions={
            <>
              {hasActiveFilters(filters) ? (
                <Button size="sm" variant="outline" onClick={leadFilterActions.clear}>
                  Clear filters
                </Button>
              ) : null}
              <Button size="sm" variant="outline" asChild>
                <Link href={routes.settings("keywords")}>Edit keywords</Link>
              </Button>
            </>
          }
        />
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {visible.map((lead) => (
            <li key={lead.id}>
              <Link
                href={routes.lead(lead.id)}
                aria-current={lead.id === activeId ? "page" : undefined}
                className="block hover:bg-muted/60 xl:aria-[current=page]:bg-muted"
              >
                <LeadRow lead={lead} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
