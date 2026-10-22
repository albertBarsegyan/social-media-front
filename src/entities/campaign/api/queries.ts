import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { campaignsApi, cursorPaging, workspaceScope } from "@/shared/api"

export const campaignKeys = {
  all: (wid: string) => [...workspaceScope(wid), "campaigns"] as const,
  lists: (wid: string) => [...campaignKeys.all(wid), "list"] as const,
  detail: (wid: string, cid: string) => [...campaignKeys.all(wid), "detail", cid] as const,
}

export function useCampaigns(wid: string) {
  return useInfiniteQuery({
    queryKey: campaignKeys.lists(wid),
    queryFn: ({ pageParam }) => campaignsApi.list(wid, { cursor: pageParam, limit: 20 }),
    ...cursorPaging,
  })
}

export function useCampaign(wid: string, cid: string | undefined) {
  return useQuery({
    queryKey: campaignKeys.detail(wid, cid ?? ""),
    queryFn: () => campaignsApi.get(wid, cid!),
    enabled: !!cid,
  })
}
