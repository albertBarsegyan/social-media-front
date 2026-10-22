import type { Role } from "@/shared/api"

export const roleLabels: Record<Role, string> = { operator: "Operator", approver: "Approver", editor: "Editor" }

export const roleScopes: Record<Role, string> = {
  operator: "Edits, approves, settings and billing",
  approver: "Approves replies and posts for this workspace",
  editor: "Drafts and edits; can’t approve or publish",
}
