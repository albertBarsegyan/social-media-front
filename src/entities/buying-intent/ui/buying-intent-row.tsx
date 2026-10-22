import { ChannelMark, channelInfo } from "@/entities/channel/@x/buying-intent"
import type { BuyingIntent } from "@/shared/api"
import { formatRelative } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

import { statusLabels } from "../config/buying-intent"
import { ScoreBadge } from "./score-badge"

export function BuyingIntentRow({ intent, className }: { intent: BuyingIntent; className?: string }) {
  return (
    <div className={cn("flex gap-3 p-3 text-left", className)}>
      <ScoreBadge score={intent.score} tier={intent.tier} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <ChannelMark short={channelInfo[intent.channel].short} />
          <span className="truncate font-medium text-foreground">{intent.sourceName}</span>
          <span className="shrink-0">· {formatRelative(intent.foundAt)}</span>
          <span className="ml-auto shrink-0 font-mono uppercase">{intent.lang}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm">{intent.text}</p>
        <div className="mt-1 text-xs text-muted-foreground">{statusLabels[intent.status]}</div>
      </div>
    </div>
  )
}
