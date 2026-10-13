import type { Lead, LeadTab } from "../model/types"

export type IntentTier = "hot" | "warm" | "cold"

export function intentTier(score: number): IntentTier {
  if (score >= 70) return "hot"
  if (score >= 40) return "warm"
  return "cold"
}

export const intentTierLabels: Record<IntentTier, string> = { hot: "Hot", warm: "Warm", cold: "Cold" }

export function leadTab(lead: Lead): LeadTab {
  if (lead.status === "pending" || lead.status === "nodraft") return "review"
  return lead.status === "skipped" ? "skipped" : "done"
}
