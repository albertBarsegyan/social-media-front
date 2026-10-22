"use client"

import { FileIcon, PlayIcon } from "lucide-react"
import { useState } from "react"

import { useAiBudget } from "@/entities/ai-budget"
import { useCampaign, useCampaigns, type Campaign } from "@/entities/campaign"
import { useCatalog } from "@/entities/catalog"
import { channelInfo, type PublishChannel } from "@/entities/channel"
import { useIntegrations } from "@/entities/integration"
import { useCurrentWorkspace } from "@/entities/workspace"
import { GenerateButton, NewCampaignForm, useCampaignActions, VariantCard } from "@/features/repurpose-content"
import { SourceDropzone } from "@/features/upload-source"
import type { Upload } from "@/shared/api"
import { localeNames } from "@/shared/config"
import { formatDate, formatUsdMicros } from "@/shared/lib/format"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select"
import { Skeleton } from "@/shared/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

const NEW = "new"

function SourceCard({ campaign }: { campaign: Campaign }) {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="font-medium">{campaign.title}</div>
      {campaign.summary ? <p className="text-sm text-muted-foreground">{campaign.summary}</p> : null}
      {campaign.uploads.length ? (
        <div className="grid grid-cols-4 gap-1.5">
          {campaign.uploads.map((upload) =>
            upload.kind === "image" && upload.url ? (
              <div
                key={upload.id}
                className="aspect-square rounded-md bg-muted bg-cover bg-center"
                style={{ backgroundImage: `url(${upload.url})` }}
                title={upload.fileName}
              />
            ) : (
              <a
                key={upload.id}
                href={upload.url ?? undefined}
                target="_blank"
                rel="noopener noreferrer"
                title={upload.fileName}
                className="grid aspect-square place-items-center rounded-md bg-muted text-muted-foreground"
              >
                {upload.kind === "video" ? <PlayIcon className="size-4" /> : <FileIcon className="size-4" />}
              </a>
            ),
          )}
        </div>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        {campaign.channels.map((key) => (
          <Badge key={key}>{channelInfo[key].label}</Badge>
        ))}
        {campaign.languages.map((lang) => (
          <Badge key={lang} variant="outline">
            {localeNames[lang]}
          </Badge>
        ))}
      </div>
    </div>
  )
}

function CampaignWorkspace({ wid, campaign }: { wid: string; campaign: Campaign }) {
  const t = useMessages(commonMessages)
  const { workspace, role } = useCurrentWorkspace()
  const catalog = useCatalog().data
  const paused = useAiBudget(wid).data?.paused ?? false
  const buffer = useIntegrations(wid).data?.find((i) => i.provider === "buffer")
  const actions = useCampaignActions(wid, campaign.id)
  const [channelChoice, setChannel] = useState<PublishChannel>()
  const channel = channelChoice && campaign.channels.includes(channelChoice) ? channelChoice : campaign.channels[0]
  const canApprove = role !== "editor"

  const variants = campaign.variants.filter((v) => v.channel === channel)
  const approvedPending = campaign.variants.filter((v) => v.status === "approved" && !v.postId).length
  const approvedIn = (key: PublishChannel) => campaign.variants.filter((v) => v.channel === key && v.status === "approved").length
  const fullCost = catalog ? formatUsdMicros(catalog.aiUnitCostsUsdMicros.campaignRegenerate) : null
  const preview = campaign.uploads.find((u) => u.kind === "image")?.url
  const variantCount = campaign.channels.length * campaign.languages.length

  return (
    <section className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Tabs value={channel} onValueChange={(value) => setChannel(value as PublishChannel)}>
          <TabsList>
            {campaign.channels.map((key) => (
              <TabsTrigger key={key} value={key}>
                {channelInfo[key].label}
                <span className="font-mono text-xs text-muted-foreground">
                  {approvedIn(key)}/{campaign.languages.length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex-1" />
        {canApprove ? (
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={!variants.length || actions.approveChannel.isPending}
              onClick={() => actions.approveChannel.mutate(channel)}
            >
              {t.approve} all {campaign.languages.length}
            </Button>
            <Button
              size="sm"
              disabled={approvedPending === 0 || actions.schedule.isPending}
              onClick={() =>
                actions.schedule.mutate(undefined, {
                  onSuccess: ({ posts }) => toast(`${posts.length} posts scheduled · see Calendar`),
                })
              }
            >
              Schedule approved · {approvedPending}
            </Button>
          </>
        ) : null}
      </div>
      <GenerateButton
        label={`${campaign.variants.length ? "Regenerate" : "Generate"} all ${variantCount}${fullCost ? ` · ~${fullCost}` : ""}`}
        paused={paused}
        pending={actions.generate.isPending}
        onGenerate={() => actions.generate.mutate({})}
      />
      {actions.generate.isPending ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {campaign.languages.map((lang) => (
            <Skeleton key={lang} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : variants.length === 0 ? (
        <EmptyState title="No drafts yet" description="Generate drafts for every channel and language, then edit and approve them." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {variants.map((variant) => (
            <VariantCard
              key={variant.id}
              wid={wid}
              campaignId={campaign.id}
              variant={variant}
              handle={buffer?.accountLabel ?? workspace.name}
              previewImage={preview}
              canApprove={canApprove}
              generationPaused={paused}
            />
          ))}
        </div>
      )}
    </section>
  )
}

/** Turn one source into a post per channel and language, then approve and schedule. */
export function ContentStudio() {
  const { workspaceId } = useCurrentWorkspace()
  const campaigns = useCampaigns(workspaceId)
  const list = campaigns.data?.pages.flatMap((page) => page.items) ?? []
  const [selection, setSelection] = useState<string>()
  const [uploads, setUploads] = useState<Upload[]>([])
  const selectedId = selection ?? list[0]?.id ?? NEW
  const campaign = useCampaign(workspaceId, selectedId === NEW ? undefined : selectedId)

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-4">
        <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">Source</div>
        {list.length ? (
          <Select value={selectedId} onValueChange={setSelection}>
            <SelectTrigger className="w-full" aria-label="Campaign">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NEW}>+ New campaign</SelectItem>
              {list.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.title} · {formatDate(item.createdAt)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}
        {selectedId === NEW ? (
          <>
            <SourceDropzone wid={workspaceId} onUploaded={(added) => setUploads((current) => [...current, ...added])} />
            <NewCampaignForm
              wid={workspaceId}
              uploads={uploads}
              onRemoveUpload={(id) => setUploads((current) => current.filter((upload) => upload.id !== id))}
              onCreated={(created) => {
                setUploads([])
                setSelection(created.id)
              }}
            />
          </>
        ) : campaign.data ? (
          <SourceCard campaign={campaign.data} />
        ) : (
          <Skeleton className="h-48 rounded-xl" />
        )}
      </aside>

      {campaigns.isError ? (
        <ErrorState error={campaigns.error} onRetry={() => void campaigns.refetch()} />
      ) : selectedId === NEW ? (
        <EmptyState
          title={campaigns.isPending ? "Loading…" : "Start with a source"}
          description="Upload a case study, photos or a video, describe what happened, and the studio drafts a post for every channel and language."
        />
      ) : campaign.isError ? (
        <ErrorState error={campaign.error} onRetry={() => void campaign.refetch()} />
      ) : campaign.data ? (
        <CampaignWorkspace wid={workspaceId} campaign={campaign.data} />
      ) : (
        <Skeleton className="h-96 rounded-xl" />
      )}
    </div>
  )
}
