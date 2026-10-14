"use client"

import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link"

import { useCurrentWorkspace } from "@/entities/workspace"
import { LanguageCycleButton, LanguageTabs } from "@/features/switch-language"
import { WorkspaceSwitcherButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

import { useShellState } from "../lib/use-shell-state"

export function AppHeader() {
  const { title, isLeadDetail } = useShellState()
  const { workspace } = useCurrentWorkspace()

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b bg-background px-3 md:gap-4 md:px-6">
      {/* Mobile */}
      {isLeadDetail ? (
        <Button variant="ghost" size="icon" asChild className="md:hidden">
          <Link href={routes.leads} aria-label="All leads">
            <ChevronLeftIcon />
          </Link>
        </Button>
      ) : null}
      <WorkspaceSwitcherButton title={title} className="flex-1 md:hidden" />
      <div className="md:hidden">
        <LanguageCycleButton />
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 items-baseline gap-2 md:flex">
        <span className="truncate text-sm text-muted-foreground">{workspace.name} /</span>
        <h1 className="truncate text-base font-semibold">{title}</h1>
      </div>
      <div className="hidden md:block">
        <LanguageTabs />
      </div>
    </header>
  )
}
