import type { ScheduledPost } from "../model/types"

export const mockPosts: ScheduledPost[] = [
  { id: "p1", channel: "instagram", lang: "hy", day: 0, time: "10:00", status: "published", text: "Before/after: soft balayage on dark hair" },
  { id: "p2", channel: "telegram", lang: "ru", day: 0, time: "19:00", status: "published", text: "Окна на эту неделю: 4 свободных слота" },
  { id: "p3", channel: "facebook", lang: "hy", day: 1, time: "12:30", status: "published", text: "Կերատին․ ինչ իմանալ նախքան" },
  { id: "p4", channel: "instagram", lang: "ru", day: 2, time: "11:00", status: "scheduled", text: "Свадебный пучок, который держится 12 часов" },
  { id: "p5", channel: "telegram", lang: "hy", day: 2, time: "18:00", status: "scheduled", text: "Նոր աշխատանք՝ Անահիտի հարսանիքը" },
  { id: "p6", channel: "facebook", lang: "ru", day: 3, time: "13:00", status: "pending", text: "Что нужно свадебному образу, чтобы пережить 12 часов на улице?" },
  { id: "p7", channel: "instagram", lang: "en", day: 4, time: "10:00", status: "pending", text: "12 hours outdoors in Dilijan, and the low bun didn’t move." },
  { id: "p8", channel: "telegram", lang: "en", day: 5, time: "11:00", status: "scheduled", text: "New in the portfolio: Anahit’s outdoor wedding" },
  { id: "p9", channel: "instagram", lang: "hy", day: 6, time: "12:00", status: "scheduled", text: "Շաբաթ-կիրակի ազատ ժամեր՝ մանիկյուր" },
]
