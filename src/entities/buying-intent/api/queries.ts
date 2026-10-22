import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import {
  buyingIntentsApi,
  cursorPaging,
  workspaceScope,
  type BuyingIntentFilters,
  type BuyingIntentListParams,
} from "@/shared/api"

const PAGE_SIZE = 25

export const buyingIntentKeys = {
  all: (wid: string) => [...workspaceScope(wid), "buying-intents"] as const,
  lists: (wid: string) => [...buyingIntentKeys.all(wid), "list"] as const,
  list: (wid: string, params: Omit<BuyingIntentListParams, "cursor" | "limit">) =>
    [...buyingIntentKeys.lists(wid), params] as const,
  counts: (wid: string, filters: BuyingIntentFilters) => [...buyingIntentKeys.all(wid), "counts", filters] as const,
  detail: (wid: string, id: string) => [...buyingIntentKeys.all(wid), "detail", id] as const,
}

export function useBuyingIntents(wid: string, params: Omit<BuyingIntentListParams, "cursor" | "limit">) {
  return useInfiniteQuery({
    queryKey: buyingIntentKeys.list(wid, params),
    queryFn: ({ pageParam }) => buyingIntentsApi.list(wid, { ...params, cursor: pageParam, limit: PAGE_SIZE }),
    ...cursorPaging,
  })
}

export function useBuyingIntentCounts(wid: string, filters: BuyingIntentFilters) {
  return useQuery({ queryKey: buyingIntentKeys.counts(wid, filters), queryFn: () => buyingIntentsApi.counts(wid, filters) })
}

export function useBuyingIntent(wid: string, id: string | undefined) {
  return useQuery({
    queryKey: buyingIntentKeys.detail(wid, id ?? ""),
    queryFn: () => buyingIntentsApi.get(wid, id!),
    enabled: !!id,
  })
}
