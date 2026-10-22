import { useQuery } from "@tanstack/react-query"

import { brandProfileApi, workspaceScope } from "@/shared/api"

export const brandProfileKeys = {
  detail: (wid: string) => [...workspaceScope(wid), "brand-profile"] as const,
}

export function useBrandProfile(wid: string | undefined) {
  return useQuery({
    queryKey: brandProfileKeys.detail(wid ?? ""),
    queryFn: () => brandProfileApi.get(wid!),
    enabled: !!wid,
  })
}
