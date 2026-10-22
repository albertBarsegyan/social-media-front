import {
  CalendarIcon,
  ChartColumnIcon,
  CheckCheckIcon,
  HouseIcon,
  InboxIcon,
  LayoutGridIcon,
  SendIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  WandSparklesIcon,
  type LucideIcon,
} from "lucide-react"

import { routes } from "@/shared/config"

export type NavKey =
  | "clients"
  | "dashboard"
  | "leads"
  | "approvals"
  | "studio"
  | "calendar"
  | "analytics"
  | "settings"
  | "telegram"
  | "onboarding"

export interface NavItem {
  key: NavKey
  href: string
  icon: LucideIcon
  /** Path prefix that marks the item active. */
  match: string
}

const item = (key: NavKey, href: string, icon: LucideIcon, match = href): NavItem => ({ key, href, icon, match })

export const nav = {
  clients: item("clients", routes.clients, LayoutGridIcon),
  dashboard: item("dashboard", routes.dashboard, HouseIcon),
  leads: item("leads", routes.leads, InboxIcon),
  approvals: item("approvals", routes.approvals, CheckCheckIcon),
  studio: item("studio", routes.studio, SparklesIcon),
  calendar: item("calendar", routes.calendar, CalendarIcon),
  analytics: item("analytics", routes.analytics, ChartColumnIcon),
  settings: item("settings", routes.settings(), SlidersHorizontalIcon, "/settings"),
  telegram: item("telegram", routes.telegramPreview, SendIcon),
  onboarding: item("onboarding", routes.onboarding, WandSparklesIcon),
} satisfies Record<NavKey, NavItem>

export const sidebarGroups = {
  agency: [nav.clients],
  workspace: [nav.dashboard, nav.leads, nav.approvals, nav.studio, nav.calendar, nav.analytics, nav.settings],
  preview: [nav.telegram, nav.onboarding],
}

export const mobileTabs = [nav.dashboard, nav.leads, nav.approvals, nav.calendar]

export const mobileMore = [nav.clients, nav.studio, nav.analytics, nav.settings, nav.telegram, nav.onboarding]
