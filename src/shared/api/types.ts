import type { Locale } from "@/shared/config"

/** Shared enums and value types. Mirrors api-contract.md §2. */

export type ListeningChannel = "reddit" | "fb_group" | "tg_group" | "x"
export type PublishChannel = "instagram" | "facebook" | "telegram"
export type ChannelKey = ListeningChannel | PublishChannel
export type Role = "operator" | "approver" | "editor"
export type Bundle = "content" | "leads" | "leads_bookings" | "internal"
export type IntentTier = "hot" | "warm" | "cold"
export type Currency = "USD" | "AMD"

export interface Money {
  /** Integer minor units (cents). */
  amountMinor: number
  currency: Currency
}

/** Cursor page: `nextCursor` is null on the last page. */
export interface Page<T> {
  items: T[]
  nextCursor: string | null
}

export interface PageParams {
  cursor?: string
  limit?: number
}

export interface TrackedLink {
  id: string
  slug: string
  url: string
  clicks: number
  createdAt: string
}

export type { Locale }
