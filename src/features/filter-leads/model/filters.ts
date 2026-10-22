import type { BuyingIntentFilters, BuyingIntentTab } from "@/entities/buying-intent"
import { createStore, useStore } from "@/shared/lib/store"

export interface LeadFilters extends BuyingIntentFilters {
  tab: BuyingIntentTab
}

const filterStore = createStore<LeadFilters>({ tab: "review" })

/** UI state only: the filtering itself happens on the server. */
export function useLeadFilters() {
  return useStore(filterStore, (state) => state)
}

export const leadFilterActions = {
  set: (patch: Partial<LeadFilters>) => filterStore.setState(patch),
  clear: () => filterStore.setState({ tier: undefined, channel: undefined, lang: undefined }),
}

export function hasActiveFilters(filters: LeadFilters) {
  return !!(filters.tier || filters.channel || filters.lang)
}

/** The filters without the tab, as sent to the counts endpoint. */
export function filtersOnly({ tier, channel, lang }: LeadFilters): BuyingIntentFilters {
  return { tier, channel, lang }
}
