import { useInfiniteQuery } from "@tanstack/react-query"

import { cursorPaging, workspaceScope, workspacesApi } from "@/shared/api"

export const memberKeys = {
  list: (wid: string) => [...workspaceScope(wid), "members"] as const,
}

export function useMembers(wid: string) {
  return useInfiniteQuery({
    queryKey: memberKeys.list(wid),
    queryFn: ({ pageParam }) => workspacesApi.members(wid, { cursor: pageParam, limit: 50 }),
    ...cursorPaging,
  })
}
