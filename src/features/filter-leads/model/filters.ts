import { intentTier, leadTab, type IntentTier, type Lead, type LeadTab } from "@/entities/lead"
import type { ListeningChannel } from "@/entities/channel"
import type { Locale } from "@/shared/config"
import { createStore, useStore } from "@/shared/lib/store"

export interface LeadFilters {
  tab: LeadTab
  score: "all" | IntentTier
  source: "all" | ListeningChannel
  lang: "all" | Locale
}

const initialFilters: LeadFilters = { tab: "review", score: "all", source: "all", lang: "all" }

const filterStore = createStore(initialFilters)

export function useLeadFilters() {
  return useStore(filterStore, (state) => state)
}

export const leadFilterActions = {
  set: (patch: Partial<LeadFilters>) => filterStore.setState(patch),
  clear: () => filterStore.setState({ score: "all", source: "all", lang: "all" }),
}

export function hasActiveFilters(filters: LeadFilters) {
  return filters.score !== "all" || filters.source !== "all" || filters.lang !== "all"
}

export function filterLeads(leads: Lead[], filters: LeadFilters) {
  return leads.filter(
    (lead) =>
      leadTab(lead) === filters.tab &&
      (filters.score === "all" || intentTier(lead.score) === filters.score) &&
      (filters.source === "all" || lead.source === filters.source) &&
      (filters.lang === "all" || lead.lang === filters.lang),
  )
}

export function countByTab(leads: Lead[]) {
  const counts: Record<LeadTab, number> = { review: 0, done: 0, skipped: 0 }
  for (const lead of leads) counts[leadTab(lead)]++
  return counts
}
