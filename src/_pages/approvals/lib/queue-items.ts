import { channelInfo } from "@/entities/channel"
import { leadActions, type Lead } from "@/entities/lead"
import { postActions, week, type ScheduledPost } from "@/entities/post"
import { routes, type Locale } from "@/shared/config"

export interface QueueItem {
  key: string
  kind: "Reply" | "Post"
  channelLabel: string
  channelShort: string
  lang: Locale
  text: string
  context: string
  href: string
  /** Each action returns the confirmation to show, so bulk actions can summarise instead. */
  approve: () => string
  skip: () => string
  restore: () => string
}

export function replyItem(lead: Lead): QueueItem {
  const channel = channelInfo[lead.source]
  return {
    key: `r-${lead.id}`,
    kind: "Reply",
    channelLabel: channel.label,
    channelShort: channel.short,
    lang: lead.lang,
    text: lead.draft,
    context: lead.status === "skipped" ? `Skipped · ${lead.skipReason ?? ""}` : `Intent ${lead.score} · ${lead.where}`,
    href: routes.lead(lead.id),
    approve: () =>
      leadActions.approve(lead.id) === "posted"
        ? "Approved and posted to X via Blotato"
        : `Approved — now copy it and post on ${channel.label}`,
    skip: () => {
      leadActions.skip(lead.id, "Skipped from queue")
      return "Draft skipped"
    },
    restore: () => {
      leadActions.restore(lead.id)
      return "Moved back to review"
    },
  }
}

export function postItem(post: ScheduledPost): QueueItem {
  const channel = channelInfo[post.channel]
  return {
    key: `p-${post.id}`,
    kind: "Post",
    channelLabel: channel.label,
    channelShort: channel.short,
    lang: post.lang,
    text: post.text,
    context: post.status === "skipped" ? "Skipped" : `${week.days[post.day]} ${week.dates[post.day]} ${week.month} · ${post.time}`,
    href: routes.calendar,
    approve: () => {
      postActions.approve(post.id)
      return "Post approved and scheduled"
    },
    skip: () => {
      postActions.skip(post.id)
      return "Post skipped"
    },
    restore: () => {
      postActions.restore(post.id)
      return "Moved back to approvals"
    },
  }
}
