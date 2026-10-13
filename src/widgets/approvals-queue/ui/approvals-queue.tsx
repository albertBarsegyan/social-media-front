"use client"

import { CheckCheckIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { ChannelMark } from "@/entities/channel"
import { useLeads } from "@/entities/lead"
import { usePosts } from "@/entities/post"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { EmptyState } from "@/shared/ui/empty-state"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { postItem, replyItem, type QueueItem } from "../lib/queue-items"

type QueueTab = "all" | "replies" | "posts" | "skipped"

function ItemMeta({ item }: { item: QueueItem }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <Badge variant={item.kind === "Reply" ? "secondary" : "outline"}>{item.kind}</Badge>
      <ChannelMark short={item.channelShort} />
      <span className="font-medium text-foreground">{item.channelLabel}</span>
      <span>
        · <span className="uppercase">{item.lang}</span> · {item.context}
      </span>
    </div>
  )
}

/** Every reply and post that needs a decision, with bulk approve and skip. */
export function ApprovalsQueue() {
  const t = useMessages(commonMessages)
  const leads = useLeads()
  const posts = usePosts()
  const [tab, setTab] = useState<QueueTab>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const replies = leads.filter((lead) => lead.status === "pending").map(replyItem)
  const pendingPosts = posts.filter((post) => post.status === "pending").map(postItem)
  const skipped = [
    ...leads.filter((lead) => lead.status === "skipped" && lead.draft).map(replyItem),
    ...posts.filter((post) => post.status === "skipped").map(postItem),
  ]
  const items = tab === "replies" ? replies : tab === "posts" ? pendingPosts : tab === "all" ? [...replies, ...pendingPosts] : []
  const selectedItems = items.filter((item) => selected.has(item.key))
  const allChecked = items.length > 0 && selectedItems.length === items.length

  const bulk = (action: "approve" | "skip") => {
    selectedItems.forEach((item) => item[action]())
    toast(`${action === "approve" ? "Approved" : "Skipped"} ${selectedItems.length} drafts`)
    setSelected(new Set())
  }

  const toggle = (key: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          value={tab}
          onValueChange={(value) => {
            setTab(value as QueueTab)
            setSelected(new Set())
          }}
        >
          <TabsList>
            <TabsTrigger value="all">All {replies.length + pendingPosts.length}</TabsTrigger>
            <TabsTrigger value="replies">Replies {replies.length}</TabsTrigger>
            <TabsTrigger value="posts">Posts {pendingPosts.length}</TabsTrigger>
            <TabsTrigger value="skipped">Skipped {skipped.length}</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          Approving a reply readies it for posting; approving a post schedules it.
        </p>
      </div>

      {selectedItems.length > 0 ? (
        <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 rounded-lg bg-primary p-2 pl-4 text-sm text-primary-foreground">
          <span className="flex-1">{selectedItems.length} selected</span>
          <Button size="sm" variant="secondary" onClick={() => bulk("approve")}>
            {t.approve} {selectedItems.length}
          </Button>
          <Button size="sm" variant="secondary" onClick={() => bulk("skip")}>
            {t.skip} {selectedItems.length}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      {tab === "skipped" ? (
        skipped.length === 0 ? (
          <EmptyState title="Nothing skipped." />
        ) : (
          <ul className="divide-y rounded-xl border bg-card">
            {skipped.map((item) => (
              <li key={item.key} className="flex flex-wrap items-start gap-3 p-4">
                <div className="min-w-0 flex-1 space-y-1.5">
                  <ItemMeta item={item} />
                  <p className="line-clamp-2 text-sm text-muted-foreground">{item.text}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toast(item.restore())}>
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        )
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CheckCheckIcon />}
          title="All caught up"
          description="New reply drafts and posts appear here and in Telegram. You’ll get a ping when something needs you."
        />
      ) : (
        <div className="rounded-xl border bg-card">
          <label className="flex items-center gap-3 border-b px-4 py-2.5 text-sm text-muted-foreground">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(checked) => setSelected(checked ? new Set(items.map((item) => item.key)) : new Set())}
            />
            Select all
          </label>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.key} className="flex flex-wrap items-start gap-3 p-4 sm:flex-nowrap">
                <Checkbox
                  className="mt-1"
                  aria-label={`Select ${item.kind.toLowerCase()}`}
                  checked={selected.has(item.key)}
                  onCheckedChange={(checked) => toggle(item.key, checked === true)}
                />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <ItemMeta item={item} />
                  <p className="line-clamp-3 text-sm">{item.text}</p>
                </div>
                <div className="flex w-full gap-2 pl-7 sm:w-auto sm:pl-0">
                  <Button size="sm" onClick={() => toast(item.approve())}>
                    {t.approve}
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={item.href}>{t.edit}</Link>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => toast(item.skip())}>
                    {t.skip}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
