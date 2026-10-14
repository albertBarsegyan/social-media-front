"use client"

import Link from "next/link"
import { useState } from "react"

import { bundleLabels, HealthStatus, useCurrentWorkspace, WorkspaceAvatar } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui/dialog"
import { Input } from "@/shared/ui/input"

import { setWorkspaceSwitcherOpen, useWorkspaceSwitcherOpen } from "../model/dialog"

export function WorkspaceSwitcherDialog() {
  const open = useWorkspaceSwitcherOpen()
  const { workspace: current, workspaces, setWorkspaceId } = useCurrentWorkspace()
  const [query, setQuery] = useState("")

  const visible = workspaces
    .filter((ws) => ws.name.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => b.pendingApprovals - a.pendingApprovals)
  const close = () => setWorkspaceSwitcherOpen(false)

  return (
    <Dialog open={open} onOpenChange={setWorkspaceSwitcherOpen}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <div className="space-y-3 p-4 pb-3">
          <DialogHeader>
            <DialogTitle>Switch workspace</DialogTitle>
            <DialogDescription>
              {workspaces.length} workspace{workspaces.length === 1 ? "" : "s"} · sorted by what needs you
            </DialogDescription>
          </DialogHeader>
          <Input placeholder="Search clients" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
        <div className="max-h-80 overflow-y-auto px-4 pb-2">
          {visible.length === 0 ? <p className="p-3 text-sm text-muted-foreground">No workspace matches.</p> : null}
          {visible.map((ws) => (
            <button
              key={ws.id}
              type="button"
              onClick={() => {
                setWorkspaceId(ws.id)
                close()
                toast(`Switched to ${ws.name}`)
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-2.5 text-left hover:bg-muted",
                ws.id === current.id && "bg-muted",
              )}
            >
              <WorkspaceAvatar name={ws.name} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{ws.name}</div>
                <HealthStatus health={ws.health} />
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div>
                  <b className="text-foreground">{ws.pendingApprovals}</b> to approve
                </div>
                <div>{bundleLabels[ws.bundle]}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-between gap-2 border-t p-3">
          <Button variant="ghost" size="sm" asChild onClick={close}>
            <Link href={routes.clients}>All clients overview</Link>
          </Button>
          <Button size="sm" asChild onClick={close}>
            <Link href={routes.onboarding}>New workspace</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
