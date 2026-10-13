"use client"

import { PlayIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { useAiBudget } from "@/entities/ai-budget"
import { approvedVariants, campaignActions, useCampaign } from "@/entities/campaign"
import { channelInfo, publishChannels, type PublishChannel } from "@/entities/channel"
import { GenerateButton, scheduleApprovedVariants, VariantCard } from "@/features/repurpose-content"
import { SourceDropzone } from "@/features/upload-source"
import { localeNames, type Locale } from "@/shared/config"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

const languages: Locale[] = ["hy", "ru", "en"]

/** Turn one source into a post per channel and language, then approve and schedule. */
export function ContentStudio() {
  const t = useMessages(commonMessages)
  const campaign = useCampaign()
  const budget = useAiBudget()
  const paused = budget.reached && budget.hardCap
  const [channel, setChannel] = useState<PublishChannel>("instagram")
  const [generating, setGenerating] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const approvedCount = approvedVariants(campaign).length
  const approvedIn = (key: PublishChannel) =>
    languages.filter((lang) => campaign.variants[key][lang].status === "approved").length

  const generate = () => {
    setGenerating(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setGenerating(false), 1600)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Source</div>
        <SourceDropzone />
        <div className="space-y-3 rounded-xl border bg-card p-4">
          <div className="font-medium">{campaign.title}</div>
          <p className="text-sm text-muted-foreground">{campaign.summary}</p>
          <div className="grid grid-cols-4 gap-1.5">
            {campaign.media.map((label) => (
              <div key={label} className="grid aspect-square place-items-end rounded-md bg-muted p-1">
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 rounded-md bg-muted px-2 py-1.5 text-xs">
            <PlayIcon className="size-3.5" />
            <span className="flex-1">{campaign.video.name}</span>
            <span className="font-mono text-muted-foreground">{campaign.video.duration}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Platforms</div>
          <div className="flex flex-wrap gap-1.5">
            {publishChannels.map((key) => (
              <Badge key={key}>{channelInfo[key].label}</Badge>
            ))}
            <Badge variant="outline">+ LinkedIn</Badge>
          </div>
          <div className="pt-1 text-sm font-medium">Languages</div>
          <div className="flex flex-wrap gap-1.5">
            {languages.map((lang) => (
              <Badge key={lang}>{localeNames[lang]}</Badge>
            ))}
          </div>
        </div>
        <GenerateButton paused={paused} onGenerate={generate} />
      </aside>

      <section className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={channel} onValueChange={(value) => setChannel(value as PublishChannel)}>
            <TabsList>
              {publishChannels.map((key) => (
                <TabsTrigger key={key} value={key}>
                  {channelInfo[key].label}
                  <span className="font-mono text-xs text-muted-foreground">{approvedIn(key)}/3</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex-1" />
          <Button variant="outline" size="sm" onClick={() => campaignActions.approveChannel(channel)}>
            {t.approve} all 3
          </Button>
          <Button size="sm" disabled={approvedCount === 0} onClick={scheduleApprovedVariants}>
            Schedule approved · {approvedCount}
          </Button>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {languages.map((lang) =>
            generating ? (
              <Skeleton key={lang} className="h-96 rounded-xl" />
            ) : (
              <VariantCard
                key={`${channel}-${lang}`}
                channel={channel}
                lang={lang}
                variant={campaign.variants[channel][lang]}
                generationPaused={paused}
              />
            ),
          )}
        </div>
      </section>
    </div>
  )
}
