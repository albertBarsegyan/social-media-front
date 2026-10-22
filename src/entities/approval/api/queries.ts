import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { approvalsApi, cursorPaging, workspaceScope, type ApprovalState } from "@/shared/api"

/** Counts drive the nav badges, so they refresh on their own as well. */
const SUMMARY_REFETCH_MS = 60_000

export const approvalKeys = {
  all: (wid: string) => [...workspaceScope(wid), "approvals"] as const,
  queue: (wid: string, state: ApprovalState) => [...approvalKeys.all(wid), "queue", state] as const,
  summary: (wid: string) => [...approvalKeys.all(wid), "summary"] as const,
}

export function useApprovalQueue(wid: string, state: ApprovalState) {
  return useInfiniteQuery({
    queryKey: approvalKeys.queue(wid, state),
    queryFn: ({ pageParam }) => approvalsApi.list(wid, { state, cursor: pageParam, limit: 25 }),
    ...cursorPaging,
  })
}

export function useApprovalSummary(wid: string) {
  return useQuery({
    queryKey: approvalKeys.summary(wid),
    queryFn: () => approvalsApi.summary(wid),
    refetchInterval: SUMMARY_REFETCH_MS,
  })
}
