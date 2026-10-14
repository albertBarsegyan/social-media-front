import type { ChannelInfo, ChannelKey, PublishChannel } from "../model/types"

/** Display copy per channel. Whether a reply is manual comes from the API (`Catalog.channels`). */
export const channelInfo: Record<ChannelKey, ChannelInfo> = {
  reddit: {
    label: "Reddit",
    short: "R",
    manual: true,
    how: "Reddit doesn’t allow automated replies. Copy the approved reply and post it from your own account.",
  },
  fb_group: {
    label: "Facebook group",
    short: "f",
    manual: true,
    how: "Facebook groups can’t be posted to by API. Copy the approved reply and post it by hand.",
  },
  tg_group: {
    label: "Telegram group",
    short: "TG",
    manual: true,
    how: "Group replies go from your own Telegram account. Copy and paste it into the thread.",
  },
  x: { label: "X", short: "X", manual: false, how: "Posted via Blotato the moment you approve." },
  instagram: { label: "Instagram", short: "IG" },
  facebook: { label: "Facebook", short: "f" },
  telegram: { label: "Telegram channel", short: "TG" },
}

export const publishChannels: PublishChannel[] = ["instagram", "facebook", "telegram"]
