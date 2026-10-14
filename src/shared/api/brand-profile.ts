import { api } from "./client"
import type { Locale } from "./types"

export interface BrandProfileInput {
  offer: string
  audience: string
  tones: string[]
  languages: Locale[]
  bannedPhrases: string[]
}

export interface BrandProfile extends BrandProfileInput {
  updatedAt: string
}

export const brandProfileApi = {
  get: (wid: string) => api.get(`workspaces/${wid}/brand-profile`).json<BrandProfile>(),
  put: (wid: string, input: BrandProfileInput) => api.put(`workspaces/${wid}/brand-profile`, { json: input }).json<BrandProfile>(),
}
