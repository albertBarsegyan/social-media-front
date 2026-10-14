import type { BuyingIntent } from "./buying-intents"
import { api, query } from "./client"
import type { ApiErrorCode } from "./errors"
import type { Post } from "./posts"
import type { Page, PageParams } from "./types"

export type ApprovalKind = "reply" | "post"
export type ApprovalState = "pending" | "skipped"

export type ApprovalItem =
  | { kind: "reply"; id: string; createdAt: string; buyingIntent: BuyingIntent }
  | { kind: "post"; id: string; createdAt: string; post: Post }

export interface ApprovalSummary {
  pendingReplies: number
  pendingPosts: number
  reviewIntents: number
}

export interface BulkApprovalResult {
  updated: ApprovalItem[]
  failed: { kind: ApprovalKind; id: string; code: ApiErrorCode }[]
}

const base = (wid: string) => `workspaces/${wid}/approvals`

export const approvalsApi = {
  list: (wid: string, params: PageParams & { state: ApprovalState }) =>
    api.get(base(wid), { searchParams: query({ ...params }) }).json<Page<ApprovalItem>>(),
  summary: (wid: string) => api.get(`${base(wid)}/summary`).json<ApprovalSummary>(),
  bulk: (wid: string, action: "approve" | "skip", items: { kind: ApprovalKind; id: string }[]) =>
    api.post(`${base(wid)}/bulk`, { json: { action, items } }).json<BulkApprovalResult>(),
}
