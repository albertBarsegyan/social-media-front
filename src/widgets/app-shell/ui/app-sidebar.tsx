"use client"

import Link from "next/link"

import { BudgetMeter, useAiBudget } from "@/entities/ai-budget"
import { roleLabels } from "@/entities/member"
import { useViewer, ViewerBadge } from "@/entities/viewer"
import { useCurrentWorkspace } from "@/entities/workspace"
import { LogoutButton } from "@/features/auth"
import { WorkspaceSwitcherButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
import { formatUsdMicros } from "@/shared/lib/format"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar"
import { Skeleton } from "@/shared/ui/skeleton"

import type { NavItem } from "../config/nav"
import { sidebarGroups } from "../config/nav"
import { isActive, useShellState } from "../lib/use-shell-state"

function NavGroup({ label, items }: { label?: string; items: NavItem[] }) {
  const { pathname, t, counts } = useShellState()
  return (
    <SidebarGroup className="py-1">
      {label ? <SidebarGroupLabel className="text-[11px] tracking-wider uppercase">{label}</SidebarGroupLabel> : null}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const count = counts[item.key]
            return (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton asChild isActive={isActive(pathname, item)}>
                  <Link href={item.href} className="no-underline">
                    <item.icon />
                    <span>{t[item.key]}</span>
                  </Link>
                </SidebarMenuButton>
                {count ? <SidebarMenuBadge>{count}</SidebarMenuBadge> : null}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

function BudgetLink() {
  const { workspaceId } = useCurrentWorkspace()
  const budget = useAiBudget(workspaceId).data
  if (!budget) return <Skeleton className="h-9 rounded-lg" />
  const month = new Date(`${budget.periodStart}T00:00:00`).toLocaleDateString("en-US", { month: "short" })
  return (
    <Link
      href={routes.settings("usage")}
      className="block space-y-1.5 rounded-lg p-1.5 no-underline hover:bg-sidebar-accent hover:text-foreground"
    >
      <span className="flex justify-between text-xs">
        <span className="text-muted-foreground">AI budget · {month}</span>
        <span className="font-mono">
          {formatUsdMicros(budget.usedUsdMicros)} / {formatUsdMicros(budget.capUsdMicros)}
        </span>
      </span>
      <BudgetMeter budget={budget} />
    </Link>
  )
}

export function AppSidebar() {
  const viewer = useViewer().data
  const { role } = useCurrentWorkspace()
  const { showAgency } = useShellState()

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-3">
        <div className="flex items-center gap-2 px-1.5 pt-1">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">N</span>
          <span className="text-sm font-semibold">Neo Growth Engine</span>
        </div>
        <WorkspaceSwitcherButton className="w-full" />
      </SidebarHeader>
      <SidebarContent>
        {showAgency ? <NavGroup label="Agency" items={sidebarGroups.agency} /> : null}
        <NavGroup label={showAgency ? "Workspace" : undefined} items={sidebarGroups.workspace} />
        <NavGroup label="Preview" items={sidebarGroups.preview} />
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t">
        <BudgetLink />
        <div className="flex items-center gap-2 px-1.5 pb-1">
          <div className="min-w-0 flex-1">
            {viewer ? <ViewerBadge user={viewer} roleLabel={roleLabels[role]} /> : <Skeleton className="h-7" />}
          </div>
          <LogoutButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
