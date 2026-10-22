import type { BuyingIntentStatus, IntentTier } from "@/shared/api"

export const statusLabels: Record<BuyingIntentStatus, string> = {
  draft_ready: "Draft ready",
  no_draft: "No draft",
  approved: "Approved · post by hand",
  posted: "Posted",
  skipped: "Skipped",
}

export const tierLabels: Record<IntentTier, string> = { hot: "Hot", warm: "Warm", cold: "Cold" }

/** Labels for `Catalog.skipReasons` keys; unknown keys (free text) are shown as-is. */
const skipReasonLabels: Record<string, string> = {
  not_relevant: "Not relevant",
  outside_area: "Outside our area",
  competitor_spam: "Competitor or spam",
  already_handled: "Already handled",
  skipped_from_queue: "Skipped from the queue",
}

export function skipReasonLabel(reason: string | null): string {
  return reason ? (skipReasonLabels[reason] ?? reason) : ""
}
