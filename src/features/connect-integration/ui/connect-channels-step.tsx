"use client"

import { integrationDescriptions, integrationNames, useIntegrations } from "@/entities/integration"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

import { useConnectIntegration } from "../api/mutations"

/** Onboarding step: connect Buffer, link the Telegram bot, optionally Blotato and Apify. */
export function ConnectChannelsStep({ wid }: { wid: string }) {
  const query = useIntegrations(wid)
  const connect = useConnectIntegration(wid)

  if (query.isPending) return <Skeleton className="h-64 rounded-lg" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />

  return (
    <div className="space-y-3">
      {query.data.map((integration) => {
        const connected = integration.status === "connected"
        const pending = connect.isPending && connect.variables === integration.provider
        return (
          <div key={integration.provider} className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
            <span className="grid size-9 place-items-center rounded-lg bg-muted text-sm font-semibold">
              {integrationNames[integration.provider][0]}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">
                {integrationNames[integration.provider]}{" "}
                <span className="font-normal text-muted-foreground">· {integration.required ? "required" : "optional"}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {integration.provider === "telegram_bot" && !connected && integration.telegramLinkCode ? (
                  <>
                    Ask the owner to open the bot and send{" "}
                    <code className="rounded bg-muted px-1 font-mono">/start {integration.telegramLinkCode}</code>
                  </>
                ) : (
                  integrationDescriptions[integration.provider]
                )}
              </div>
            </div>
            {connected ? (
              <Badge>Connected</Badge>
            ) : (
              <Button
                size="sm"
                variant={integration.required ? "default" : "outline"}
                disabled={connect.isPending}
                onClick={() => connect.mutate(integration.provider)}
              >
                {pending ? "Connecting…" : "Connect"}
              </Button>
            )}
          </div>
        )
      })}
      <p className="text-xs text-muted-foreground">
        Reddit, Facebook groups and Telegram groups don’t need connecting — replies there are copied and posted by hand from
        your own account.
      </p>
    </div>
  )
}
