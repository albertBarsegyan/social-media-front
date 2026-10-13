"use client"

import { useParams } from "next/navigation"
import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"
import { LeadList } from "@/widgets/lead-list"

/** List and detail side by side on wide screens; one at a time below xl. */
export function LeadsLayout({ children }: { children: ReactNode }) {
  const { leadId } = useParams<{ leadId?: string }>()
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(300px,380px)_minmax(0,1fr)]">
      <div className={cn(leadId && "hidden xl:block")}>
        <LeadList selectedId={leadId} />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
