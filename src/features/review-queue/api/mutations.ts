import { useMutation, useQueryClient, type InfiniteData, type QueryKey } from "@tanstack/react-query"

import { approvalKeys } from "@/entities/approval"
import {
  approvalsApi,
  buyingIntentsApi,
  invalidateWorkspace,
  postsApi,
  type ApprovalItem,
  type ApprovalKind,
  type ApprovalState,
  type BuyingIntent,
  type Page,
  type Post,
  type WorkspaceArea,
} from "@/shared/api"

type QueueAction = "approve" | "skip" | "restore"
type ItemRef = { kind: ApprovalKind; id: string }
type QueueData = InfiniteData<Page<ApprovalItem>, string | undefined>

/** Reason recorded when a reply is skipped from the queue rather than from its detail page. */
const QUEUE_SKIP_REASON = "skipped_from_queue"
const AREAS: WorkspaceArea[] = ["approvals", "buying-intents", "posts", "reports"]

function run(wid: string, action: QueueAction, { kind, id }: ItemRef): Promise<BuyingIntent | Post> {
  if (kind === "reply") {
    if (action === "approve") return buyingIntentsApi.approve(wid, id)
    if (action === "skip") return buyingIntentsApi.skip(wid, id, QUEUE_SKIP_REASON)
    return buyingIntentsApi.restore(wid, id)
  }
  if (action === "approve") return postsApi.approve(wid, id)
  if (action === "skip") return postsApi.skip(wid, id)
  return postsApi.restore(wid, id)
}

/** The queue an action removes the item from: restoring leaves "skipped", everything else leaves "pending". */
const sourceState = (action: QueueAction): ApprovalState => (action === "restore" ? "skipped" : "pending")

/**
 * Approve / skip / restore from the approvals queue. Items leave the visible list immediately and come
 * back if the request fails.
 */
export function useQueueActions(wid: string) {
  const client = useQueryClient()

  const removeOptimistically = async (state: ApprovalState, refs: ItemRef[]) => {
    const queryKey: QueryKey = approvalKeys.queue(wid, state)
    await client.cancelQueries({ queryKey })
    const previous = client.getQueryData<QueueData>(queryKey)
    const ids = new Set(refs.map((ref) => `${ref.kind}:${ref.id}`))
    client.setQueryData<QueueData>(queryKey, (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({ ...page, items: page.items.filter((item) => !ids.has(`${item.kind}:${item.id}`)) })),
      },
    )
    return { queryKey, previous }
  }

  const single = useMutation({
    mutationFn: ({ action, item }: { action: QueueAction; item: ItemRef }) => run(wid, action, item),
    onMutate: ({ action, item }) => removeOptimistically(sourceState(action), [item]),
    onError: (_error, _vars, snapshot) => snapshot && client.setQueryData(snapshot.queryKey, snapshot.previous),
    onSettled: () => invalidateWorkspace(client, wid, AREAS),
  })

  const bulk = useMutation({
    mutationFn: ({ action, items }: { action: "approve" | "skip"; items: ItemRef[] }) => approvalsApi.bulk(wid, action, items),
    onMutate: ({ items }) => removeOptimistically("pending", items),
    onError: (_error, _vars, snapshot) => snapshot && client.setQueryData(snapshot.queryKey, snapshot.previous),
    onSettled: () => invalidateWorkspace(client, wid, AREAS),
  })

  return { single, bulk }
}
