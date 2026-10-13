"use client"

import { CheckIcon, CopyIcon, ShieldCheckIcon } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"

import { useAiBudget } from "@/entities/ai-budget"
import { channelInfo } from "@/entities/channel"
import { draftThreshold, leadActions, skipReasons, type Lead } from "@/entities/lead"
import { useViewer } from "@/entities/viewer"
import { localeNames, routes } from "@/shared/config"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Textarea } from "@/shared/ui/textarea"

import { approveReply, copyReplyAndOpen, restoreReply, skipReply } from "../lib/actions"

interface ReplyReviewProps {
  lead: Lead
  /** Rendered when drafting is paused by the AI budget, e.g. a "Raise cap" button. */
  budgetAction?: ReactNode
}

/** Review the drafted reply for a lead: approve, edit, skip, then post. */
export function ReplyReview({ lead, budgetAction }: ReplyReviewProps) {
  const t = useMessages(commonMessages)
  const viewer = useViewer()
  const budget = useAiBudget()
  const paused = budget.reached && budget.hardCap
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(lead.draft)
  const [skipOpen, setSkipOpen] = useState(false)
  const channel = channelInfo[lead.source]

  const startEdit = () => {
    setDraft(lead.draft)
    setEditing(true)
    setSkipOpen(false)
  }
  const save = () => {
    leadActions.saveDraft(lead.id, draft)
    setEditing(false)
  }

  return (
    <section className="rounded-xl border bg-card p-4" aria-label="Reply draft">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-sm font-semibold">Reply draft</h2>
        {lead.edited ? <Badge variant="secondary">Edited by you</Badge> : null}
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" />
          Nothing posts without approval
        </span>
      </div>

      {lead.status === "nodraft" && !editing ? (
        <div className="mt-3 rounded-lg bg-muted/60 p-3">
          {paused ? (
            <>
              <div className="text-sm font-medium">Draft paused — AI budget reached</div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                This post was scored before the cap was hit. Raise the cap or write a reply yourself.
              </p>
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
                No draft — intent {lead.score} is below the threshold of {draftThreshold}
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Low-intent posts aren’t drafted, to save budget and avoid sounding pushy.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    leadActions.generateDraft(lead.id)
                    toast("Draft generated")
                  }}
                >
                  Draft anyway · ~$0.03
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSkipOpen((open) => !open)}>
                  {t.skip}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : null}

      {editing ? (
        <div className="mt-3 space-y-3">
          <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} rows={7} aria-label="Reply text" />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={() => {
                save()
                approveReply({ ...lead, draft })
              }}
            >
              Save &amp; {t.approve}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                save()
                toast("Edit saved — still needs approval")
              }}
            >
              Save
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{draft.length} chars</span>
          </div>
        </div>
      ) : lead.draft ? (
        <div className={cn("mt-3", lead.status === "skipped" && "opacity-55")}>
          <p className="text-sm leading-relaxed whitespace-pre-line">{lead.draft}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <Badge variant="outline">Reply in {localeNames[lead.lang]}</Badge>
            <Badge variant="outline">Tracked · {lead.link}</Badge>
            <Badge variant="outline">No banned phrases</Badge>
            <Badge variant="outline">Discloses the business</Badge>
          </div>
        </div>
      ) : null}

      {lead.status === "pending" && !editing ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="lg" onClick={() => approveReply(lead)}>
              <CheckIcon />
              {t.approve}
            </Button>
            <Button size="lg" variant="outline" onClick={startEdit}>
              {t.edit}
            </Button>
            <Button size="lg" variant="ghost" onClick={() => setSkipOpen((open) => !open)}>
              {t.skip}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="ml-auto"
              disabled={paused}
              onClick={() => toast("New draft generated · $0.03")}
            >
              Regenerate
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{channel.how}</p>
        </>
      ) : null}

      {skipOpen && (lead.status === "pending" || lead.status === "nodraft") ? (
        <div className="mt-3 rounded-lg border p-3">
          <div className="text-sm font-medium">Why skip? It teaches the scoring.</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {skipReasons.map((reason) => (
              <Button key={reason} size="sm" variant="outline" onClick={() => skipReply(lead, reason)}>
                {reason}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {lead.status === "approved" ? (
        <div className="mt-4 rounded-lg bg-success-muted p-3 text-success-muted-foreground">
          <div className="text-sm font-medium">Approved by {viewer.firstName} · ready to post by hand</div>
          <p className="mt-0.5 text-xs">{channel.how}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button size="lg" onClick={() => copyReplyAndOpen(lead)}>
              <CopyIcon />
              Copy reply &amp; open thread
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                leadActions.markPosted(lead.id)
                toast(`Marked as posted · tracking ${lead.link}`)
              }}
            >
              Mark as posted
            </Button>
          </div>
        </div>
      ) : null}

      {lead.status === "posted" ? (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-success" />
          <span className="text-muted-foreground">
            Posted · clicks on <span className="font-mono text-foreground">{lead.link}</span> are tracked in Analytics
          </span>
          <Link href={routes.analytics} className="ml-auto text-sm">
            View
          </Link>
        </div>
      ) : null}

      {lead.status === "skipped" ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-muted/60 p-3 text-sm">
          <span>
            <b>Skipped</b> · {lead.skipReason}. The draft was never posted.
          </span>
          <Button size="sm" variant="outline" className="ml-auto" onClick={() => restoreReply(lead)}>
            Undo
          </Button>
        </div>
      ) : null}
    </section>
  )
}
