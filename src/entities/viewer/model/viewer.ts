export type ViewerRole = "operator" | "owner"

export interface Viewer {
  name: string
  firstName: string
  initials: string
  role: ViewerRole
  roleLabel: string
}

/** Signed-in user. Mocked as the agency operator until auth exists. */
export const currentViewer: Viewer = {
  name: "Albert Hakobyan",
  firstName: "Albert",
  initials: "AH",
  role: "operator",
  roleLabel: "Operator · Neo Labs",
}

export function useViewer() {
  return currentViewer
}
