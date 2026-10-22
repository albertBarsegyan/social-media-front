import { api, query } from "./client"
import type { ChannelKey, Page, PageParams, PublishChannel, TrackedLink } from "./types"

export type ReportPeriod = "7d" | "30d"

export interface Metric {
  current: number
  previous: number
}

export interface Kpis {
  buyingIntents: Metric
  repliesSent: Metric
  linkClicks: Metric
  inquiries: Metric
  deals: Metric
}

export interface OverviewReport {
  period: ReportPeriod
  from: string
  to: string
  scanned: number
  aboveThreshold: number
  kpis: Kpis
  volume: { bucketStart: string; count: number }[]
}

export interface ChannelStat {
  channel: ChannelKey
  buyingIntents: number | null
  repliesSent: number | null
  linkClicks: number
  inquiries: number
  deals: number
}

export interface LinkStat {
  link: TrackedLink
  target: { kind: "reply"; buyingIntentId: string; sourceName: string } | { kind: "post"; postId: string; channel: PublishChannel }
  inquiries: number
  deals: number
}

export interface WeeklyReport {
  from: string
  to: string
  kpis: Kpis
  bestChannel: { channel: ChannelKey; deals: number; repliesSent: number } | null
  draftsApproved: number
  draftsApprovedWithoutEdits: number
  skipped: { count: number; topReason: string | null }
  summary: null
}

const base = (wid: string) => `workspaces/${wid}/reports`

export const reportsApi = {
  overview: (wid: string, period: ReportPeriod) =>
    api.get(`${base(wid)}/overview`, { searchParams: { period } }).json<OverviewReport>(),
  channels: (wid: string, period: ReportPeriod) =>
    api.get(`${base(wid)}/channels`, { searchParams: { period } }).json<ChannelStat[]>(),
  links: (wid: string, params: PageParams & { period: ReportPeriod }) =>
    api.get(`${base(wid)}/links`, { searchParams: query({ ...params }) }).json<Page<LinkStat>>(),
  weekly: (wid: string) => api.get(`${base(wid)}/weekly`).json<WeeklyReport>(),
}
