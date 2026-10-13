import type { LeadStatus } from "../model/types"

/** Drafts are only written for posts scoring at or above this. */
export const draftThreshold = 40

export const skipReasons = ["Not relevant", "Outside our area", "Competitor or spam", "Already handled"]

export const leadStatusLabels: Record<LeadStatus, string> = {
  pending: "Draft ready",
  nodraft: "No draft",
  approved: "Approved · post by hand",
  posted: "Posted",
  skipped: "Skipped",
}
