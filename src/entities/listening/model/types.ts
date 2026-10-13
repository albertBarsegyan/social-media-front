import type { Locale } from "@/shared/config"

/** Phrases buyers use when asking for a recommendation, grouped by service. */
export interface KeywordSet {
  name: string
  on: boolean
  terms: [Locale, string][]
}

export interface ListeningSource {
  type: string
  name: string
  on: boolean
}
