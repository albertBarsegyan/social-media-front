"use client"

import { SendIcon } from "lucide-react"
import type { ReactNode } from "react"
import { useState } from "react"

import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"

function ServiceRow({ mark, name, note, children, action }: { mark: ReactNode; name: string; note: string; children: ReactNode; action: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border p-3">
      <span className="grid size-9 place-items-center rounded-lg bg-muted text-sm font-semibold">{mark}</span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">
          {name} <span className="font-normal text-muted-foreground">· {note}</span>
        </div>
        <div className="text-xs text-muted-foreground">{children}</div>
      </div>
      {action}
    </div>
  )
}

/** Onboarding step: connect Buffer, link the Telegram bot, optionally Blotato. */
export function ConnectChannelsStep() {
  const [buffer, setBuffer] = useState<"idle" | "loading" | "connected">("idle")
  const [telegram, setTelegram] = useState(false)
  const [blotato, setBlotato] = useState(false)

  return (
    <div className="space-y-3">
      <ServiceRow
        mark="B"
        name="Buffer"
        note="required for publishing"
        action={
          buffer === "connected" ? (
            <Badge>Connected</Badge>
          ) : (
            <Button
              size="sm"
              disabled={buffer === "loading"}
              onClick={() => {
                setBuffer("loading")
                setTimeout(() => setBuffer("connected"), 1200)
              }}
            >
              Connect
            </Button>
          )
        }
      >
        {buffer === "connected" ? (
          <span className="text-success-muted-foreground">Connected · Instagram @mila.beauty, Facebook page, Telegram channel</span>
        ) : buffer === "loading" ? (
          "Waiting for Buffer…"
        ) : (
          "Instagram, Facebook, Telegram channel, LinkedIn"
        )}
      </ServiceRow>

      <div className="rounded-lg border p-3">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-muted">
            <SendIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">
              Telegram bot <span className="font-normal text-muted-foreground">· where the owner approves</span>
            </div>
            <div className="text-xs text-muted-foreground">Lead cards, approvals, weekly report, alerts</div>
          </div>
          {telegram ? <Badge>Linked</Badge> : null}
        </div>
        {telegram ? (
          <div className="mt-2 text-xs text-success-muted-foreground">Linked to Mila Petrosyan · test message delivered</div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md bg-muted/60 p-2 text-xs">
            <span>
              Ask the owner to open <b>@NeoGrowthBot</b> and send{" "}
              <code className="rounded bg-background px-1 font-mono">/start mila-7K2Q</code>
            </span>
            <Button size="sm" variant="outline" className="ml-auto" onClick={() => setTelegram(true)}>
              Simulate link
            </Button>
          </div>
        )}
      </div>

      <ServiceRow
        mark="B"
        name="Blotato"
        note="optional"
        action={
          blotato ? (
            <Badge>Connected</Badge>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setBlotato(true)}>
              Connect
            </Button>
          )
        }
      >
        Posts approved replies on X
      </ServiceRow>

      <p className="text-xs text-muted-foreground">
        Reddit, Facebook groups and Telegram groups don’t need connecting — replies there are copied and posted by hand from
        your own account.
      </p>
    </div>
  )
}
