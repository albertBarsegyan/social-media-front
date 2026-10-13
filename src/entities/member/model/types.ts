export interface Member {
  name: string
  initials: string
  email: string
  role: "Operator" | "Editor" | "Approver"
  scope: string
  via: string
}
