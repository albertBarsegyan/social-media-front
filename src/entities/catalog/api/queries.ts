import { useQuery } from "@tanstack/react-query"

import { catalogApi } from "@/shared/api"

export const catalogKeys = { all: ["catalog"] as const }

/** Business configuration from the API. It changes only on deploy, so it is cached for the session. */
export function useCatalog() {
  return useQuery({ queryKey: catalogKeys.all, queryFn: catalogApi.get, staleTime: Infinity, gcTime: Infinity })
}
