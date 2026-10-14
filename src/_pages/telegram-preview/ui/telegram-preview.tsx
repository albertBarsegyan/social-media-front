"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"

import { useAiBudget } from "@/entities/ai-budget"
import { useApprovalSummary } from "@/entities/approval"
import { skipReasonLabel, useBuyingIntents } from "@/entities/buying-intent"
import { useCatalog } from "@/entities/catalog"
import { channelInfo } from "@/entities/channel"
import { integrationNames, useBrokenIntegrations } from "@/entities/integration"
import { useWeeklyReport } from "@/entities/report"
import { useCurrentWorkspace } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { formatDate, formatRelative, formatUsdMicros } from "@/shared/lib/format"
import { useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"

import { botMessages, fill } from "../config/messages"

type LeadCardState = "pending" | "approved" | "posted" | "skipped" | "edit"

const bubble = "rounded-xl rounded-tl-sm bg-background p-3 text-sm shadow-xs"
const botButton = "rounded-lg bg-background/80 px-2 py-1.5 text-center text-xs font-medium text-sky-700 dark:text-sky-300 shadow-xs hover:bg-background"
const sentBubble = "ml-auto max-w-[80%] rounded-xl rounded-tr-sm bg-success-muted p-2.5 text-sm"

function Phone({ label, children }: { label: string; children: ReactNode }) {
  return (
    <figure className="space-y-2">
      <figcaption className="text-xs text-muted-foreground">{label}</figcaption>
      <div className="overflow-hidden rounded-[28px] border-[6px] border-foreground/90">
        <div className="flex items-center gap-2 border-b bg-background px-3 py-2">
          <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">N</span>
          <div className="leading-tight">
            <div className="text-sm font-medium">Neo Growth Bot</div>
            <div className="text-[11px] text-muted-foreground">bot</div>
          </div>
        </div>
        <div className="min-h-[420px] space-y-2 bg-[oklch(0.95_0.012_240)] p-3 dark:bg-muted">{children}</div>
        <div className="border-t bg-background px-3 py-2 text-sm text-muted-foreground">Message</div>
      </div>
    </figure>
  )
}

/**
 * What the business owner sees in Telegram, filled with this workspace's data. The buttons only
 * demonstrate the flow here; nothing is approved from this page. (The bot itself is TODO.)
 */
export function TelegramPreview() {
  const t = useMessages(botMessages)
  const { workspaceId, workspace } = useCurrentWorkspace()
  const intent = useBuyingIntents(workspaceId, { tab: "review" }).data?.pages[0]?.items.find((item) => item.draft)
  const weekly = useWeeklyReport(workspaceId).data
  const budget = useAiBudget(workspaceId).data
  const summary = useApprovalSummary(workspaceId).data
  const broken = useBrokenIntegrations(workspaceId)
  const skipReasons = useCatalog().data?.skipReasons ?? []
  const [state, setState] = useState<LeadCardState>("pending")
  const openPost = () => (intent?.postUrl ? window.open(intent.postUrl, "_blank", "noopener,noreferrer") : toast("No link to the original post"))
  const money = budget ? { used: formatUsdMicros(budget.usedUsdMicros), cap: formatUsdMicros(budget.capUsdMicros), date: formatDate(budget.resetsOn) } : null

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="flex-1 text-sm text-muted-foreground">
          A preview of what the business owner sees in Telegram. Bot copy follows the language switcher; replies stay in the
          language of the original post. Buttons here only demonstrate the flow.
        </p>
        <Button size="sm" variant="outline" onClick={() => setState("pending")}>
          Reset demo
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Phone label="Lead card — tap Approve, Edit or Skip">
          {intent ? (
            <>
              <div className={bubble}>
                <div className="font-semibold">{fill(t.newLead, { score: intent.score })}</div>
                <div className="text-xs text-muted-foreground">
                  {channelInfo[intent.channel].label} · {intent.sourceName} · {formatRelative(intent.foundAt)}
                </div>
                <p className="mt-2">{intent.text}</p>
                {intent.reasons.length ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {t.why} {intent.reasons.map((reason) => reason.label).join("; ")}
                  </p>
                ) : null}
                <div className="mt-2 text-xs font-medium">{t.draft}</div>
                <p className="mt-1 border-l-2 border-sky-500 pl-2 text-xs">{intent.draft}</p>
              </div>
              {state === "pending" ? (
                <div className="grid grid-cols-3 gap-1">
                  <button type="button" className={botButton} onClick={() => setState("approved")}>{t.approve}</button>
                  <button type="button" className={botButton} onClick={() => setState("edit")}>{t.edit}</button>
                  <button type="button" className={botButton} onClick={() => setState("skipped")}>{t.skip}</button>
                  <button type="button" className={`${botButton} col-span-3`} onClick={openPost}>{t.open} ↗</button>
                </div>
              ) : null}
              {state === "approved" || state === "posted" ? (
                <>
                  <div className={sentBubble}>{t.approve}</div>
                  <div className={bubble}>{t.approved}</div>
                  {state === "approved" ? (
                    <div className="grid grid-cols-2 gap-1">
                      <button type="button" className={botButton} onClick={openPost}>{t.open} ↗</button>
                      <button type="button" className={botButton} onClick={() => setState("posted")}>{t.posted}</button>
                    </div>
                  ) : (
                    <div className={bubble}>✓ {t.posted}{intent.trackedLink ? ` · ${intent.trackedLink.url}` : ""}</div>
                  )}
                </>
              ) : null}
              {state === "skipped" ? (
                <>
                  <div className={sentBubble}>{t.skip}</div>
                  <div className={bubble}>{t.skipped}</div>
                  <div className="grid gap-1">
                    {skipReasons.map((reason) => (
                      <button key={reason} type="button" className={botButton} onClick={() => toast(`Preview · ${skipReasonLabel(reason)}`)}>
                        {skipReasonLabel(reason)}
                      </button>
                    ))}
                  </div>
                </>
              ) : null}
              {state === "edit" ? (
                <>
                  <div className={sentBubble}>{t.edit}</div>
                  <div className={bubble}>{t.editPrompt}</div>
                </>
              ) : null}
            </>
          ) : (
            <EmptyState className="bg-background" title="No drafts to preview" description="A lead card appears when a reply draft is waiting." />
          )}
        </Phone>

        <Phone label="Weekly report — Mondays">
          {weekly ? (
            <div className={bubble}>
              <div className="font-semibold">
                {fill(t.weekly, { range: `${formatDate(weekly.from)}–${formatDate(new Date(new Date(weekly.to).getTime() - 1).toISOString())}` })}
              </div>
              <div className="text-xs text-muted-foreground">{workspace.name}</div>
              <ul className="mt-2 space-y-0.5">
                {t.weeklyLines.map((line) => (
                  <li key={line}>
                    {fill(line, {
                      intents: weekly.kpis.buyingIntents.current,
                      replies: weekly.kpis.repliesSent.current,
                      clicks: weekly.kpis.linkClicks.current,
                      inquiries: weekly.kpis.inquiries.current,
                      deals: weekly.kpis.deals.current,
                    })}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                {weekly.bestChannel
                  ? fill(t.best, {
                      channel: channelInfo[weekly.bestChannel.channel].label,
                      deals: weekly.bestChannel.deals,
                      replies: weekly.bestChannel.repliesSent,
                    })
                  : t.noBest}
              </p>
              {money ? <p className="mt-1 text-xs text-muted-foreground">{fill(t.budget, money)}</p> : null}
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-1">
            <Link href={routes.dashboard} className={botButton}>{t.openDash} ↗</Link>
            <Link href={routes.approvals} className={botButton}>
              {fill(t.pending, { count: summary ? summary.pendingReplies + summary.pendingPosts : 0 })}
            </Link>
          </div>
        </Phone>

        <Phone label="Alerts — budget and channel health">
          {budget && money ? (
            <>
              <div className={bubble}>
                <b>AI</b> · {fill(budget.paused ? t.budgetHit : t.budgetOk, money)}
              </div>
              {budget.paused ? (
                <div className="grid grid-cols-2 gap-1">
                  <Link href={routes.settings("usage")} className={botButton}>{t.raise}</Link>
                  <button type="button" className={botButton} onClick={() => toast(`AI stays paused until ${money.date}`)}>{t.keep}</button>
                </div>
              ) : null}
            </>
          ) : null}
          {broken.length ? (
            broken.map((integration) => (
              <div key={integration.provider} className="space-y-2">
                <div className={bubble}>
                  <b>!</b> {fill(t.disc, { provider: integrationNames[integration.provider] })}
                </div>
                <Link href={routes.settings("channels")} className={`${botButton} block`}>{t.reconnect} ↗</Link>
              </div>
            ))
          ) : (
            <div className={bubble}>✓ {t.allConnected}</div>
          )}
        </Phone>
      </div>
    </div>
  )
}
