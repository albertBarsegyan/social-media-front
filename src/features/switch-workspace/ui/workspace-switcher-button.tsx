"use client"

import { ChevronsUpDownIcon } from "lucide-react"

import { useCurrentWorkspace, WorkspaceAvatar } from "@/entities/workspace"
import { cn } from "@/shared/lib/utils"

import { setWorkspaceSwitcherOpen } from "../model/dialog"

interface WorkspaceSwitcherButtonProps {
  /** Replaces the workspace type line, e.g. with the page title on mobile. */
  title?: string
  canSwitch: boolean
  className?: string
}

export function WorkspaceSwitcherButton({ title, canSwitch, className }: WorkspaceSwitcherButtonProps) {
  const { workspace } = useCurrentWorkspace()
  return (
    <button
      type="button"
      disabled={!canSwitch}
      onClick={() => setWorkspaceSwitcherOpen(true)}
      className={cn(
        "flex min-w-0 items-center gap-2.5 rounded-lg p-1.5 text-left enabled:hover:bg-sidebar-accent",
        className,
      )}
    >
      <WorkspaceAvatar initials={workspace.initials} />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block truncate text-sm font-medium">{title ?? workspace.name}</span>
        <span className="block truncate text-xs text-muted-foreground">{title ? workspace.name : workspace.type}</span>
      </span>
      {canSwitch && !title ? <ChevronsUpDownIcon className="size-4 text-muted-foreground" /> : null}
    </button>
  )
}
