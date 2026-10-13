import type { KeywordSet, ListeningSource } from "../model/types"

export const mockKeywordSets: KeywordSet[] = [
  { name: "Hair & color", on: true, terms: [["en", "recommend a hair salon"], ["en", "balayage yerevan"], ["ru", "посоветуйте парикмахера"], ["ru", "кератин ереван"], ["hy", "լավ վարսահարդար"], ["hy", "մազերի ներկում"]] },
  { name: "Nails", on: true, terms: [["en", "nail salon yerevan"], ["ru", "мастер маникюра"], ["ru", "аппаратный маникюр"], ["hy", "մանիկյուրի սրահ"]] },
  { name: "Bridal", on: true, terms: [["en", "bridal hair yerevan"], ["en", "wedding makeup armenia"], ["ru", "свадебная причёска"], ["hy", "հարսանեկան սանրվածք"]] },
]

export const mockNegativeKeywords = ["оптом", "wholesale", "vacancy", "вакансия", "աշխատանք"]

export const mockSources: ListeningSource[] = [
  { type: "Reddit", name: "r/armenia", on: true },
  { type: "Reddit", name: "r/yerevan", on: true },
  { type: "Facebook group", name: "Yerevan Expats & Locals", on: true },
  { type: "Facebook group", name: "Երևանի մայրիկներ", on: true },
  { type: "Telegram group", name: "Ереван | Красота и уход", on: true },
  { type: "Telegram group", name: "Yerevan Relocants", on: true },
  { type: "X search", name: "Keyword search, Armenia geo", on: true },
]
