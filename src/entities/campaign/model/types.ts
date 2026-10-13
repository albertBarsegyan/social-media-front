import type { PublishChannel } from "@/entities/channel/@x/campaign"
import type { Locale } from "@/shared/config"

export type VariantStatus = "draft" | "approved"

export interface Variant {
  text: string
  status: VariantStatus
}

/** A source (case study, photos, video) repurposed into a post per channel and language. */
export interface Campaign {
  id: string
  title: string
  summary: string
  media: string[]
  video: { name: string; duration: string }
  variants: Record<PublishChannel, Record<Locale, Variant>>
}
