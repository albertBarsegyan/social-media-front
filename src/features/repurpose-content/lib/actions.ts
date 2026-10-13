import { approvedVariants, campaignActions } from "@/entities/campaign"
import { postActions, week } from "@/entities/post"
import { toast } from "@/shared/lib/toast"

const slotTimes = { instagram: "10:30", facebook: "14:00", telegram: "19:30" } as const

/** Put every approved variant on the calendar from Thursday onward. */
export function scheduleApprovedVariants() {
  const approved = approvedVariants(campaignActions.getState())
  const langIndex = { hy: 0, ru: 1, en: 2 } as const
  postActions.add(
    approved.map(({ channel, lang, variant }) => ({
      id: `n-${channel}-${lang}`,
      channel,
      lang,
      day: Math.min(week.days.length - 1, 3 + langIndex[lang]),
      time: slotTimes[channel],
      status: "scheduled" as const,
      text: variant.text.split("\n")[0].slice(0, 60),
    })),
  )
  toast(`${approved.length} posts scheduled · see Calendar`)
}
