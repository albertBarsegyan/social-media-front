"use client"

import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react"

import { budgetPeriod, formatMoney, useAiBudget } from "@/entities/ai-budget"
import { setRaiseCapOpen } from "@/features/adjust-ai-cap"
import { useChannelDisconnected, useReconnectChannel } from "@/features/connect-integration"
import { Button } from "@/shared/ui/button"

/** Workspace-wide problems that pause publishing or drafting. */
export function StatusBanners() {
  const disconnected = useChannelDisconnected()
  const reconnect = useReconnectChannel()
  const budget = useAiBudget()

  return (
    <>
      {disconnected ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-destructive-border bg-destructive-muted px-4 py-2.5 text-sm text-destructive-muted-foreground md:px-6"
        >
          <CircleAlertIcon className="size-4 shrink-0" />
          <span className="flex-1">
            <b>Instagram disconnected in Buffer.</b> 2 scheduled posts are paused until you reconnect.
          </span>
          <Button variant="outline" size="sm" onClick={reconnect}>
            Reconnect
          </Button>
        </div>
      ) : null}
      {budget.reached && budget.hardCap ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-warning-border bg-warning-muted px-4 py-2.5 text-sm text-warning-muted-foreground md:px-6"
        >
          <TriangleAlertIcon className="size-4 shrink-0" />
          <span className="flex-1">
            <b>
              AI budget reached — {formatMoney(budget.used)} of {formatMoney(budget.cap)}.
            </b>{" "}
            Intent scoring and new drafts are paused until {budgetPeriod.resetsOn}. Drafts already written can still be
            approved.
          </span>
          <Button variant="outline" size="sm" onClick={() => setRaiseCapOpen(true)}>
            Raise cap
          </Button>
        </div>
      ) : null}
    </>
  )
}
