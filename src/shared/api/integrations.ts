import { api } from "./client"

export type IntegrationProvider = "buffer" | "telegram_bot" | "blotato" | "apify"

export interface Integration {
  provider: IntegrationProvider
  purpose: "publishing" | "approvals" | "x_replies" | "listening"
  required: boolean
  status: "not_connected" | "connected" | "error"
  accountLabel: string | null
  errorCode: string | null
  telegramLinkCode: string | null
  connectedAt: string | null
}

export const integrationsApi = {
  list: (wid: string) => api.get(`workspaces/${wid}/integrations`).json<Integration[]>(),
  connect: (wid: string, provider: IntegrationProvider) =>
    api.post(`workspaces/${wid}/integrations/${provider}/connect`).json<Integration>(),
  disconnect: (wid: string, provider: IntegrationProvider) =>
    api.post(`workspaces/${wid}/integrations/${provider}/disconnect`).json<Integration>(),
}
