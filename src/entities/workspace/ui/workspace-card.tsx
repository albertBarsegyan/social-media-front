import type { ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

import type { Workspace } from "../model/types"
import { HealthStatus } from "./health-status"
import { WorkspaceAvatar } from "./workspace-avatar"

function Metric({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm font-medium tabular-nums">{children}</div>
    </div>
  )
}

/** Client overview card on the agency "All clients" page. */
export function WorkspaceCard({ workspace, action }: { workspace: Workspace; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <WorkspaceAvatar initials={workspace.initials} className="size-10" />
        <div className="min-w-0">
          <div className="truncate font-medium">{workspace.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {workspace.type} · {workspace.bundle}
          </div>
        </div>
      </div>
      <HealthStatus health={workspace.health} label={workspace.healthLabel} />
      <div className="grid grid-cols-4 gap-2">
        <Metric label="To approve">{workspace.pending}</Metric>
        <Metric label="Leads">{workspace.leads ?? "—"}</Metric>
        <Metric label="Deals">{workspace.deals ?? "—"}</Metric>
        <Metric label="AI budget">
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              className={cn("block h-full rounded-full", workspace.budget >= 90 ? "bg-warning" : "bg-primary")}
              style={{ width: `${workspace.budget}%` }}
            />
          </span>
        </Metric>
      </div>
      {action}
    </div>
  )
}
