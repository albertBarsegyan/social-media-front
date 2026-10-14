"use client"

import { CircleAlertIcon, TriangleAlertIcon } from "lucide-react"

import { useAiBudget } from "@/entities/ai-budget"
import { integrationNames, useBrokenIntegrations } from "@/entities/integration"
import { useCurrentWorkspace } from "@/entities/workspace"
import { setRaiseCapOpen } from "@/features/adjust-ai-cap"
import { useConnectIntegration } from "@/features/connect-integration"
import { formatDate, formatUsdMicros } from "@/shared/lib/format"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"

/** Workspace-wide problems that pause publishing or drafting. */
export function StatusBanners() {
  const { workspaceId, role } = useCurrentWorkspace()
  const broken = useBrokenIntegrations(workspaceId)
  const budget = useAiBudget(workspaceId).data
  const reconnect = useConnectIntegration(workspaceId)
  const isOperator = role === "operator"

  return (
    <>
      {broken.map((integration) => (
        <div
          key={integration.provider}
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-destructive-border bg-destructive-muted px-4 py-2.5 text-sm text-destructive-muted-foreground md:px-6"
        >
          <CircleAlertIcon className="size-4 shrink-0" />
          <span className="flex-1">
            <b>{integrationNames[integration.provider]} needs reconnecting.</b> Work that depends on it is paused until then.
          </span>
          {isOperator ? (
            <Button
              variant="outline"
              size="sm"
              disabled={reconnect.isPending}
              onClick={() =>
                reconnect.mutate(integration.provider, {
                  onSuccess: () => toast(`${integrationNames[integration.provider]} reconnected`),
                })
              }
            >
              Reconnect
            </Button>
          ) : null}
        </div>
      ))}
      {budget?.paused ? (
        <div
          role="alert"
          className="flex flex-wrap items-center gap-3 border-b border-warning-border bg-warning-muted px-4 py-2.5 text-sm text-warning-muted-foreground md:px-6"
        >
          <TriangleAlertIcon className="size-4 shrink-0" />
          <span className="flex-1">
            <b>
              AI budget reached — {formatUsdMicros(budget.usedUsdMicros)} of {formatUsdMicros(budget.capUsdMicros)}.
            </b>{" "}
            Intent scoring and new drafts are paused until {formatDate(budget.resetsOn)}. Drafts already written can still be
            approved.
          </span>
          {isOperator ? (
            <Button variant="outline" size="sm" onClick={() => setRaiseCapOpen(true)}>
              Raise cap
            </Button>
          ) : null}
        </div>
      ) : null}
    </>
  )
}
