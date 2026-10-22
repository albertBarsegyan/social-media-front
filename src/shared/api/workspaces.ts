import { api, query } from "./client"
import type { Bundle, Page, PageParams, Role } from "./types"

export type WorkspaceHealthStatus = "ok" | "warn" | "err" | "setup"

export interface WorkspaceHealth {
  status: WorkspaceHealthStatus
  reason: null | "setup_incomplete" | "integration_error" | "ai_budget_high" | "ai_budget_reached"
  integration?: "buffer" | "telegram_bot" | "blotato" | "apify"
  aiBudgetPercent?: number
  onboardingStep?: number
}

export interface CreateWorkspaceInput {
  name: string
  businessType: string
  city: string
  trackingDomain: string
  bundle: Bundle
  timezone?: string
}

export interface UpdateWorkspaceInput extends Partial<CreateWorkspaceInput> {
  onboardingStep?: number
  onboardingCompleted?: boolean
}

export interface Workspace extends CreateWorkspaceInput {
  id: string
  timezone: string
  onboardingStep: number
  onboardingCompleted: boolean
  myRole: Role
  health: WorkspaceHealth
  createdAt: string
  updatedAt: string
}

export interface WorkspaceSummary {
  id: string
  name: string
  businessType: string
  city: string
  bundle: Bundle
  myRole: Role
  health: WorkspaceHealth
  ownerName: string | null
  pendingApprovals: number
  last7d: { buyingIntents: number; inquiries: number; deals: number }
  aiBudgetPercent: number
}

export interface Member {
  userId: string
  name: string
  email: string
  role: Role
  telegramLinked: boolean
  joinedAt: string
}

export const workspacesApi = {
  list: (params: PageParams = {}) => api.get("workspaces", { searchParams: query({ ...params }) }).json<Page<WorkspaceSummary>>(),
  get: (wid: string) => api.get(`workspaces/${wid}`).json<Workspace>(),
  create: (input: CreateWorkspaceInput) => api.post("workspaces", { json: input }).json<Workspace>(),
  update: (wid: string, input: UpdateWorkspaceInput) => api.patch(`workspaces/${wid}`, { json: input }).json<Workspace>(),
  members: (wid: string, params: PageParams = {}) =>
    api.get(`workspaces/${wid}/members`, { searchParams: query({ ...params }) }).json<Page<Member>>(),
}
