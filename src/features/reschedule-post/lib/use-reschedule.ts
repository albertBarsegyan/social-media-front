"use client"

import type { QueryKey } from "@tanstack/react-query"
import { useRef, useState, type DragEvent } from "react"

import { isSameDay, moveToDay, type Post } from "@/entities/post"
import { formatDate, formatTime } from "@/shared/lib/format"
import { toast } from "@/shared/lib/toast"

import { useReschedulePost } from "../api/mutations"

/** Drag a calendar post onto another day; the time of day is kept. */
export function useReschedule(wid: string, rangeKey: QueryKey, posts: Post[], enabled: boolean) {
  const draggedId = useRef<string | null>(null)
  const [overDay, setOverDay] = useState<number | null>(null)
  const reschedule = useReschedulePost(wid, rangeKey)

  const dragProps = (post: Post) => {
    const draggable = enabled && post.status !== "published"
    return {
      draggable,
      onDragStart: (event: DragEvent) => {
        draggedId.current = post.id
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("text/plain", post.id)
      },
      onDragEnd: () => setOverDay(null),
      className: draggable ? "cursor-grab active:cursor-grabbing" : undefined,
    }
  }

  const dropProps = (day: Date, index: number) => ({
    onDragOver: (event: DragEvent) => {
      if (!enabled) return
      event.preventDefault()
      if (overDay !== index) setOverDay(index)
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      setOverDay(null)
      const post = posts.find((item) => item.id === draggedId.current)
      draggedId.current = null
      if (!post || post.status === "published") return
      const current = new Date(post.scheduledAt)
      if (isSameDay(current, day)) return
      const target = moveToDay(current, day)
      if (target.getTime() <= Date.now()) {
        toast("Can’t schedule in the past")
        return
      }
      const scheduledAt = target.toISOString()
      reschedule.mutate(
        { id: post.id, scheduledAt },
        { onSuccess: () => toast(`Moved to ${formatDate(scheduledAt)}, ${formatTime(scheduledAt)}`) },
      )
    },
  })

  return { dragProps, dropProps, overDay }
}
