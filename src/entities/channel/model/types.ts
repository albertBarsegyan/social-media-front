export type { ChannelKey, ListeningChannel, PublishChannel } from "@/shared/api"

export interface ChannelInfo {
  label: string
  short: string
  /** Replies must be copied and posted by hand from the owner's account. */
  manual?: boolean
  /** How an approved reply reaches the thread. */
  how?: string
}
