"use client"

import type { LeadTab } from "@/entities/lead"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { leadFilterActions, useLeadFilters, type LeadFilters as Filters } from "../model/filters"

const sourceOptions: [Filters["source"], string][] = [
  ["all", "All sources"],
  ["reddit", "Reddit"],
  ["fbgroup", "Facebook groups"],
  ["tggroup", "Telegram groups"],
  ["x", "X"],
]

const langOptions: [Filters["lang"], string][] = [
  ["all", "All languages"],
  ["hy", "Armenian"],
  ["ru", "Russian"],
  ["en", "English"],
]

export function LeadFilters({ counts }: { counts: Record<LeadTab, number> }) {
  const filters = useLeadFilters()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Tabs value={filters.tab} onValueChange={(tab) => leadFilterActions.set({ tab: tab as LeadTab })}>
        <TabsList>
          <TabsTrigger value="review">Needs review {counts.review}</TabsTrigger>
          <TabsTrigger value="done">Handled {counts.done}</TabsTrigger>
          <TabsTrigger value="skipped">Skipped {counts.skipped}</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs value={filters.score} onValueChange={(score) => leadFilterActions.set({ score: score as Filters["score"] })}>
        <TabsList aria-label="Intent score">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="hot">70+</TabsTrigger>
          <TabsTrigger value="warm">40–69</TabsTrigger>
          <TabsTrigger value="cold">&lt;40</TabsTrigger>
        </TabsList>
      </Tabs>
      <Select value={filters.source} onValueChange={(source) => leadFilterActions.set({ source: source as Filters["source"] })}>
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
      <Select value={filters.lang} onValueChange={(lang) => leadFilterActions.set({ lang: lang as Filters["lang"] })}>
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
