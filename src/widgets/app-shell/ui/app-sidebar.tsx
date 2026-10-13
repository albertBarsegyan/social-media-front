"use client"

import Link from "next/link"

import { BudgetMeter, formatMoney, useAiBudget, budgetPeriod } from "@/entities/ai-budget"
import { useViewer, ViewerBadge } from "@/entities/viewer"
import { WorkspaceSwitcherButton } from "@/features/switch-workspace"
import { routes } from "@/shared/config"
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

export function AppSidebar() {
  const viewer = useViewer()
  const budget = useAiBudget()
  const isOperator = viewer.role === "operator"

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-3">
        <div className="flex items-center gap-2 px-1.5 pt-1">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">N</span>
          <span className="text-sm font-semibold">Neo Growth Engine</span>
        </div>
        <WorkspaceSwitcherButton canSwitch={isOperator} className="w-full" />
      </SidebarHeader>
      <SidebarContent>
        {isOperator ? <NavGroup label="Agency" items={sidebarGroups.agency} /> : null}
        <NavGroup label={isOperator ? "Workspace" : undefined} items={sidebarGroups.workspace} />
        <NavGroup label="Preview" items={sidebarGroups.preview} />
      </SidebarContent>
      <SidebarFooter className="gap-3 border-t">
        <Link
          href={routes.settings("usage")}
          className="block space-y-1.5 rounded-lg p-1.5 no-underline hover:bg-sidebar-accent hover:text-foreground"
        >
          <span className="flex justify-between text-xs">
            <span className="text-muted-foreground">AI budget · {budgetPeriod.month}</span>
            <span className="font-mono">
              {formatMoney(budget.used)} / {formatMoney(budget.cap)}
            </span>
          </span>
          <BudgetMeter budget={budget} />
        </Link>
        <div className="px-1.5 pb-1">
          <ViewerBadge viewer={viewer} />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
