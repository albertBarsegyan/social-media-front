import type { Metadata } from "next"

import { AnalyticsReport } from "./analytics-report"

export const metadata: Metadata = { title: "Analytics" }

export function AnalyticsPage() {
  return <AnalyticsReport />
}
