import type { Metadata } from "next"

import { FirstLeadReview } from "@/widgets/lead-review"

export const metadata: Metadata = { title: "Leads" }

/** `/leads`: the list comes from the layout; wide screens also preview the first lead. */
export function LeadsPage() {
  return (
    <div className="hidden xl:block">
      <FirstLeadReview />
    </div>
  )
}
