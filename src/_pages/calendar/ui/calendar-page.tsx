import type { Metadata } from "next"

import { ContentCalendar } from "@/widgets/content-calendar"

export const metadata: Metadata = { title: "Calendar" }

export function CalendarPage() {
  return <ContentCalendar />
}
