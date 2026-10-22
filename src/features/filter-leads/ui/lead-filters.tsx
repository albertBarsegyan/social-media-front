"use client"

import type { BuyingIntentCounts, BuyingIntentTab } from "@/entities/buying-intent"
import type { IntentTier, ListeningChannel, Locale } from "@/shared/api"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { leadFilterActions, useLeadFilters } from "../model/filters"

const ALL = "all"

const sourceOptions: [ListeningChannel | typeof ALL, string][] = [
  [ALL, "All sources"],
  ["reddit", "Reddit"],
  ["fb_group", "Facebook groups"],
  ["tg_group", "Telegram groups"],
  ["x", "X"],
]

const langOptions: [Locale | typeof ALL, string][] = [
  [ALL, "All languages"],
  ["hy", "Armenian"],
  ["ru", "Russian"],
  ["en", "English"],
]

const orAll = <T extends string>(value: string) => (value === ALL ? undefined : (value as T))

export function LeadFilters({ counts }: { counts?: BuyingIntentCounts }) {
  const filters = useLeadFilters()
  const count = (tab: BuyingIntentTab) => (counts ? ` ${counts[tab]}` : "")
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={filters.tab} onValueChange={(tab) => leadFilterActions.set({ tab: tab as BuyingIntentTab })}>
        <TabsList>
          <TabsTrigger value="review">Needs review{count("review")}</TabsTrigger>
          <TabsTrigger value="done">Handled{count("done")}</TabsTrigger>
          <TabsTrigger value="skipped">Skipped{count("skipped")}</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs value={filters.tier ?? ALL} onValueChange={(tier) => leadFilterActions.set({ tier: orAll<IntentTier>(tier) })}>
        <TabsList aria-label="Intent score">
          <TabsTrigger value={ALL}>All</TabsTrigger>
          <TabsTrigger value="hot">70+</TabsTrigger>
          <TabsTrigger value="warm">40–69</TabsTrigger>
          <TabsTrigger value="cold">&lt;40</TabsTrigger>
        </TabsList>
      </Tabs>
      <Select
        value={filters.channel ?? ALL}
        onValueChange={(channel) => leadFilterActions.set({ channel: orAll<ListeningChannel>(channel) })}
      >
        <SelectTrigger size="sm" aria-label="Source">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sourceOptions.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filters.lang ?? ALL} onValueChange={(lang) => leadFilterActions.set({ lang: orAll<Locale>(lang) })}>
        <SelectTrigger size="sm" aria-label="Language">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {langOptions.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
