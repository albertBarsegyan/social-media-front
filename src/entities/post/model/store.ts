import { createStore, useStore } from "@/shared/lib/store"

import { mockPosts } from "../api/mock-posts"
import type { ScheduledPost } from "./types"

const postStore = createStore({ posts: mockPosts })

function patchPost(id: string, patch: Partial<ScheduledPost>) {
  postStore.setState(({ posts }) => ({ posts: posts.map((post) => (post.id === id ? { ...post, ...patch } : post)) }))
}

export function usePosts() {
  return useStore(postStore, (state) => state.posts)
}

export const postActions = {
  approve: (id: string) => patchPost(id, { status: "scheduled" }),
  skip: (id: string) => patchPost(id, { status: "skipped" }),
  restore: (id: string) => patchPost(id, { status: "pending" }),
  reschedule: (id: string, day: number) => patchPost(id, { day }),
  add: (posts: ScheduledPost[]) =>
    postStore.setState((state) => ({
      posts: [...state.posts.filter((post) => !posts.some((added) => added.id === post.id)), ...posts],
    })),
  find: (id: string) => postStore.getState().posts.find((post) => post.id === id),
}
