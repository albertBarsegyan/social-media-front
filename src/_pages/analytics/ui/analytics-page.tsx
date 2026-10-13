import type { Metadata } from "next"

import { getChannelStats, getTopLinks, getWeeklyReport } from "@/entities/report/index.server"
import { AnalyticsReport } from "@/widgets/analytics-report"

export const metadata: Metadata = { title: "Analytics" }

export async function AnalyticsPage() {
  const [channelStats, links, weekly] = await Promise.all([getChannelStats(), getTopLinks(), getWeeklyReport()])
  return <AnalyticsReport channelStats={channelStats} links={links} weekly={weekly} />
}
