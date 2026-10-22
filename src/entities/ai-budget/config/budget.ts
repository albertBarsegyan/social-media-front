import type { AiBudget } from "@/shared/api"

export const jobLabels: Record<AiBudget["breakdown"][number]["job"], string> = {
  scoring: "Intent scoring",
  drafting: "Reply drafts",
  repurposing: "Repurposing",
}
