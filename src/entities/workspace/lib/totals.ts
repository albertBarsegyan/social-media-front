import type { WorkspaceSummary } from "@/shared/api"

export function workspaceTotals(workspaces: WorkspaceSummary[]) {
  return workspaces.reduce(
    (totals, ws) => ({
      pending: totals.pending + ws.pendingApprovals,
      buyingIntents: totals.buyingIntents + ws.last7d.buyingIntents,
      deals: totals.deals + ws.last7d.deals,
    }),
    { pending: 0, buyingIntents: 0, deals: 0 },
  )
}
