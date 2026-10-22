import type { Integration, IntegrationProvider } from "@/shared/api"

export const integrationNames: Record<IntegrationProvider, string> = {
  buffer: "Buffer",
  telegram_bot: "Telegram bot",
  blotato: "Blotato",
  apify: "Apify",
}

export const purposeLabels: Record<Integration["purpose"], string> = {
  publishing: "Publishing",
  approvals: "Approvals & alerts",
  x_replies: "X replies",
  listening: "Listening",
}

export const integrationDescriptions: Record<IntegrationProvider, string> = {
  buffer: "Instagram, Facebook, Telegram channel, LinkedIn",
  telegram_bot: "Lead cards, approvals, weekly report, alerts",
  blotato: "Posts approved replies on X",
  apify: "Reddit, Facebook groups, Telegram groups, X search",
}

export const errorLabels: Record<string, string> = {
  token_expired: "Token expired",
}
