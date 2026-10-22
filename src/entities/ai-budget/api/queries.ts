import { useQuery } from "@tanstack/react-query"

import { aiBudgetApi, workspaceScope } from "@/shared/api"

export const aiBudgetKeys = {
  detail: (wid: string) => [...workspaceScope(wid), "ai-budget"] as const,
}

export function useAiBudget(wid: string) {
  return useQuery({ queryKey: aiBudgetKeys.detail(wid), queryFn: () => aiBudgetApi.get(wid) })
}
