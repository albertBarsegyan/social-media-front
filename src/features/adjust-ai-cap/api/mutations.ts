import { useMutation, useQueryClient } from "@tanstack/react-query"

import { aiBudgetKeys } from "@/entities/ai-budget"
import { aiBudgetApi, invalidateWorkspace, type AiBudgetSettings } from "@/shared/api"

export function useUpdateAiBudget(wid: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (settings: AiBudgetSettings) => aiBudgetApi.update(wid, settings),
    onSuccess: (budget) => {
      client.setQueryData(aiBudgetKeys.detail(wid), budget)
      // Budget level feeds workspace health and the drafting buttons.
      return invalidateWorkspace(client, wid, [])
    },
  })
}
