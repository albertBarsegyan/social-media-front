export const settingsSections = [
  "brand",
  "keywords",
  "channels",
  "team",
  "usage",
  "billing",
] as const

export type SettingsSection = (typeof settingsSections)[number]

export const routes = {
  dashboard: "/dashboard",
  leads: "/leads",
  lead: (id: string) => `/leads/${id}`,
  approvals: "/approvals",
  studio: "/studio",
  calendar: "/calendar",
  analytics: "/analytics",
  settings: (section: SettingsSection = "brand") => `/settings/${section}`,
  clients: "/clients",
  onboarding: "/onboarding",
  telegramPreview: "/telegram-preview",
  login: "/login",
  register: "/register",
  onboardingFor: (workspaceId: string) => `/onboarding?workspace=${workspaceId}`,
} as const

/** Routes reachable without a session. */
export const publicRoutes = ["/login", "/register"] as const
