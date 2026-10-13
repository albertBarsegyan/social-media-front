/** Places we listen for buying intent; replies there are drafted for approval. */
export type ListeningChannel = "reddit" | "fbgroup" | "tggroup" | "x"

/** Places we publish content to through Buffer. */
export type PublishChannel = "instagram" | "facebook" | "telegram"

export type ChannelKey = ListeningChannel | PublishChannel

export interface ChannelInfo {
  label: string
  short: string
  /** Replies must be copied and posted by hand from the owner's account. */
  manual?: boolean
  /** How an approved reply reaches the thread. */
  how?: string
}
