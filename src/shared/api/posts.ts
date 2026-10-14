import { api, query } from "./client"
import type { Locale, Page, PageParams, PublishChannel, TrackedLink } from "./types"

export type PostStatus = "pending" | "scheduled" | "published" | "skipped"

export interface Post {
  id: string
  channel: PublishChannel
  lang: Locale
  text: string
  scheduledAt: string
  status: PostStatus
  campaignId: string | null
  trackedLink: TrackedLink | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PostListParams extends PageParams {
  /** ISO instant, inclusive */
  from: string
  /** ISO instant, exclusive; at most 62 days after `from` */
  to: string
  status?: PostStatus
}

const base = (wid: string) => `workspaces/${wid}/posts`

export const postsApi = {
  list: (wid: string, params: PostListParams) => api.get(base(wid), { searchParams: query({ ...params }) }).json<Page<Post>>(),
  reschedule: (wid: string, id: string, scheduledAt: string) =>
    api.patch(`${base(wid)}/${id}`, { json: { scheduledAt } }).json<Post>(),
  approve: (wid: string, id: string) => api.post(`${base(wid)}/${id}/approve`).json<Post>(),
  skip: (wid: string, id: string) => api.post(`${base(wid)}/${id}/skip`).json<Post>(),
  restore: (wid: string, id: string) => api.post(`${base(wid)}/${id}/restore`).json<Post>(),
}
