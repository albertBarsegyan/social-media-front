"use client"

import { useRef, useState, type DragEvent } from "react"

import { dayLabel, postActions, week, type ScheduledPost } from "@/entities/post"
import { toast } from "@/shared/lib/toast"

/** Drag a calendar post onto another day of the visible week. */
export function useReschedule() {
  const draggedId = useRef<string | null>(null)
  const [overDay, setOverDay] = useState<number | null>(null)

  const dragProps = (post: ScheduledPost) => {
    const draggable = post.status !== "published"
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

  const dropProps = (day: number) => ({
    onDragOver: (event: DragEvent) => {
      event.preventDefault()
      if (overDay !== day) setOverDay(day)
    },
    onDrop: (event: DragEvent) => {
      event.preventDefault()
      setOverDay(null)
      const id = draggedId.current
      draggedId.current = null
      const post = id ? postActions.find(id) : undefined
      if (!post || post.status === "published" || post.day === day) return
      if (day < week.todayIndex) {
        toast("Can’t schedule in the past")
        return
      }
      postActions.reschedule(post.id, day)
      toast(`Moved to ${dayLabel(day)} ${week.month}, ${post.time}`)
    },
  })

  return { dragProps, dropProps, overDay }
}
