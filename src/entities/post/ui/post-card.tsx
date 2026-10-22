import type { ComponentProps } from "react"

import { ChannelMark, channelInfo } from "@/entities/channel/@x/post"
import type { Post } from "@/shared/api"
import { formatTime } from "@/shared/lib/format"
import { cn } from "@/shared/lib/utils"

export type PostCardState = "published" | "scheduled" | "pending" | "paused"

export const postCardLabels: Record<PostCardState, string> = {
  published: "Published",
  scheduled: "Scheduled",
  pending: "Needs approval",
  paused: "Paused · disconnected",
}

const stateClasses: Record<PostCardState, string> = {
  published: "border-transparent bg-muted",
  scheduled: "bg-background",
  pending: "border-dashed border-ring bg-background",
  paused: "border-warning-border bg-warning-muted",
}

interface PostCardProps extends ComponentProps<"div"> {
  post: Post
  state: PostCardState
}

export function PostCard({ post, state, className, ...props }: PostCardProps) {
  return (
    <div className={cn("rounded-lg border p-2 text-xs", stateClasses[state], className)} {...props}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <ChannelMark short={channelInfo[post.channel].short} />
        <span className="font-mono">{formatTime(post.scheduledAt)}</span>
        <span className="ml-auto font-mono uppercase">{post.lang}</span>
      </div>
      <p className="mt-1.5 line-clamp-3 text-foreground">{post.text}</p>
      <div className="mt-1.5 text-muted-foreground">{postCardLabels[state]}</div>
    </div>
  )
}
