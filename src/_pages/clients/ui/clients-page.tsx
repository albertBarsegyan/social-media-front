import type { Metadata } from "next"
import Link from "next/link"

import { mockWorkspaces, WorkspaceCard, workspaceTotals } from "@/entities/workspace"
import { OpenWorkspaceButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = { title: "All clients" }

export function ClientsPage() {
  const workspaces = mockWorkspaces
  const totals = workspaceTotals(workspaces)
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{workspaces.length} client workspaces</h2>
          <p className="text-sm text-muted-foreground">
            {totals.pending} drafts waiting · {totals.leads} leads and {totals.deals} deals this week
          </p>
        </div>
        <Button asChild>
          <Link href={routes.onboarding}>New workspace</Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} action={<OpenWorkspaceButton workspace={workspace} />} />
        ))}
      </div>
    </div>
  )
}
