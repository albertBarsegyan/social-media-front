import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/shared/ui/skeleton"

import { LeadReview } from "./lead-review"

export const metadata: Metadata = { title: "Lead" }

async function LeadDetail({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  return <LeadReview intentId={leadId} />
}

export function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <LeadDetail params={params} />
    </Suspense>
  )
}
