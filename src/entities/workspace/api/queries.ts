import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { cursorPaging, workspaceScope, workspacesApi } from "@/shared/api"

const LIST_PAGE_SIZE = 50

export const workspaceKeys = {
  lists: () => ["workspaces", "list"] as const,
  detail: (wid: string) => [...workspaceScope(wid), "detail"] as const,
}

/** Workspaces the viewer belongs to, sorted by name. */
export function useWorkspaces() {
  return useInfiniteQuery({
    queryKey: workspaceKeys.lists(),
    queryFn: ({ pageParam }) => workspacesApi.list({ cursor: pageParam, limit: LIST_PAGE_SIZE }),
    ...cursorPaging,
  })
}

export function useWorkspace(wid: string | undefined) {
  return useQuery({
    queryKey: workspaceKeys.detail(wid ?? ""),
    queryFn: () => workspacesApi.get(wid!),
    enabled: !!wid,
  })
}
