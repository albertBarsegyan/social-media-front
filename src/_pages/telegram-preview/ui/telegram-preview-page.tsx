import type { Metadata } from "next"

import { TelegramPreview } from "./telegram-preview"

export const metadata: Metadata = { title: "Telegram bot" }

export function TelegramPreviewPage() {
  return <TelegramPreview />
}
