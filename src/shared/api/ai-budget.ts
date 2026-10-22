import { api } from "./client"

export interface AiBudget {
  /** YYYY-MM-DD */
  periodStart: string
  /** YYYY-MM-DD */
  resetsOn: string
  usedUsdMicros: number
  capUsdMicros: number
  percent: number
  level: "normal" | "high" | "reached"
  /** reached && hardCap: scoring, drafting and repurposing are blocked */
  paused: boolean
  hardCap: boolean
  alertAt80: boolean
  breakdown: { job: "scoring" | "drafting" | "repurposing"; count: number; usdMicros: number }[]
}

export type AiBudgetSettings = Partial<Pick<AiBudget, "capUsdMicros" | "hardCap" | "alertAt80">>

export const aiBudgetApi = {
  get: (wid: string) => api.get(`workspaces/${wid}/ai-budget`).json<AiBudget>(),
  update: (wid: string, input: AiBudgetSettings) => api.patch(`workspaces/${wid}/ai-budget`, { json: input }).json<AiBudget>(),
}
