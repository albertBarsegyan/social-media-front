"use client"

import { estimateWeeklyMatches, listeningActions, useListeningConfig } from "@/entities/listening"
import { Switch } from "@/shared/ui/switch"

export function SourcesEditor() {
  const { sources } = useListeningConfig()
  return (
    <ul className="divide-y">
      {sources.map((source, index) => (
        <li key={source.name}>
          <label className="flex items-center gap-3 py-2.5">
            <Switch checked={source.on} onCheckedChange={(on) => listeningActions.toggleSource(index, on)} />
            <span className="truncate text-sm">{source.name}</span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">{source.type}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}

export function useWeeklyEstimate() {
  const { keywordSets, sources } = useListeningConfig()
  return estimateWeeklyMatches(keywordSets, sources)
}
