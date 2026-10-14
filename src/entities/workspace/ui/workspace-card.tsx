import type { ReactNode } from "react"

import type { WorkspaceSummary } from "@/shared/api"
import { cn } from "@/shared/lib/utils"

import { bundleLabels } from "../config/workspace"
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

/** Client overview card on the agency "All clients" page. Metrics cover the last 7 days. */
export function WorkspaceCard({ workspace, action }: { workspace: WorkspaceSummary; action?: ReactNode }) {
  const leadsBundle = workspace.bundle !== "content"
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <WorkspaceAvatar name={workspace.name} className="size-10" />
        <div className="min-w-0">
          <div className="truncate font-medium">{workspace.name}</div>
          <div className="truncate text-xs text-muted-foreground">
            {workspace.businessType} · {workspace.city} · {bundleLabels[workspace.bundle]}
          </div>
        </div>
      </div>
      <HealthStatus health={workspace.health} />
      <div className="grid grid-cols-4 gap-2">
        <Metric label="To approve">{workspace.pendingApprovals}</Metric>
        <Metric label="Leads">{leadsBundle ? workspace.last7d.buyingIntents : "—"}</Metric>
        <Metric label="Deals">{leadsBundle ? workspace.last7d.deals : "—"}</Metric>
        <Metric label="AI budget">
          <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-muted">
            <span
              className={cn("block h-full rounded-full", workspace.aiBudgetPercent >= 90 ? "bg-warning" : "bg-primary")}
              style={{ width: `${workspace.aiBudgetPercent}%` }}
            />
          </span>
        </Metric>
      </div>
      {action}
    </div>
  )
}
