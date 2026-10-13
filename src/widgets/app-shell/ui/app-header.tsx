"use client"

import { ChevronLeftIcon, SearchIcon } from "lucide-react"
import Link from "next/link"

import { useCurrentWorkspace } from "@/entities/workspace"
import { useViewer } from "@/entities/viewer"
import { LanguageCycleButton, LanguageTabs } from "@/features/switch-language"
import { WorkspaceSwitcherButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

import { useShellState } from "../lib/use-shell-state"

export function AppHeader() {
  const { t, title, isLeadDetail } = useShellState()
  const { workspace } = useCurrentWorkspace()
  const viewer = useViewer()

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
      <WorkspaceSwitcherButton title={title} canSwitch={viewer.role === "operator"} className="flex-1 md:hidden" />
      <div className="md:hidden">
        <LanguageCycleButton />
      </div>

      {/* Desktop */}
      <div className="hidden min-w-0 flex-1 items-baseline gap-2 md:flex">
        <span className="truncate text-sm text-muted-foreground">{workspace.name} /</span>
        <h1 className="truncate text-base font-semibold">{title}</h1>
      </div>
      <div className="relative hidden xl:block">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="search" placeholder={t.search} className="h-8 w-64 pl-8" aria-label={t.search} />
      </div>
      <div className="hidden md:block">
        <LanguageTabs />
      </div>
    </header>
  )
}
