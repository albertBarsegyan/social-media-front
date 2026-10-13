"use client"

import { integrationActions, useIntegrations, useIsReconnected } from "@/entities/integration"
import { useCurrentWorkspace } from "@/entities/workspace"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

/** True while the current workspace has a channel that needs reconnecting. */
export function useChannelDisconnected() {
  const { workspace } = useCurrentWorkspace()
  const reconnected = useIsReconnected(workspace.id)
  return workspace.health === "err" && !reconnected
}

export function useReconnectChannel() {
  const { workspace } = useCurrentWorkspace()
  return () => {
    integrationActions.reconnect(workspace.id)
    toast("Instagram reconnected · 2 posts resumed")
  }
}

/** Connected services in Settings → Channels. */
export function IntegrationList() {
  const integrations = useIntegrations()
  const disconnected = useChannelDisconnected()
  const reconnect = useReconnectChannel()

  return (
    <ul className="divide-y">
      {integrations.map((integration) => {
        const broken = integration.id === "buffer" && disconnected
        return (
          <li key={integration.id} className="flex flex-wrap items-center gap-3 py-3">
            <span className="grid size-9 place-items-center rounded-lg bg-muted text-sm font-semibold">
              {integration.name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium">{integration.name}</span>
                <span className="text-xs text-muted-foreground">{integration.role}</span>
              </div>
              <div className="truncate text-xs text-muted-foreground">{integration.detail}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-xs">
                <span aria-hidden className={cn("size-1.5 rounded-full", broken ? "bg-warning" : "bg-success")} />
                {broken ? "Instagram token expired" : integration.status}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={broken ? reconnect : () => toast(`Opens ${integration.name}`)}
            >
              {broken ? "Reconnect" : integration.id === "telegram-bot" ? "Test message" : "Manage"}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
