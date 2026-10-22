import { useMutation, useQueryClient } from "@tanstack/react-query"

import { integrationKeys, type Integration, type IntegrationProvider } from "@/entities/integration"
import { integrationsApi, invalidateWorkspace } from "@/shared/api"

function useIntegrationMutation(wid: string, request: (provider: IntegrationProvider) => Promise<Integration>) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: request,
    onSuccess: (updated) => {
      client.setQueryData<Integration[]>(integrationKeys.list(wid), (list) =>
        list?.map((item) => (item.provider === updated.provider ? updated : item)),
      )
      // Integration status feeds workspace health and banners.
      return invalidateWorkspace(client, wid, ["integrations"])
    },
  })
}

/** STUB on the API side: marks the integration connected without OAuth (contract §3.14). */
export function useConnectIntegration(wid: string) {
  return useIntegrationMutation(wid, (provider) => integrationsApi.connect(wid, provider))
}

export function useDisconnectIntegration(wid: string) {
  return useIntegrationMutation(wid, (provider) => integrationsApi.disconnect(wid, provider))
}
