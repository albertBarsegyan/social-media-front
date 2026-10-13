import type { Workspace } from "../model/types"

export function workspaceTotals(workspaces: Workspace[]) {
  return workspaces.reduce(
    (totals, ws) => ({
      pending: totals.pending + ws.pending,
      leads: totals.leads + (ws.leads ?? 0),
      deals: totals.deals + (ws.deals ?? 0),
    }),
    { pending: 0, leads: 0, deals: 0 },
  )
}
