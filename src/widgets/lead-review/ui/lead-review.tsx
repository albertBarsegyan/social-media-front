"use client"

import { ChevronLeftIcon, ExternalLinkIcon, InboxIcon } from "lucide-react"
import Link from "next/link"

import { IntentBreakdown, LeadSourcePost, useLead, useLeads } from "@/entities/lead"
import { setRaiseCapOpen } from "@/features/adjust-ai-cap"
import { filterLeads, useLeadFilters } from "@/features/filter-leads"
import { ReplyReview } from "@/features/review-reply"
import { routes } from "@/shared/config"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"

export function LeadReview({ leadId }: { leadId: string }) {
  const lead = useLead(leadId)

  if (!lead) {
    return (
      <EmptyState
        icon={<InboxIcon />}
        title="Lead not found"
        description="It may have been removed from the inbox."
        actions={
          <Button size="sm" variant="outline" asChild>
            <Link href={routes.leads}>All leads</Link>
          </Button>
        }
      />
    )
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="-ml-2 hidden md:inline-flex xl:hidden">
        <Link href={routes.leads}>
          <ChevronLeftIcon />
          All leads
        </Link>
      </Button>
      <LeadSourcePost
        lead={lead}
        openAction={
          <Button variant="link" size="sm" onClick={() => toast(`Opening ${lead.where}`)}>
            Open original
            <ExternalLinkIcon />
          </Button>
        }
      />
      <IntentBreakdown lead={lead} />
      <ReplyReview
        key={lead.id}
        lead={lead}
        budgetAction={
          <Button size="sm" onClick={() => setRaiseCapOpen(true)}>
            Raise cap
          </Button>
        }
      />
    </div>
  )
}

/** On wide screens the inbox shows the first matching lead next to the list. */
export function FirstLeadReview() {
  const leads = useLeads()
  const filters = useLeadFilters()
  const first = filterLeads(leads, filters)[0]
  return first ? <LeadReview leadId={first.id} /> : null
}
