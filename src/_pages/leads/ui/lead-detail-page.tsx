import type { Metadata } from "next"
import { Suspense } from "react"

import { getLeadIds } from "@/entities/lead/index.server"
import { Skeleton } from "@/shared/ui/skeleton"
import { LeadReview } from "@/widgets/lead-review"

export const metadata: Metadata = { title: "Lead" }

export async function generateStaticParams() {
  return (await getLeadIds()).map((leadId) => ({ leadId }))
}

async function LeadDetail({ params }: { params: Promise<{ leadId: string }> }) {
  const { leadId } = await params
  return <LeadReview leadId={leadId} />
}

export function LeadDetailPage({ params }: { params: Promise<{ leadId: string }> }) {
  return (
    <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
      <LeadDetail params={params} />
    </Suspense>
  )
}
