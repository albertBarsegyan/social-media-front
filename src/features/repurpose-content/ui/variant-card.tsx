"use client"

import { useState } from "react"

import type { Variant } from "@/entities/campaign"
import { channelInfo } from "@/entities/channel"
import { localeNames } from "@/shared/config"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"

import { useCampaignActions } from "../api/mutations"

interface VariantCardProps {
  wid: string
  campaignId: string
  variant: Variant
  /** Shown above the preview, e.g. the account the post goes out from. */
  handle: string
  previewImage?: string | null
  canApprove: boolean
  generationPaused: boolean
}

/** One channel × language version of the post, previewed as it will appear. */
export function VariantCard({ wid, campaignId, variant, handle, previewImage, canApprove, generationPaused }: VariantCardProps) {
  const t = useMessages(commonMessages)
  const actions = useCampaignActions(wid, campaignId)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(variant.text)
  const approved = variant.status === "approved"
  const scheduled = !!variant.postId

  const saveText = () =>
    actions.updateVariant.mutate({ variantId: variant.id, text }, { onSuccess: () => setEditing(false) })

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">{variant.lang}</span>
        <span className="text-sm font-medium">{localeNames[variant.lang]}</span>
        <Badge variant={approved ? "default" : "outline"} className="ml-auto">
          {scheduled ? "Scheduled" : approved ? "Approved" : "Draft"}
        </Badge>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <div className="flex items-center gap-2 border-b p-2 text-xs">
          <span className="truncate font-medium">{handle}</span>
          <span className="ml-auto shrink-0 text-muted-foreground">{channelInfo[variant.channel].label}</span>
        </div>
        <div
          className={
            variant.channel === "instagram" ? "aspect-square bg-muted bg-cover bg-center" : "aspect-video bg-muted bg-cover bg-center"
          }
          style={previewImage ? { backgroundImage: `url(${previewImage})` } : undefined}
        />
        {editing ? null : <p className="p-2 text-xs leading-relaxed whitespace-pre-line">{variant.text}</p>}
      </div>
      {editing ? (
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={9}
          maxLength={5000}
          aria-label={`${localeNames[variant.lang]} text`}
        />
      ) : null}
      <div className="font-mono text-xs text-muted-foreground">{(editing ? text : variant.text).length} chars</div>
      {scheduled ? (
        <p className="mt-auto text-xs text-muted-foreground">On the calendar — edit it there.</p>
      ) : (
        <div className="mt-auto flex flex-wrap gap-2">
          {editing ? (
            <>
              <Button size="sm" disabled={!text.trim() || actions.updateVariant.isPending} onClick={saveText}>
                Save
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              {canApprove ? (
                <Button
                  size="sm"
                  variant={approved ? "secondary" : "default"}
                  onClick={() => actions.updateVariant.mutate({ variantId: variant.id, status: approved ? "draft" : "approved" })}
                >
                  {approved ? "Undo approval" : t.approve}
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setText(variant.text)
                  setEditing(true)
                }}
              >
                {t.edit}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="ml-auto"
                disabled={generationPaused || actions.generate.isPending}
                onClick={() =>
                  actions.generate.mutate(
                    { channel: variant.channel, lang: variant.lang },
                    { onSuccess: () => toast(`${localeNames[variant.lang]} version regenerated`) },
                  )
                }
              >
                Regenerate
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
