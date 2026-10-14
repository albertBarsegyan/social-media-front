import { api, query } from "./client"
import type { IntentTier, ListeningChannel, Locale, Page, PageParams, TrackedLink } from "./types"

export type BuyingIntentStatus = "draft_ready" | "no_draft" | "approved" | "posted" | "skipped"
export type BuyingIntentTab = "review" | "done" | "skipped"

/** A public post that expresses buying intent, plus the reply drafted for it. */
export interface BuyingIntent {
  id: string
  channel: ListeningChannel
  sourceName: string
  author: string
  postUrl: string | null
  lang: Locale
  title: string | null
  text: string
  authorPostedAt: string | null
  foundAt: string
  score: number
  tier: IntentTier
  reasons: { label: string; points: number }[]
  draft: string | null
  edited: boolean
  trackedLink: TrackedLink | null
  status: BuyingIntentStatus
  skipReason: string | null
  approvedBy: { id: string; name: string } | null
  approvedAt: string | null
  repliedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface BuyingIntentFilters {
  tier?: IntentTier
  channel?: ListeningChannel
  lang?: Locale
}

export interface BuyingIntentListParams extends BuyingIntentFilters, PageParams {
  tab: BuyingIntentTab
}

export type BuyingIntentCounts = Record<BuyingIntentTab, number>

export interface IngestBuyingIntentInput {
  channel: ListeningChannel
  sourceName: string
  author: string
  postUrl?: string
  lang: Locale
  title?: string
  text: string
  authorPostedAt?: string
  score?: number
  reasons?: { label: string; points: number }[]
}

const base = (wid: string) => `workspaces/${wid}/buying-intents`

export const buyingIntentsApi = {
  list: (wid: string, params: BuyingIntentListParams) =>
    api.get(base(wid), { searchParams: query({ ...params }) }).json<Page<BuyingIntent>>(),
  counts: (wid: string, filters: BuyingIntentFilters = {}) =>
    api.get(`${base(wid)}/counts`, { searchParams: query({ ...filters }) }).json<BuyingIntentCounts>(),
  get: (wid: string, id: string) => api.get(`${base(wid)}/${id}`).json<BuyingIntent>(),
  ingest: (wid: string, input: IngestBuyingIntentInput) => api.post(base(wid), { json: input }).json<BuyingIntent>(),
  saveDraft: (wid: string, id: string, draft: string) =>
    api.patch(`${base(wid)}/${id}/draft`, { json: { draft } }).json<BuyingIntent>(),
  generateDraft: (wid: string, id: string) => api.post(`${base(wid)}/${id}/generate-draft`).json<BuyingIntent>(),
  approve: (wid: string, id: string) => api.post(`${base(wid)}/${id}/approve`).json<BuyingIntent>(),
  skip: (wid: string, id: string, reason: string) =>
    api.post(`${base(wid)}/${id}/skip`, { json: { reason } }).json<BuyingIntent>(),
  restore: (wid: string, id: string) => api.post(`${base(wid)}/${id}/restore`).json<BuyingIntent>(),
  markPosted: (wid: string, id: string) => api.post(`${base(wid)}/${id}/mark-posted`).json<BuyingIntent>(),
}
