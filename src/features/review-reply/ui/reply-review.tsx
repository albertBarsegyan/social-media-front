"use client"

import { CheckIcon, CopyIcon, ShieldCheckIcon } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import { useAiBudget } from "@/entities/ai-budget"
import { skipReasonLabel, type BuyingIntent } from "@/entities/buying-intent"
import { useCatalog } from "@/entities/catalog"
import { channelInfo } from "@/entities/channel"
import { useCurrentWorkspace } from "@/entities/workspace"
import { localeNames, routes } from "@/shared/config"
import { formatUsdMicros } from "@/shared/lib/format"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"

import { useReplyActions } from "../api/mutations"

interface ReplyReviewProps {
  intent: BuyingIntent
  /** Rendered when drafting is paused by the AI budget, e.g. a "Raise cap" button. */
  budgetAction?: ReactNode
}

/** Review the drafted reply: approve, edit, skip, then post. */
export function ReplyReview({ intent, budgetAction }: ReplyReviewProps) {
  const t = useMessages(commonMessages)
  const { workspaceId, role } = useCurrentWorkspace()
  const catalog = useCatalog().data
  const paused = useAiBudget(workspaceId).data?.paused ?? false
  const actions = useReplyActions(workspaceId)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(intent.draft ?? "")
  const [skipOpen, setSkipOpen] = useState(false)
  const channel = channelInfo[intent.channel]
  const canApprove = role !== "editor"
  const reviewable = intent.status === "draft_ready" || intent.status === "no_draft"
  const busy = Object.values(actions).some((mutation) => mutation.isPending)

  const startEdit = () => {
    setDraft(intent.draft ?? "")
    setEditing(true)
    setSkipOpen(false)
  }

  const save = (thenApprove: boolean) =>
    actions.saveDraft.mutate(
      { id: intent.id, draft },
      {
        onSuccess: () => {
          setEditing(false)
          if (thenApprove) approve()
          else toast("Edit saved — still needs approval")
        },
      },
    )

  const approve = () =>
    actions.approve.mutate(intent.id, {
      onSuccess: (updated) =>
        toast(
          updated.status === "posted"
            ? `Approved and posted to ${channel.label}`
            : `Approved — now copy it and post on ${channel.label}`,
        ),
    })

  const skip = (reason: string) =>
    actions.skip.mutate({ id: intent.id, reason }, { onSuccess: () => toast(`Draft skipped · ${skipReasonLabel(reason)}`) })

  const copyAndOpen = async () => {
    try {
      await navigator.clipboard.writeText(intent.draft ?? "")
      if (intent.postUrl) window.open(intent.postUrl, "_blank", "noopener,noreferrer")
      toast(intent.postUrl ? `Reply copied · opening ${intent.sourceName}` : "Reply copied")
    } catch {
      toast.error("Couldn’t copy — select the reply and copy it manually")
    }
  }

  return (
    <section className="rounded-xl border bg-card p-4" aria-label="Reply draft" aria-busy={busy}>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold">Reply draft</h2>
        {intent.edited ? <Badge variant="secondary">Edited</Badge> : null}
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" />
          Nothing posts without approval
        </span>
      </div>

      {intent.status === "no_draft" && !editing ? (
        <div className="mt-3 rounded-lg bg-muted/60 p-3">
          {paused ? (
            <>
              <div className="text-sm font-medium">Drafting paused — AI budget reached</div>
              <p className="mt-0.5 text-sm text-muted-foreground">Raise the cap or write a reply yourself.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {budgetAction}
                <Button size="sm" variant="outline" onClick={startEdit}>
                  Write my own
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-medium">
                No draft
                {catalog && intent.score < catalog.draftThreshold
                  ? ` — intent ${intent.score} is below the threshold of ${catalog.draftThreshold}`
                  : ""}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Low-intent posts aren’t drafted, to save budget and avoid sounding pushy.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={actions.generateDraft.isPending}
                  onClick={() => actions.generateDraft.mutate(intent.id, { onSuccess: () => toast("Draft generated") })}
                >
                  {actions.generateDraft.isPending ? "Drafting…" : "Draft anyway"}
                  {catalog ? ` · ~${formatUsdMicros(catalog.aiUnitCostsUsdMicros.draft)}` : ""}
                </Button>
                <Button size="sm" variant="ghost" onClick={startEdit}>
                  Write my own
                </Button>
                {canApprove ? (
                  <Button size="sm" variant="ghost" onClick={() => setSkipOpen((open) => !open)}>
                    {t.skip}
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </div>
      ) : null}

      {editing ? (
        <div className="mt-3 space-y-3">
          <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={7} maxLength={4000} aria-label="Reply text" />
          <div className="flex flex-wrap items-center gap-2">
            {canApprove ? (
              <Button disabled={!draft.trim() || busy} onClick={() => save(true)}>
                Save &amp; {t.approve}
              </Button>
            ) : null}
            <Button variant="outline" disabled={!draft.trim() || busy} onClick={() => save(false)}>
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{draft.length} chars</span>
          </div>
        </div>
      ) : intent.draft ? (
        <div className={cn("mt-3", intent.status === "skipped" && "opacity-55")}>
          <p className="text-sm leading-relaxed whitespace-pre-line">{intent.draft}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="outline">Reply in {localeNames[intent.lang]}</Badge>
            {intent.trackedLink ? <Badge variant="outline">Tracked · {intent.trackedLink.url}</Badge> : null}
          </div>
        </div>
      ) : null}

      {intent.status === "draft_ready" && !editing ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {canApprove ? (
              <Button size="lg" disabled={busy} onClick={approve}>
                <CheckIcon />
                {t.approve}
              </Button>
            ) : null}
            <Button size="lg" variant="outline" onClick={startEdit}>
              {t.edit}
            </Button>
            {canApprove ? (
              <Button size="lg" variant="ghost" onClick={() => setSkipOpen((open) => !open)}>
                {t.skip}
              </Button>
            ) : null}
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              disabled={paused || actions.generateDraft.isPending}
              onClick={() => actions.generateDraft.mutate(intent.id, { onSuccess: () => toast("New draft generated") })}
            >
              {actions.generateDraft.isPending ? "Regenerating…" : "Regenerate"}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {canApprove ? channel.how : "Editors can draft and edit; an approver or operator approves."}
          </p>
        </>
      ) : null}

      {skipOpen && reviewable && canApprove ? (
        <div className="mt-3 rounded-lg border p-3">
          <div className="text-sm font-medium">Why skip? It teaches the scoring.</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(catalog?.skipReasons ?? []).map((reason) => (
              <Button key={reason} size="sm" variant="outline" disabled={busy} onClick={() => skip(reason)}>
                {skipReasonLabel(reason)}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {intent.status === "approved" ? (
        <div className="mt-4 rounded-lg bg-success-muted p-3 text-success-muted-foreground">
          <div className="text-sm font-medium">
            Approved{intent.approvedBy ? ` by ${intent.approvedBy.name}` : ""} · ready to post by hand
          </div>
          <p className="mt-0.5 text-xs">{channel.how}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="lg" onClick={() => void copyAndOpen()}>
              <CopyIcon />
              {intent.postUrl ? "Copy reply & open thread" : "Copy reply"}
            </Button>
            {canApprove ? (
              <Button
                size="lg"
                variant="outline"
                disabled={busy}
                onClick={() =>
                  actions.markPosted.mutate(intent.id, {
                    onSuccess: () => toast(intent.trackedLink ? `Marked as posted · tracking ${intent.trackedLink.url}` : "Marked as posted"),
                  })
                }
              >
                Mark as posted
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {intent.status === "posted" ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-success" />
          <span className="text-muted-foreground">
            Posted
            {intent.trackedLink ? (
              <>
                {" "}
                · clicks on <span className="font-mono text-foreground">{intent.trackedLink.url}</span> are tracked in Analytics
              </>
            ) : null}
          </span>
          <Link href={routes.analytics} className="ml-auto text-sm">
            View
          </Link>
        </div>
      ) : null}

      {intent.status === "skipped" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-muted/60 p-3 text-sm">
          <span>
            <b>Skipped</b> · {skipReasonLabel(intent.skipReason)}. The draft was never posted.
          </span>
          {canApprove ? (
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              disabled={busy}
              onClick={() => actions.restore.mutate(intent.id, { onSuccess: () => toast("Moved back to review") })}
            >
              Undo
            </Button>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
