"use client"

import { ArrowUpDownIcon, MenuIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { setWorkspaceSwitcherOpen } from "@/features/switch-workspace"
import { cn } from "@/shared/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet"

import { mobileMore, mobileTabs, nav } from "../config/nav"
import { isActive, useShellState } from "../lib/use-shell-state"

const tabClass = "relative flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] no-underline"

/** Bottom tab bar with a "More" sheet, shown below the md breakpoint. */
export function MobileNav() {
  const { pathname, t, counts, showAgency, canSwitch } = useShellState()
  const [moreOpen, setMoreOpen] = useState(false)
  const moreActive = mobileMore.some((item) => isActive(pathname, item))
  const moreItems = showAgency ? mobileMore : mobileMore.filter((item) => item !== nav.clients)

  return (
    <>
      <nav
        aria-label="Primary"
        className="sticky bottom-0 z-10 grid grid-cols-5 border-t bg-background px-1 pt-1.5 pb-[max(0.625rem,env(safe-area-inset-bottom))] md:hidden"
      >
        {mobileTabs.map((item) => {
          const active = isActive(pathname, item)
          const count = counts[item.key]
          return (
            <Link
              key={item.key}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(tabClass, active ? "font-semibold text-foreground" : "text-muted-foreground")}
            >
              <item.icon className="size-5" />
              <span>{item.key === "dashboard" ? t.home : t[item.key]}</span>
              {count ? (
                <span className="absolute top-0.5 left-[calc(50%+6px)] grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              ) : null}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen(true)}
          className={cn(tabClass, moreActive || moreOpen ? "font-semibold text-foreground" : "text-muted-foreground")}
        >
          <MenuIcon className="size-5" />
          <span>{t.more}</span>
        </button>
      </nav>
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-6">
          <SheetHeader>
            <SheetTitle>{t.more}</SheetTitle>
          </SheetHeader>
          <div className="grid gap-1 px-2">
            {canSwitch ? (
              <button
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  setWorkspaceSwitcherOpen(true)
                }}
                className="flex items-center gap-3 rounded-lg p-3 text-sm hover:bg-muted"
              >
                <ArrowUpDownIcon className="size-5" />
                Switch workspace
              </button>
            ) : null}
            {moreItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMoreOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg p-3 text-sm no-underline hover:bg-muted",
                  isActive(pathname, item) && "bg-muted font-medium",
                )}
              >
                <item.icon className="size-5" />
                {t[item.key]}
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
