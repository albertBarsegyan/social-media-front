"use client"

import { channelInfo } from "@/entities/channel"
import type { ListeningConfig } from "@/entities/listening"
import { Switch } from "@/shared/ui/switch"

import { useToggleSource } from "../api/mutations"

export function SourcesEditor({ wid, config, canEdit }: { wid: string; config: ListeningConfig; canEdit: boolean }) {
  const toggle = useToggleSource(wid)
  if (config.sources.length === 0) {
    return <p className="py-2 text-sm text-muted-foreground">No sources yet — groups, subreddits and searches to watch.</p>
  }
  return (
    <ul className="divide-y">
      {config.sources.map((source) => (
        <li key={source.id}>
          <label className="flex items-center gap-3 py-2.5">
            <Switch
              checked={source.enabled}
              disabled={!canEdit}
              onCheckedChange={(enabled) => toggle.mutate({ id: source.id, enabled })}
            />
            <span className="truncate text-sm">{source.name}</span>
            <span className="ml-auto shrink-0 text-xs text-muted-foreground">{channelInfo[source.channel].label}</span>
          </label>
        </li>
      ))}
    </ul>
  )
}
