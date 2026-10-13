import type { PublishChannel } from "@/entities/channel/@x/post"
import type { Locale } from "@/shared/config"

export type PostStatus = "published" | "scheduled" | "pending" | "skipped"

/** A post on the content calendar. `day` indexes into the visible week. */
export interface ScheduledPost {
  id: string
  channel: PublishChannel
  lang: Locale
  day: number
  time: string
  status: PostStatus
  text: string
}
