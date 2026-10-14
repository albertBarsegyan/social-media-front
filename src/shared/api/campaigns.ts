import { api, query } from "./client"
import type { Post } from "./posts"
import type { Locale, Page, PageParams, PublishChannel } from "./types"
import type { Upload } from "./uploads"

export type VariantStatus = "draft" | "approved"

export interface Variant {
  id: string
  channel: PublishChannel
  lang: Locale
  text: string
  status: VariantStatus
  /** Set once scheduled as a post. */
  postId: string | null
  updatedAt: string
}

export interface CampaignSummary {
  id: string
  title: string
  createdAt: string
  approvedCount: number
  variantCount: number
}

export interface Campaign {
  id: string
  title: string
  summary: string
  channels: PublishChannel[]
  languages: Locale[]
  uploads: Upload[]
  variants: Variant[]
  createdAt: string
  updatedAt: string
}

export interface CreateCampaignInput {
  title: string
  summary: string
  uploadIds: string[]
  channels: PublishChannel[]
  languages: Locale[]
}

const base = (wid: string) => `workspaces/${wid}/campaigns`

export const campaignsApi = {
  list: (wid: string, params: PageParams = {}) =>
    api.get(base(wid), { searchParams: query({ ...params }) }).json<Page<CampaignSummary>>(),
  get: (wid: string, cid: string) => api.get(`${base(wid)}/${cid}`).json<Campaign>(),
  create: (wid: string, input: CreateCampaignInput) => api.post(base(wid), { json: input }).json<Campaign>(),
  generate: (wid: string, cid: string, target: { channel?: PublishChannel; lang?: Locale } = {}) =>
    api.post(`${base(wid)}/${cid}/generate`, { json: target }).json<Campaign>(),
  updateVariant: (wid: string, cid: string, variantId: string, input: { text?: string; status?: VariantStatus }) =>
    api.patch(`${base(wid)}/${cid}/variants/${variantId}`, { json: input }).json<Variant>(),
  approveChannel: (wid: string, cid: string, channel: PublishChannel) =>
    api.post(`${base(wid)}/${cid}/approve-channel`, { json: { channel } }).json<Campaign>(),
  schedule: (wid: string, cid: string, startDate?: string) =>
    api.post(`${base(wid)}/${cid}/schedule`, { json: startDate ? { startDate } : {} }).json<{ posts: Post[] }>(),
}
