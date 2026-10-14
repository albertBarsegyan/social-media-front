const DAY_MS = 24 * 60 * 60 * 1000

/** Monday 00:00 (viewer's local time) of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const offset = (start.getDay() + 6) % 7
  start.setDate(start.getDate() - offset)
  return start
}

export function addDays(date: Date, days: number): Date {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

/** The seven days of the week starting at `weekStart`. */
export function weekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}

/** "Oct 12 – 18, 2026" */
export function weekLabel(weekStart: Date): string {
  const end = addDays(weekStart, 6)
  const startText = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  const endText = end.toLocaleDateString("en-US", {
    ...(end.getMonth() === weekStart.getMonth() ? {} : { month: "short" }),
    day: "numeric",
  })
  return `${startText} – ${endText}, ${end.getFullYear()}`
}

/** Same local time of day as `time`, moved to `day`. */
export function moveToDay(time: Date, day: Date): Date {
  const moved = new Date(day)
  moved.setHours(time.getHours(), time.getMinutes(), 0, 0)
  return moved
}

export { DAY_MS }
