import { useMutation, useQueryClient } from "@tanstack/react-query"

import { listeningKeys, type ListeningConfig } from "@/entities/listening"
import { listeningApi } from "@/shared/api"

type Toggle = { id: string; enabled: boolean }

/** Switches flip instantly and roll back if the request fails. */
function useOptimisticToggle(wid: string, field: "keywordSets" | "sources", request: (toggle: Toggle) => Promise<unknown>) {
  const client = useQueryClient()
  const queryKey = listeningKeys.config(wid)
  return useMutation({
    mutationFn: request,
    onMutate: async ({ id, enabled }) => {
      await client.cancelQueries({ queryKey })
      const previous = client.getQueryData<ListeningConfig>(queryKey)
      client.setQueryData<ListeningConfig>(queryKey, (config) =>
        config && { ...config, [field]: config[field].map((item) => (item.id === id ? { ...item, enabled } : item)) },
      )
      return { previous }
    },
    onError: (_error, _toggle, snapshot) => client.setQueryData(queryKey, snapshot?.previous),
    // The weekly estimate is computed by the API, so refetch after every toggle.
    onSettled: () => client.invalidateQueries({ queryKey }),
  })
}

export function useToggleKeywordSet(wid: string) {
  return useOptimisticToggle(wid, "keywordSets", ({ id, enabled }) => listeningApi.updateKeywordSet(wid, id, { enabled }))
}

export function useToggleSource(wid: string) {
  return useOptimisticToggle(wid, "sources", ({ id, enabled }) => listeningApi.updateSource(wid, id, { enabled }))
}
