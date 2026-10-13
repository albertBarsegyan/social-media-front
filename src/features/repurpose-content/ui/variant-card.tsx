"use client"

import { useState } from "react"

import { campaignHandles, campaignActions, type Variant } from "@/entities/campaign"
import { channelInfo, type PublishChannel } from "@/entities/channel"
import { localeNames, type Locale } from "@/shared/config"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"

interface VariantCardProps {
  channel: PublishChannel
  lang: Locale
  variant: Variant
  generationPaused: boolean
}

/** One channel × language version of the post, previewed as it will appear. */
export function VariantCard({ channel, lang, variant, generationPaused }: VariantCardProps) {
  const t = useMessages(commonMessages)
  const [editing, setEditing] = useState(false)
  const approved = variant.status === "approved"

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">{lang}</span>
        <span className="text-sm font-medium">{localeNames[lang]}</span>
        <Badge variant={approved ? "default" : "outline"} className="ml-auto">
          {approved ? "Approved" : "Draft"}
        </Badge>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-center gap-2 border-b p-2 text-xs">
          <span className="grid size-6 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">MB</span>
          <span className="font-medium">{campaignHandles[channel]}</span>
          <span className="ml-auto text-muted-foreground">{channelInfo[channel].label}</span>
        </div>
        <div
          className={
            channel === "instagram"
              ? "grid aspect-square place-items-end bg-muted p-2"
              : "grid aspect-video place-items-end bg-muted p-2"
          }
        >
          <span className="rounded bg-background/70 px-1.5 py-0.5 text-[10px] text-muted-foreground">final look · 1/4</span>
        </div>
        {editing ? null : <p className="p-2 text-xs leading-relaxed whitespace-pre-line">{variant.text}</p>}
      </div>
      {editing ? (
        <Textarea
          value={variant.text}
          onChange={(event) => campaignActions.setText(channel, lang, event.target.value)}
          rows={9}
          aria-label={`${localeNames[lang]} text`}
        />
      ) : null}
      <div className="flex flex-wrap gap-x-1.5 text-xs text-muted-foreground">
        <span className="font-mono">{variant.text.length} chars</span>
        <span>· Tone: warm, plain</span>
        <span>· No banned phrases</span>
      </div>
      <div className="mt-auto flex flex-wrap gap-2">
        {approved ? (
          <Button size="sm" variant="secondary" onClick={() => campaignActions.unapprove(channel, lang)}>
            Undo approval
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => {
              campaignActions.approve(channel, lang)
              setEditing(false)
            }}
          >
            {t.approve}
          </Button>
        )}
        <Button size="sm" variant="outline" onClick={() => setEditing((value) => !value)}>
          {editing ? "Done" : t.edit}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="ml-auto"
          disabled={generationPaused}
          onClick={() => toast(`${localeNames[lang]} version regenerated`)}
        >
          Regenerate
        </Button>
      </div>
    </div>
  )
}
