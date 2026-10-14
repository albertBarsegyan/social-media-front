import { useQuery } from "@tanstack/react-query"

import { integrationsApi, workspaceScope } from "@/shared/api"

export const integrationKeys = {
  list: (wid: string) => [...workspaceScope(wid), "integrations"] as const,
}

export function useIntegrations(wid: string) {
  return useQuery({ queryKey: integrationKeys.list(wid), queryFn: () => integrationsApi.list(wid) })
}

/** Integrations that report an error (e.g. an expired token), which pause publishing. */
export function useBrokenIntegrations(wid: string) {
  const query = useIntegrations(wid)
  return query.data?.filter((integration) => integration.status === "error") ?? []
}
