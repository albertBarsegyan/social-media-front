import type { PublishChannel } from "@/entities/channel/@x/campaign"
import type { Locale } from "@/shared/config"
import { createStore, useStore } from "@/shared/lib/store"

import { mockCampaign } from "../api/mock-campaign"
import type { Campaign, Variant } from "./types"

const campaignStore = createStore({ campaign: mockCampaign })

function patchVariant(channel: PublishChannel, lang: Locale, patch: Partial<Variant>) {
  campaignStore.setState(({ campaign }) => ({
    campaign: {
      ...campaign,
      variants: {
        ...campaign.variants,
        [channel]: { ...campaign.variants[channel], [lang]: { ...campaign.variants[channel][lang], ...patch } },
      },
    },
  }))
}

export function useCampaign() {
  return useStore(campaignStore, (state) => state.campaign)
}

export function approvedVariants(campaign: Campaign) {
  return (Object.keys(campaign.variants) as PublishChannel[]).flatMap((channel) =>
    (Object.keys(campaign.variants[channel]) as Locale[])
      .filter((lang) => campaign.variants[channel][lang].status === "approved")
      .map((lang) => ({ channel, lang, variant: campaign.variants[channel][lang] })),
  )
}

export const campaignActions = {
  setText: (channel: PublishChannel, lang: Locale, text: string) => patchVariant(channel, lang, { text, status: "draft" }),
  approve: (channel: PublishChannel, lang: Locale) => patchVariant(channel, lang, { status: "approved" }),
  unapprove: (channel: PublishChannel, lang: Locale) => patchVariant(channel, lang, { status: "draft" }),
  approveChannel: (channel: PublishChannel) => {
    for (const lang of Object.keys(campaignStore.getState().campaign.variants[channel]) as Locale[]) {
      patchVariant(channel, lang, { status: "approved" })
    }
  },
  getState: () => campaignStore.getState().campaign,
}
