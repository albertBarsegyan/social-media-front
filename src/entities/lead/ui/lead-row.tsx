import { ChannelMark, channelInfo } from "@/entities/channel/@x/lead"
import { cn } from "@/shared/lib/utils"

import { leadStatusLabels } from "../config/lead"
import type { Lead } from "../model/types"
import { ScoreBadge } from "./score-badge"

export function LeadRow({ lead, selected, className }: { lead: Lead; selected?: boolean; className?: string }) {
  return (
    <div className={cn("flex gap-3 p-3 text-left", selected && "bg-muted", className)}>
      <ScoreBadge score={lead.score} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChannelMark short={channelInfo[lead.source].short} />
          <span className="truncate font-medium text-foreground">{lead.where}</span>
          <span className="shrink-0">· {lead.time}</span>
          <span className="ml-auto shrink-0 font-mono uppercase">{lead.lang}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm">{lead.text}</p>
        <div className="mt-1 text-xs text-muted-foreground">{leadStatusLabels[lead.status]}</div>
      </div>
    </div>
  )
}
