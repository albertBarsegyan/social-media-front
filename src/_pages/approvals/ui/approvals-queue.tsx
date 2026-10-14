"use client"

import { CheckCheckIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { useApprovalQueue, useApprovalSummary, type ApprovalItem, type ApprovalKind } from "@/entities/approval"
import { skipReasonLabel } from "@/entities/buying-intent"
import { channelInfo, ChannelMark } from "@/entities/channel"
import { useCurrentWorkspace } from "@/entities/workspace"
import { useQueueActions } from "@/features/review-queue"
import { routes } from "@/shared/config"
import { formatDate, formatTime } from "@/shared/lib/format"
import { commonMessages, useMessages } from "@/shared/lib/i18n"
import { toast } from "@/shared/lib/toast"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

type QueueTab = "all" | "replies" | "posts" | "skipped"

const keyOf = (item: { kind: ApprovalKind; id: string }) => `${item.kind}:${item.id}`

function describe(item: ApprovalItem) {
  if (item.kind === "reply") {
    const intent = item.buyingIntent
    return {
      channel: intent.channel,
      lang: intent.lang,
      text: intent.draft ?? "",
      context:
        intent.status === "skipped"
          ? `Skipped · ${skipReasonLabel(intent.skipReason)}`
          : `Intent ${intent.score} · ${intent.sourceName}`,
      href: routes.lead(intent.id),
    }
  }
  const post = item.post
  return {
    channel: post.channel,
    lang: post.lang,
    text: post.text,
    context: post.status === "skipped" ? "Skipped" : `${formatDate(post.scheduledAt)} · ${formatTime(post.scheduledAt)}`,
    href: routes.calendar,
  }
}

function ItemMeta({ item }: { item: ApprovalItem }) {
  const info = describe(item)
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <Badge variant={item.kind === "reply" ? "secondary" : "outline"}>{item.kind === "reply" ? "Reply" : "Post"}</Badge>
      <ChannelMark short={channelInfo[info.channel].short} />
      <span className="font-medium text-foreground">{channelInfo[info.channel].label}</span>
      <span>
        · <span className="uppercase">{info.lang}</span> · {info.context}
      </span>
    </div>
  )
}

function LoadMore({ query }: { query: { hasNextPage: boolean; isFetchingNextPage: boolean; fetchNextPage: () => unknown } }) {
  if (!query.hasNextPage) return null
  return (
    <Button variant="outline" size="sm" className="w-full" disabled={query.isFetchingNextPage} onClick={() => void query.fetchNextPage()}>
      {query.isFetchingNextPage ? "Loading…" : "Load more"}
    </Button>
  )
}

