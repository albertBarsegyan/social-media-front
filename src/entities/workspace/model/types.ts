export type WorkspaceHealth = "ok" | "warn" | "err" | "setup"

/** One client business managed by the agency. */
export interface Workspace {
  id: string
  name: string
  type: string
  bundle: string
  initials: string
  pending: number
  leads: number | null
  deals: number | null
  /** AI budget used this month, in percent. */
  budget: number
  health: WorkspaceHealth
  healthLabel: string
  owner: string
}
