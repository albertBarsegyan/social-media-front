"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { channelInfo, type PublishChannel } from "@/entities/channel"
import { PostCard, postCardLabels, usePosts, week, type PostCardState, type ScheduledPost } from "@/entities/post"
import { useChannelDisconnected } from "@/features/connect-integration"
import { useReschedule } from "@/features/reschedule-post"
import { routes } from "@/shared/config"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

type ChannelFilter = "all" | PublishChannel

const legend = [
  { label: "Published", swatch: "bg-muted" },
  { label: "Scheduled", swatch: "border bg-background" },
  { label: "Needs approval — won’t publish", swatch: "border border-dashed border-ring bg-background" },
]

/** One week of scheduled posts; drag a card to another day to reschedule. */
export function ContentCalendar() {
  const posts = usePosts()
  const disconnected = useChannelDisconnected()
  const { dragProps, dropProps, overDay } = useReschedule()
  const [filter, setFilter] = useState<ChannelFilter>("all")

  const visible = posts.filter((post) => post.status !== "skipped" && (filter === "all" || post.channel === filter))
  // Skipped posts are filtered out above, so the remaining statuses map onto card states.
  const stateOf = (post: ScheduledPost): PostCardState =>
    post.status === "scheduled" && disconnected && post.channel === "instagram" ? "paused" : (post.status as PostCardState)
  const days = week.days.map((day, index) => ({
    index,
    day,
    date: week.dates[index],
    today: index === week.todayIndex,
    items: visible.filter((post) => post.day === index).sort((a, b) => a.time.localeCompare(b.time)),
  }))
  const weekNav = () => toast("Prototype shows one week")

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon-sm" onClick={weekNav} aria-label="Previous week">
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" onClick={weekNav} aria-label="Next week">
          <ChevronRightIcon />
        </Button>
        <span className="text-sm font-medium">{week.label}</span>
        <div className="flex-1" />
        <Tabs value={filter} onValueChange={(value) => setFilter(value as ChannelFilter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="telegram">Telegram</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {legend.map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5">
            <span aria-hidden className={cn("size-2.5 rounded-sm", item.swatch)} />
            {item.label}
          </span>
        ))}
        <span className="hidden lg:inline">Drag a post to another day to reschedule</span>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="Nothing scheduled this week"
          description="Upload a case study or a few photos and the studio will draft a week of posts."
          actions={
            <Button size="sm" asChild>
              <Link href={routes.studio}>Open content studio</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="hidden grid-cols-7 overflow-hidden rounded-xl border lg:grid">
            {days.map((day) => (
              <div
                key={day.index}
                {...dropProps(day.index)}
                className={cn("min-h-80 border-r p-2 last:border-r-0", overDay === day.index && "bg-muted")}
              >
                <div className="mb-2 flex items-center gap-1.5 text-xs">
                  <span className="text-muted-foreground">{day.day}</span>
                  <span
                    className={cn(
                      "grid size-6 place-items-center rounded-full font-medium",
                      day.today && "bg-primary text-primary-foreground",
                    )}
                  >
                    {day.date}
                  </span>
                </div>
                <div className="space-y-2">
                  {day.items.map((post) => {
                    const { className: dragClass, ...drag } = dragProps(post)
                    return <PostCard key={post.id} post={post} state={stateOf(post)} className={dragClass} {...drag} />
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4 lg:hidden">
            {days
              .filter((day) => day.items.length > 0)
              .map((day) => (
                <section key={day.index}>
                  <h3 className="mb-2 text-xs font-medium text-muted-foreground">
                    {day.day} {day.date} {week.month}
                    {day.today ? " · Today" : ""}
                  </h3>
                  <ul className="divide-y rounded-xl border bg-card">
                    {day.items.map((post) => (
                      <li key={post.id} className="flex gap-3 p-3">
                        <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">{post.time}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm">{post.text}</p>
                          <p className="text-xs text-muted-foreground">
                            {channelInfo[post.channel].label} · <span className="uppercase">{post.lang}</span> ·{" "}
                            {postCardLabels[stateOf(post)]}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
          </div>
        </>
      )}
    </div>
  )
}
