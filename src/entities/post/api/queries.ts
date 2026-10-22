import { useQuery } from "@tanstack/react-query"

import { fetchAllPages, postsApi, workspaceScope } from "@/shared/api"

export const postKeys = {
  all: (wid: string) => [...workspaceScope(wid), "posts"] as const,
  range: (wid: string, from: string, to: string) => [...postKeys.all(wid), "range", from, to] as const,
}

/** Every post scheduled in [from, to). A calendar week is small, so all pages are loaded. */
export function usePostsInRange(wid: string, from: Date, to: Date) {
  const fromIso = from.toISOString()
  const toIso = to.toISOString()
  return useQuery({
    queryKey: postKeys.range(wid, fromIso, toIso),
    queryFn: () => fetchAllPages((cursor) => postsApi.list(wid, { from: fromIso, to: toIso, cursor, limit: 100 })),
  })
}
