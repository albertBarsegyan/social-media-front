import type { ReactNode } from "react"

import { ChannelMark, channelInfo } from "@/entities/channel/@x/buying-intent"
import type { BuyingIntent } from "@/shared/api"
import { localeNames } from "@/shared/config"
import { formatRelative } from "@/shared/lib/format"
import { Badge } from "@/shared/ui/badge"

/** The original public post the buying intent was found in. */
export function SourcePost({ intent, openAction }: { intent: BuyingIntent; openAction?: ReactNode }) {
  const channel = channelInfo[intent.channel]
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <ChannelMark short={channel.short} className="size-8 text-xs" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{intent.sourceName}</div>
          <div className="truncate text-xs text-muted-foreground">
            {channel.label} · {intent.author} · {formatRelative(intent.authorPostedAt ?? intent.foundAt)}
          </div>
        </div>
        {openAction}
      </div>
      {intent.title ? <div className="mt-3 font-medium">{intent.title}</div> : null}
      <p className="mt-2 text-sm leading-relaxed whitespace-pre-line">{intent.text}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge variant="outline">{localeNames[intent.lang]}</Badge>
        <Badge variant="secondary">Public post</Badge>
      </div>
    </div>
  )
}
