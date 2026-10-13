import type { Integration } from "../model/types"

export const mockIntegrations: Integration[] = [
  { id: "buffer", name: "Buffer", role: "Publishing", detail: "Instagram @mila.beauty · Facebook page Mila Beauty Studio · Telegram channel @milabeauty", status: "Connected" },
  { id: "telegram-bot", name: "Telegram bot", role: "Approvals & alerts", detail: "@NeoGrowthBot → Mila Petrosyan, Albert Hakobyan", status: "Connected" },
  { id: "blotato", name: "Blotato", role: "X replies", detail: "Posts approved X replies from @mila.beauty", status: "Connected" },
  { id: "apify", name: "Apify", role: "Listening", detail: "Reddit, Facebook groups, Telegram groups, X search · every 30 min", status: "Connected · $2.10 of $5 credits" },
]
