import type { Metadata } from "next"

import { getChannelStats, getPeriodReports } from "@/entities/report/index.server"
import { DashboardOverview } from "@/widgets/dashboard-overview"

export const metadata: Metadata = { title: "Dashboard" }

export async function DashboardPage() {
  const [reports, channelStats] = await Promise.all([getPeriodReports(), getChannelStats()])
  return <DashboardOverview reports={reports} channelStats={channelStats} />
}
