import { useQuery } from "@tanstack/react-query"

import { listeningApi, workspaceScope } from "@/shared/api"

export const listeningKeys = {
  config: (wid: string) => [...workspaceScope(wid), "listening"] as const,
}

export function useListeningConfig(wid: string) {
  return useQuery({ queryKey: listeningKeys.config(wid), queryFn: () => listeningApi.get(wid) })
}
