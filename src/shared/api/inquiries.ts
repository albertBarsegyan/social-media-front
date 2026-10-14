import { api, query } from "./client"
import type { ChannelKey, Page, PageParams, TrackedLink } from "./types"

export type InquiryStatus = "new" | "won" | "lost"

/** A person contacting the business. A won inquiry is a deal. */
export interface Inquiry {
  id: string
  channel: ChannelKey | "other"
  contactName: string | null
  note: string | null
  status: InquiryStatus
  buyingIntentId: string | null
  trackedLink: TrackedLink | null
  createdAt: string
  updatedAt: string
}

const base = (wid: string) => `workspaces/${wid}/inquiries`

// No screen uses inquiries yet (TODO in the contract); the functions exist so the type stays in sync.
export const inquiriesApi = {
  list: (wid: string, params: PageParams & { status?: InquiryStatus } = {}) =>
    api.get(base(wid), { searchParams: query({ ...params }) }).json<Page<Inquiry>>(),
  create: (
    wid: string,
    input: { channel: Inquiry["channel"]; contactName?: string; note?: string; buyingIntentId?: string; trackedLinkSlug?: string },
  ) => api.post(base(wid), { json: input }).json<Inquiry>(),
  update: (wid: string, id: string, input: Partial<Pick<Inquiry, "status" | "contactName" | "note">>) =>
    api.patch(`${base(wid)}/${id}`, { json: input }).json<Inquiry>(),
}
