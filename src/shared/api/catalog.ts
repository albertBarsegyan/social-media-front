import { api } from "./client"
import type { Bundle, ChannelKey, Money } from "./types"

export interface Catalog {
  bundles: { key: Bundle; monthlyPrice: Money; setupFee: Money; includedAiBudgetUsdMicros: number; upgradeTo: Bundle | null }[]
  channels: { key: ChannelKey; kind: "listening" | "publish"; manualReply: boolean }[]
  tones: string[]
  skipReasons: string[]
  draftThreshold: number
  tierThresholds: { hot: number; warm: number }
  aiUnitCostsUsdMicros: { scoring: number; draft: number; campaignRegenerate: number }
  aiCapOptionsUsdMicros: number[]
  upload: { maxBytes: number; contentTypes: string[] }
}

export const catalogApi = {
  get: () => api.get("catalog").json<Catalog>(),
}
