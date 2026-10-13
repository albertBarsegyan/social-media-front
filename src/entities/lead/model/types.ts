import type { ListeningChannel } from "@/entities/channel/@x/lead"
import type { Locale } from "@/shared/config"

export type LeadStatus = "pending" | "nodraft" | "approved" | "posted" | "skipped"

/** A public post with buying intent, plus the reply drafted for it. */
export interface Lead {
  id: string
  score: number
  source: ListeningChannel
  where: string
  author: string
  time: string
  lang: Locale
  title?: string
  text: string
  /** Why the AI scored it: [reason, points]. */
  reasons: [string, number][]
  draft: string
  link: string
  status: LeadStatus
  skipReason?: string
  edited?: boolean
}

export type LeadTab = "review" | "done" | "skipped"
