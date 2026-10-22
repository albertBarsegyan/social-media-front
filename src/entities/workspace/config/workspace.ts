import type { Bundle, WorkspaceHealth } from "@/shared/api"

export const workspaceCookie = "workspace"

export const bundleLabels: Record<Bundle, string> = {
  content: "Content",
  leads: "Leads",
  leads_bookings: "Leads + Bookings",
  internal: "Internal",
}

export const bundleDescriptions: Record<Bundle, string> = {
  content: "Posts for 2–3 channels, scheduled and measured",
  leads: "Content + buyer-intent monitoring and reply drafts",
  leads_bookings: "Leads + AI front desk that books appointments",
  internal: "Own use, no billing",
}

const integrationNames = { buffer: "Buffer", telegram_bot: "Telegram bot", blotato: "Blotato", apify: "Apify" } as const

/** Human-readable line for a workspace's health. */
export function healthLabel(health: WorkspaceHealth): string {
  switch (health.reason) {
    case "setup_incomplete":
      return `Setup — step ${health.onboardingStep ?? 1} of 4`
    case "integration_error":
      return `${health.integration ? integrationNames[health.integration] : "A channel"} needs reconnecting`
    case "ai_budget_reached":
      return "AI budget reached"
    case "ai_budget_high":
      return `AI budget at ${health.aiBudgetPercent ?? 80}%`
    default:
      return "All channels connected"
  }
}
