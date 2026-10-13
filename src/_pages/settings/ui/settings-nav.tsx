"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { routes, settingsSections } from "@/shared/config"
import { cn } from "@/shared/lib/utils"

import { sectionLabels } from "../config/sections"

export function SettingsNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Settings" className="flex gap-1 overflow-x-auto md:flex-col">
      {settingsSections.map((section) => {
        const href = routes.settings(section)
        const active = pathname === href
        return (
          <Link
            key={section}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm whitespace-nowrap hover:bg-muted",
              active ? "bg-muted font-medium" : "text-muted-foreground",
            )}
          >
            {sectionLabels[section]}
          </Link>
        )
      })}
    </nav>
  )
}
