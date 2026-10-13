"use client"

import Link from "next/link"
import { useState, type ReactNode } from "react"

import { useLead } from "@/entities/lead"
import { routes } from "@/shared/config"
import { useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"

import { botMessages } from "../config/messages"

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

/** What the business owner sees in Telegram, with a clickable lead card. */
export function TelegramPreview() {
  const t = useMessages(botMessages)
  const lead = useLead("l1")
  const [state, setState] = useState<LeadCardState>("pending")
  const openPost = () => toast("Opens the Reddit thread")

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <p className="flex-1 text-sm text-muted-foreground">
          What the business owner sees in Telegram. Bot copy follows the language switcher; replies stay in the language
          of the original post.
        </p>
        <Button size="sm" variant="outline" onClick={() => setState("pending")}>
          Reset demo
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Phone label="Lead card — tap Approve, Edit or Skip">
          <div className={bubble}>
            <div className="font-semibold">{t.newLead}</div>
            <div className="text-xs text-muted-foreground">Reddit · r/armenia · 12 min</div>
            <p className="mt-2">{lead?.text}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t.why}</p>
            <div className="mt-2 text-xs font-medium">{t.draft}</div>
            <p className="mt-1 border-l-2 border-sky-500 pl-2 text-xs">{lead?.draft}</p>
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
                <div className={bubble}>✓ {t.posted} · mila.am/r/k3x9</div>
              )}
            </>
          ) : null}
          {state === "skipped" ? (
            <>
              <div className={sentBubble}>{t.skip}</div>
              <div className={bubble}>{t.skipped}</div>
              <div className="grid gap-1">
                {t.reasons.map((reason) => (
                  <button key={reason} type="button" className={botButton} onClick={() => toast(`Skipped · ${reason}`)}>
                    {reason}
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
        </Phone>

        <Phone label="Weekly report — Mondays 09:00">
          <div className={bubble}>
            <div className="font-semibold">{t.weekly}</div>
            <div className="text-xs text-muted-foreground">Mila Beauty Studio</div>
            <ul className="mt-2 space-y-0.5">
              {t.weeklyLines.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-2">{t.best}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t.budget}</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Link href={routes.dashboard} className={botButton}>{t.openDash} ↗</Link>
            <Link href={routes.approvals} className={botButton}>{t.pending}</Link>
          </div>
        </Phone>

        <Phone label="Alerts — budget and channel health">
          <div className={bubble}>
            <b>AI</b> · {t.budgetHit}
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Link href={routes.settings("usage")} className={botButton}>{t.raise}</Link>
            <button type="button" className={botButton} onClick={() => toast("AI stays paused until Nov 1")}>{t.keep}</button>
          </div>
          <div className={bubble}>
            <b>!</b> {t.disc}
          </div>
          <Link href={routes.settings("channels")} className={botButton}>{t.reconnect} ↗</Link>
        </Phone>
      </div>
    </div>
  )
}
