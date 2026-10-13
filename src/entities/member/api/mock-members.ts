import type { Member } from "../model/types"

export const mockMembers: Member[] = [
  { name: "Albert Hakobyan", initials: "AH", email: "albert@neolabs.am", role: "Operator", scope: "All workspaces · edits, approves, billing", via: "Web + Telegram" },
  { name: "Ani Sargsyan", initials: "AS", email: "ani@neolabs.am", role: "Editor", scope: "Drafts and edits; can’t publish", via: "Web" },
  { name: "Mila Petrosyan", initials: "MP", email: "mila@mila.am", role: "Approver", scope: "Approves replies and posts for this workspace", via: "Telegram" },
]
