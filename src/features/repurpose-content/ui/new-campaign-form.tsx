"use client"

import { XIcon } from "lucide-react"
import { useState } from "react"

import type { Campaign } from "@/entities/campaign"
import { channelInfo, publishChannels } from "@/entities/channel"
import type { Locale, PublishChannel, Upload } from "@/shared/api"
import { localeNames } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"

import { useCreateCampaign } from "../api/mutations"

const languages: Locale[] = ["hy", "ru", "en"]

/** Title, summary, attached uploads, channels and languages → a new campaign. */
export function NewCampaignForm({
  wid,
  uploads,
  onRemoveUpload,
  onCreated,
}: {
  wid: string
  uploads: Upload[]
  onRemoveUpload: (id: string) => void
  onCreated: (campaign: Campaign) => void
}) {
  const create = useCreateCampaign(wid)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [channels, setChannels] = useState<PublishChannel[]>([...publishChannels])
  const [langs, setLangs] = useState<Locale[]>([...languages])

  return (
    <form
      className="space-y-3 rounded-xl border bg-card p-4"
      onSubmit={(event) => {
        event.preventDefault()
        create.mutate(
          { title, summary, uploadIds: uploads.map((upload) => upload.id), channels, languages: langs },
          { onSuccess: onCreated },
        )
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="campaign-title">Title</Label>
        <Input id="campaign-title" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="campaign-summary">What happened</Label>
        <Textarea id="campaign-summary" rows={3} maxLength={4000} value={summary} onChange={(e) => setSummary(e.target.value)} />
      </div>
      {uploads.length ? (
        <ul className="space-y-1">
          {uploads.map((upload) => (
            <li key={upload.id} className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-xs">
              <span className="flex-1 truncate">{upload.fileName}</span>
              <button type="button" aria-label={`Remove ${upload.fileName}`} onClick={() => onRemoveUpload(upload.id)}>
                <XIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="space-y-2">
        <div className="text-sm font-medium">Platforms</div>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          value={channels}
          onValueChange={(value) => setChannels(value as PublishChannel[])}
          className="flex-wrap"
        >
          {publishChannels.map((key) => (
            <ToggleGroupItem key={key} value={key} className="px-3">
              {channelInfo[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <div className="text-sm font-medium">Languages</div>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          value={langs}
          onValueChange={(value) => setLangs(value as Locale[])}
          className="flex-wrap"
        >
          {languages.map((lang) => (
            <ToggleGroupItem key={lang} value={lang} className="px-3">
              {localeNames[lang]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <Button type="submit" className="w-full" disabled={create.isPending || !title.trim() || !channels.length || !langs.length}>
        {create.isPending ? "Creating…" : "Create campaign"}
      </Button>
    </form>
  )
}
