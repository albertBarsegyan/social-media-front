"use client"

import { errorLabels, integrationNames, purposeLabels, useIntegrations, type Integration } from "@/entities/integration"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

import { useConnectIntegration, useDisconnectIntegration } from "../api/mutations"

const statusDot: Record<Integration["status"], string> = {
  connected: "bg-success",
  not_connected: "bg-muted-foreground",
  error: "bg-warning",
}

function statusText(integration: Integration) {
  if (integration.status === "error") return errorLabels[integration.errorCode ?? ""] ?? "Needs reconnecting"
  if (integration.status === "not_connected") return integration.required ? "Not connected · required" : "Not connected"
  return integration.accountLabel ? `Connected · ${integration.accountLabel}` : "Connected"
}

/** Connected services in Settings → Channels. */
export function IntegrationList({ wid, canManage }: { wid: string; canManage: boolean }) {
  const query = useIntegrations(wid)
  const connect = useConnectIntegration(wid)
  const disconnect = useDisconnectIntegration(wid)
  const busy = connect.isPending || disconnect.isPending

  if (query.isPending) return <Skeleton className="h-48 rounded-lg" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />

  return (
    <ul className="divide-y">
      {query.data.map((integration) => {
        const name = integrationNames[integration.provider]
        return (
          <li key={integration.provider} className="flex flex-wrap items-center gap-3 py-3">
            <span className="grid size-9 place-items-center rounded-lg bg-muted text-sm font-semibold">{name[0]}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{name}</span>
                <span className="text-xs text-muted-foreground">{purposeLabels[integration.purpose]}</span>
              </div>
              {integration.provider === "telegram_bot" && integration.telegramLinkCode && integration.status !== "connected" ? (
                <div className="truncate text-xs text-muted-foreground">
                  Owner sends <code className="font-mono">/start {integration.telegramLinkCode}</code> to the bot
                </div>
              ) : null}
              <div className="mt-1 inline-flex items-center gap-1.5 text-xs">
                <span aria-hidden className={cn("size-1.5 rounded-full", statusDot[integration.status])} />
                {statusText(integration)}
              </div>
            </div>
            {canManage ? (
              integration.status === "connected" ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={busy}
                  onClick={() => disconnect.mutate(integration.provider, { onSuccess: () => toast(`${name} disconnected`) })}
                >
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant={integration.status === "error" ? "default" : "outline"}
                  disabled={busy}
                  onClick={() => connect.mutate(integration.provider, { onSuccess: () => toast(`${name} connected`) })}
                >
                  {integration.status === "error" ? "Reconnect" : "Connect"}
                </Button>
              )
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
