import type { ReactNode } from "react"

import { ChannelMark, channelInfo } from "@/entities/channel/@x/lead"
import { localeNames } from "@/shared/config"
import { Badge } from "@/shared/ui/badge"

import type { Lead } from "../model/types"

/** The original public post the lead was found in. */
export function LeadSourcePost({ lead, openAction }: { lead: Lead; openAction?: ReactNode }) {
  const channel = channelInfo[lead.source]
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <ChannelMark short={channel.short} className="size-8 text-xs" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{lead.where}</div>
          <div className="truncate text-xs text-muted-foreground">
            {channel.label} · {lead.author} · {lead.time}
          </div>
        </div>
        {openAction}
      </div>
      {lead.title ? <div className="mt-3 font-medium">{lead.title}</div> : null}
      <p className="mt-2 text-sm leading-relaxed">{lead.text}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="outline">{localeNames[lead.lang]}</Badge>
        <Badge variant="secondary">Public post</Badge>
      </div>
    </div>
  )
}
