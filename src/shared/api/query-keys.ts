import type { QueryClient } from "@tanstack/react-query"

/** Root of every workspace-scoped query key: `["workspaces", wid, area, ...]`. */
export const workspaceScope = (wid: string) => ["workspaces", wid] as const

/** Second segment of workspace-scoped keys. Entity key factories use the same names. */
export type WorkspaceArea =
  | "buying-intents"
  | "posts"
  | "approvals"
  | "reports"
  | "ai-budget"
  | "campaigns"
  | "integrations"
  | "listening"
  | "brand-profile"
  | "members"
  | "billing"

/**
 * Marks the given areas of one workspace stale (active queries refetch), plus the workspace itself and
 * the workspace list, whose cards and health summarise those areas.
 */
export function invalidateWorkspace(client: QueryClient, wid: string, areas: WorkspaceArea[]) {
  return Promise.all([
    ...areas.map((area) => client.invalidateQueries({ queryKey: [...workspaceScope(wid), area] })),
    client.invalidateQueries({ queryKey: [...workspaceScope(wid), "detail"] }),
    client.invalidateQueries({ queryKey: ["workspaces", "list"] }),
  ])
}
