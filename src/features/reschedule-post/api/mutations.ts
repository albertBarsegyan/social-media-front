import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query"

import type { Post } from "@/entities/post"
import { invalidateWorkspace, postsApi } from "@/shared/api"

/** Moves a post on the calendar immediately; rolls back if the API refuses. */
export function useReschedulePost(wid: string, rangeKey: QueryKey) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, scheduledAt }: { id: string; scheduledAt: string }) => postsApi.reschedule(wid, id, scheduledAt),
    onMutate: async ({ id, scheduledAt }) => {
      await client.cancelQueries({ queryKey: rangeKey })
      const previous = client.getQueryData<Post[]>(rangeKey)
      client.setQueryData<Post[]>(rangeKey, (posts) => posts?.map((post) => (post.id === id ? { ...post, scheduledAt } : post)))
      return { previous }
    },
    onError: (_error, _vars, snapshot) => client.setQueryData(rangeKey, snapshot?.previous),
    onSettled: () => invalidateWorkspace(client, wid, ["posts"]),
  })
}

