"use client"

import { usePathname } from "next/navigation"

import { useLeads } from "@/entities/lead"
import { usePosts } from "@/entities/post"
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
  const leads = useLeads()
  const posts = usePosts()

  const active = (Object.values(nav) as NavItem[]).find((item) => isActive(pathname, item))
  const isLeadDetail = pathname.startsWith(`${nav.leads.match}/`)

  const newLeads = leads.filter((lead) => lead.status === "pending" || lead.status === "nodraft").length
  const pendingTotal =
    leads.filter((lead) => lead.status === "pending").length + posts.filter((post) => post.status === "pending").length

  const counts: Partial<Record<NavKey, number>> = { leads: newLeads, approvals: pendingTotal }

  return {
    pathname,
    t,
    counts,
    isLeadDetail,
    title: isLeadDetail ? t.lead : active ? t[active.key] : "",
  }
}
