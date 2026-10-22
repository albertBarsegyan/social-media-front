"use client"

import { usePathname } from "next/navigation"

import { useApprovalSummary } from "@/entities/approval"
import { useCurrentWorkspace } from "@/entities/workspace"
import { useMessages } from "@/shared/lib/i18n"

import { shellMessages } from "../config/messages"
import { nav, type NavItem, type NavKey } from "../config/nav"

export function isActive(pathname: string, item: NavItem) {
  return pathname === item.match || pathname.startsWith(`${item.match}/`)
}

/** Current page title and the badge counts shown in navigation. */
export function useShellState() {
  const pathname = usePathname()
  const t = useMessages(shellMessages)
  const { workspaceId, workspaces, role } = useCurrentWorkspace()
  const summary = useApprovalSummary(workspaceId).data

  const active = (Object.values(nav) as NavItem[]).find((item) => isActive(pathname, item))
  const isLeadDetail = pathname.startsWith(`${nav.leads.match}/`)

  const counts: Partial<Record<NavKey, number>> = summary
    ? { leads: summary.reviewIntents, approvals: summary.pendingReplies + summary.pendingPosts }
    : {}

  return {
    pathname,
    t,
    counts,
    isLeadDetail,
    /** The agency view makes sense once someone runs several workspaces or operates one. */
    showAgency: workspaces.length > 1 || role === "operator",
    canSwitch: workspaces.length > 1,
    title: isLeadDetail ? t.lead : active ? t[active.key] : "",
  }
}
