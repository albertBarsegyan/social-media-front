import { useMutation, useQueryClient } from "@tanstack/react-query"

import { buyingIntentKeys } from "@/entities/buying-intent"
import { buyingIntentsApi, invalidateWorkspace, type BuyingIntent, type WorkspaceArea } from "@/shared/api"

const AREAS: WorkspaceArea[] = ["buying-intents", "approvals", "reports"]

/** Every action on one reply draft. Each response replaces the cached intent, then lists and counts refetch. */
export function useReplyActions(wid: string) {
  const client = useQueryClient()
  const settle = (intent: BuyingIntent, extra: WorkspaceArea[] = []) => {
    client.setQueryData(buyingIntentKeys.detail(wid, intent.id), intent)
    return invalidateWorkspace(client, wid, [...AREAS, ...extra])
  }

  return {
    saveDraft: useMutation({
      mutationFn: ({ id, draft }: { id: string; draft: string }) => buyingIntentsApi.saveDraft(wid, id, draft),
      onSuccess: (intent) => settle(intent),
    }),
    generateDraft: useMutation({
      mutationFn: (id: string) => buyingIntentsApi.generateDraft(wid, id),
      onSuccess: (intent) => settle(intent, ["ai-budget"]),
    }),
    approve: useMutation({
      mutationFn: (id: string) => buyingIntentsApi.approve(wid, id),
      onSuccess: (intent) => settle(intent),
    }),
    skip: useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) => buyingIntentsApi.skip(wid, id, reason),
      onSuccess: (intent) => settle(intent),
    }),
    restore: useMutation({
      mutationFn: (id: string) => buyingIntentsApi.restore(wid, id),
      onSuccess: (intent) => settle(intent),
    }),
    markPosted: useMutation({
      mutationFn: (id: string) => buyingIntentsApi.markPosted(wid, id),
      onSuccess: (intent) => settle(intent),
    }),
  }
}
