import { useMutation, useQueryClient } from "@tanstack/react-query"

import { campaignKeys, type Campaign, type Variant } from "@/entities/campaign"
import {
  campaignsApi,
  invalidateWorkspace,
  type CreateCampaignInput,
  type Locale,
  type PublishChannel,
  type VariantStatus,
} from "@/shared/api"

export function useCreateCampaign(wid: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCampaignInput) => campaignsApi.create(wid, input),
    onSuccess: (campaign) => {
      client.setQueryData(campaignKeys.detail(wid, campaign.id), campaign)
      return client.invalidateQueries({ queryKey: campaignKeys.lists(wid) })
    },
  })
}

/** Mutations on one campaign. Each response replaces the cached campaign. */
export function useCampaignActions(wid: string, cid: string) {
  const client = useQueryClient()
  const detailKey = campaignKeys.detail(wid, cid)
  const replace = (campaign: Campaign) => {
    client.setQueryData(detailKey, campaign)
    return client.invalidateQueries({ queryKey: campaignKeys.lists(wid) })
  }

  return {
    generate: useMutation({
      mutationFn: (target: { channel?: PublishChannel; lang?: Locale }) => campaignsApi.generate(wid, cid, target),
      onSuccess: async (campaign) => {
        await replace(campaign)
        await invalidateWorkspace(client, wid, ["ai-budget"])
      },
    }),
    approveChannel: useMutation({
      mutationFn: (channel: PublishChannel) => campaignsApi.approveChannel(wid, cid, channel),
      onSuccess: replace,
    }),
    /** Approve / un-approve flips instantly and rolls back on error; text edits wait for the response. */
    updateVariant: useMutation({
      mutationFn: ({ variantId, ...input }: { variantId: string; text?: string; status?: VariantStatus }) =>
        campaignsApi.updateVariant(wid, cid, variantId, input),
      onMutate: async ({ variantId, status }) => {
        if (!status) return { previous: undefined }
        await client.cancelQueries({ queryKey: detailKey })
        const previous = client.getQueryData<Campaign>(detailKey)
        client.setQueryData<Campaign>(detailKey, (campaign) =>
          campaign && { ...campaign, variants: campaign.variants.map((v) => (v.id === variantId ? { ...v, status } : v)) },
        )
        return { previous }
      },
      onError: (_error, _vars, snapshot) => {
        if (snapshot?.previous) client.setQueryData(detailKey, snapshot.previous)
      },
      onSuccess: (variant: Variant) =>
        client.setQueryData<Campaign>(detailKey, (campaign) =>
          campaign && { ...campaign, variants: campaign.variants.map((v) => (v.id === variant.id ? variant : v)) },
        ),
      onSettled: () => client.invalidateQueries({ queryKey: campaignKeys.lists(wid) }),
    }),
    schedule: useMutation({
      mutationFn: (startDate?: string) => campaignsApi.schedule(wid, cid, startDate),
      onSuccess: async () => {
        await client.invalidateQueries({ queryKey: detailKey })
        await invalidateWorkspace(client, wid, ["campaigns", "posts", "approvals"])
      },
    }),
  }
}
