import { useQuery } from "@tanstack/react-query"

import { authApi } from "@/shared/api"

export const viewerKeys = { me: ["me"] as const }

/** The signed-in user. */
export function useViewer() {
  return useQuery({ queryKey: viewerKeys.me, queryFn: authApi.me, staleTime: 5 * 60_000 })
}
