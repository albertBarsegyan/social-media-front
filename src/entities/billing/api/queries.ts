import { useQuery } from "@tanstack/react-query"

import { billingApi, workspaceScope } from "@/shared/api"

export const billingKeys = {
  detail: (wid: string) => [...workspaceScope(wid), "billing"] as const,
}

export function useBilling(wid: string, options: { enabled?: boolean } = {}) {
  return useQuery({ queryKey: billingKeys.detail(wid), queryFn: () => billingApi.get(wid), enabled: options.enabled })
}
