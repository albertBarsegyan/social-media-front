"use client"

import Link from "next/link"

import { useCurrentWorkspace, useWorkspaces, WorkspaceCard, workspaceTotals } from "@/entities/workspace"
import { OpenWorkspaceButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

export function ClientsOverview() {
  // The shell already loaded the list; this keeps paging available for large agencies.
  const { workspaces } = useCurrentWorkspace()
  const query = useWorkspaces()
  const totals = workspaceTotals(workspaces)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {workspaces.length} client workspace{workspaces.length === 1 ? "" : "s"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {totals.pending} drafts waiting · {totals.buyingIntents} leads and {totals.deals} deals in the last 7 days
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
      {query.hasNextPage ? (
        <Button variant="outline" disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>
          {query.isFetchingNextPage ? "Loading…" : "Load more"}
        </Button>
      ) : null}
    </div>
  )
}