/** Every reply and post that needs a decision, with bulk approve and skip. */
export function ApprovalsQueue() {
  const t = useMessages(commonMessages)
  const { workspaceId, role } = useCurrentWorkspace()
  const canDecide = role !== "editor"
  const [tab, setTab] = useState<QueueTab>("all")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const summary = useApprovalSummary(workspaceId).data
  const pending = useApprovalQueue(workspaceId, "pending")
  const skipped = useApprovalQueue(workspaceId, "skipped")
  const { single, bulk } = useQueueActions(workspaceId)

  const active = tab === "skipped" ? skipped : pending
  const loaded = active.data?.pages.flatMap((page) => page.items) ?? []
  const items =
    tab === "replies" ? loaded.filter((i) => i.kind === "reply") : tab === "posts" ? loaded.filter((i) => i.kind === "post") : loaded
  const selectedItems = items.filter((item) => selected.has(keyOf(item)))
  const allChecked = items.length > 0 && selectedItems.length === items.length

  const act = (action: "approve" | "skip" | "restore", item: ApprovalItem) =>
    single.mutate(
      { action, item: { kind: item.kind, id: item.id } },
      {
        onSuccess: () =>
          toast(
            action === "restore"
              ? "Moved back to approvals"
              : action === "skip"
                ? "Skipped"
                : item.kind === "post"
                  ? "Post approved and scheduled"
                  : "Reply approved",
          ),
      },
    )

  const runBulk = (action: "approve" | "skip") => {
    const refs = selectedItems.map(({ kind, id }) => ({ kind, id }))
    setSelected(new Set())
    bulk.mutate(
      { action, items: refs },
      {
        onSuccess: (result) =>
          toast(
            `${action === "approve" ? "Approved" : "Skipped"} ${result.updated.length}` +
              (result.failed.length ? ` · ${result.failed.length} already changed` : ""),
          ),
      },
    )
  }

  const toggle = (key: string, checked: boolean) =>
    setSelected((current) => {
      const next = new Set(current)
      if (checked) next.add(key)
      else next.delete(key)
      return next
    })

  const counts = summary
    ? { all: summary.pendingReplies + summary.pendingPosts, replies: summary.pendingReplies, posts: summary.pendingPosts }
    : null

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
            <TabsTrigger value="all">All{counts ? ` ${counts.all}` : ""}</TabsTrigger>
            <TabsTrigger value="replies">Replies{counts ? ` ${counts.replies}` : ""}</TabsTrigger>
            <TabsTrigger value="posts">Posts{counts ? ` ${counts.posts}` : ""}</TabsTrigger>
            <TabsTrigger value="skipped">Skipped</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-sm text-muted-foreground">
          {canDecide
            ? "Approving a reply readies it for posting; approving a post schedules it."
            : "Editors can open and edit drafts; approvers decide."}
        </p>
      </div>

      {canDecide && selectedItems.length > 0 ? (
        <div className="sticky top-16 z-10 flex flex-wrap items-center gap-2 rounded-lg bg-primary p-2 pl-4 text-sm text-primary-foreground">
          <span className="flex-1">{selectedItems.length} selected</span>
          <Button size="sm" variant="secondary" disabled={bulk.isPending} onClick={() => runBulk("approve")}>
            {t.approve} {selectedItems.length}
          </Button>
          <Button size="sm" variant="secondary" disabled={bulk.isPending} onClick={() => runBulk("skip")}>
            {t.skip} {selectedItems.length}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </div>
      ) : null}

      {active.isPending ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : active.isError ? (
        <ErrorState error={active.error} onRetry={() => void active.refetch()} />
      ) : tab === "skipped" ? (
        items.length === 0 ? (
          <EmptyState title="Nothing skipped." />
        ) : (
          <>
            <ul className="divide-y rounded-xl border bg-card">
              {items.map((item) => (
                <li key={keyOf(item)} className="flex flex-wrap items-start gap-3 p-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <ItemMeta item={item} />
                    <p className="line-clamp-2 text-sm text-muted-foreground">{describe(item).text}</p>
                  </div>
                  {canDecide ? (
                    <Button size="sm" variant="outline" onClick={() => act("restore", item)}>
                      Restore
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
            <LoadMore query={active} />
          </>
        )
      ) : items.length === 0 ? (
        <EmptyState
          icon={<CheckCheckIcon />}
          title="All caught up"
          description="New reply drafts and posts appear here and in Telegram. You’ll get a ping when something needs you."
        />
      ) : (
        <>
          <div className="rounded-xl border bg-card">
            {canDecide ? (
              <label className="flex items-center gap-3 border-b px-4 py-2.5 text-sm text-muted-foreground">
                <Checkbox
                  checked={allChecked}
                  onCheckedChange={(checked) => setSelected(checked ? new Set(items.map(keyOf)) : new Set())}
                />
                Select all loaded
              </label>
            ) : null}
            <ul className="divide-y">
              {items.map((item) => (
                <li key={keyOf(item)} className="flex flex-wrap items-start gap-3 p-4 sm:flex-nowrap">
                  {canDecide ? (
                    <Checkbox
                      className="mt-1"
                      aria-label={`Select ${item.kind}`}
                      checked={selected.has(keyOf(item))}
                      onCheckedChange={(checked) => toggle(keyOf(item), checked === true)}
                    />
                  ) : null}
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <ItemMeta item={item} />
                    <p className="line-clamp-3 text-sm">{describe(item).text}</p>
                  </div>
                  <div className="flex w-full gap-2 pl-7 sm:w-auto sm:pl-0">
                    {canDecide ? (
                      <Button size="sm" onClick={() => act("approve", item)}>
                        {t.approve}
                      </Button>
                    ) : null}
                    <Button size="sm" variant="outline" asChild>
                      <Link href={describe(item).href}>{t.edit}</Link>
                    </Button>
                    {canDecide ? (
                      <Button size="sm" variant="ghost" onClick={() => act("skip", item)}>
                        {t.skip}
                      </Button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <LoadMore query={active} />
        </>
      )}
    </div>
  )
}
