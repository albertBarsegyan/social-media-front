import { channelInfo } from "@/entities/channel"
import { leadActions, type Lead } from "@/entities/lead"
import { toast } from "@/shared/lib/toast"

export function approveReply(lead: Lead) {
  const status = leadActions.approve(lead.id)
  if (status === "posted") toast("Approved and posted to X via Blotato")
  else toast(`Approved — now copy it and post on ${channelInfo[lead.source].label}`)
}

export function skipReply(lead: Lead, reason: string) {
  leadActions.skip(lead.id, reason)
  toast(`Draft skipped · ${reason}`)
}

export function restoreReply(lead: Lead) {
  leadActions.restore(lead.id)
  toast("Moved back to review")
}

export async function copyReplyAndOpen(lead: Lead) {
  try {
    await navigator.clipboard.writeText(lead.draft)
    toast(`Reply copied · opening ${lead.where}`)
  } catch {
    toast.error("Couldn’t copy — select the reply and copy it manually")
  }
}
