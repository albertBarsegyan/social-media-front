import type { Locale } from "@/shared/config"
import { createStore, useStore } from "@/shared/lib/store"

/** What the AI reads before writing any reply or post. */
export interface BrandProfile {
  offer: string
  audience: string
  tones: string[]
  languages: Locale[]
  bannedPhrases: string[]
}

const brandStore = createStore<BrandProfile>({
  offer: "Hair color, balayage, keratin, bridal hair & makeup, hardware manicure. Pushkin St 12, Yerevan. Open daily 10:00–21:00.",
  audience: "Women 22–45 in Yerevan, including expats and relocants. Brides planning 3–9 months ahead.",
  tones: ["Warm", "Plain-spoken"],
  languages: ["hy", "ru", "en"],
  bannedPhrases: ["best in Yerevan", "cheap", "100% guaranteed", "DM me"],
})

export function useBrandProfile() {
  return useStore(brandStore, (state) => state)
}

export const brandProfileActions = {
  update: (patch: Partial<BrandProfile>) => brandStore.setState(patch),
}
