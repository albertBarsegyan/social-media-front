import "server-only"

import type { ChannelStat, PeriodReport, ReportPeriod, TrackedLink, WeeklyReport } from "../model/types"

// Mock data until the analytics service exists. Keep the async signatures so
// call sites don't change when these become real requests.

const periodReports: Record<ReportPeriod, PeriodReport> = {
  "7d": {
    scanned: "Scanned 1,840 posts · 64 above threshold 40",
    kpis: [
      { label: "Buying-intent posts", value: "64", delta: "+18%" },
      { label: "Replies sent", value: "23", delta: "+5" },
      { label: "Link clicks", value: "547", delta: "+12%" },
      { label: "Leads", value: "34", delta: "+9" },
      { label: "Deals", value: "10", delta: "+3" },
    ],
    volume: [
      { label: "Mon", value: 7 }, { label: "Tue", value: 9 }, { label: "Wed", value: 12 }, { label: "Thu", value: 8 },
      { label: "Fri", value: 11 }, { label: "Sat", value: 10 }, { label: "Sun", value: 7 },
    ],
  },
  "30d": {
    scanned: "Scanned 7,320 posts · 241 above threshold 40",
    kpis: [
      { label: "Buying-intent posts", value: "241", delta: "+31%" },
      { label: "Replies sent", value: "88", delta: "+22" },
      { label: "Link clicks", value: "2,106", delta: "+19%" },
      { label: "Leads", value: "121", delta: "+40" },
      { label: "Deals", value: "37", delta: "+11" },
    ],
    volume: [
      { label: "W1", value: 49 }, { label: "W2", value: 58 }, { label: "W3", value: 70 }, { label: "W4", value: 64 },
    ],
  },
}

const channelStats: ChannelStat[] = [
  { key: "fbgroup", label: "Facebook groups", short: "f", found: 21, replies: 8, clicks: 96, leads: 11, deals: 4 },
  { key: "reddit", label: "Reddit", short: "R", found: 18, replies: 7, clicks: 142, leads: 9, deals: 3 },
  { key: "tggroup", label: "Telegram groups", short: "TG", found: 14, replies: 5, clicks: 61, leads: 7, deals: 2 },
  { key: "instagram", label: "Instagram posts", short: "IG", found: null, replies: null, clicks: 210, leads: 6, deals: 1 },
  { key: "x", label: "X", short: "X", found: 11, replies: 3, clicks: 38, leads: 1, deals: 0 },
]

const topLinks: TrackedLink[] = [
  { slug: "mila.am/r/b7q2", what: "Instagram post · Bridal case study", clicks: 122, leads: 4, deals: 1 },
  { slug: "mila.am/r/fb21", what: "Reply · Yerevan Expats & Locals", clicks: 54, leads: 6, deals: 3 },
  { slug: "mila.am/r/tg08", what: "Reply · Ереван | Красота и уход", clicks: 41, leads: 5, deals: 2 },
  { slug: "mila.am/r/k3x9", what: "Reply · r/armenia", clicks: 38, leads: 3, deals: 1 },
  { slug: "mila.am/r/x4m1", what: "Reply · X search", clicks: 12, leads: 1, deals: 0 },
]

const weeklyReport: WeeklyReport = {
  title: "Weekly report · Oct 5–11",
  schedule: "Sent Mondays 09:00 to Telegram",
  summary:
    "Facebook groups were the best channel: 4 deals from 8 replies. Instagram drove the most clicks (210) but only 1 deal — the bridal post is getting saves, not bookings. Reddit replies in English convert well with expats.",
  stats: [
    { label: "Owner time spent", value: "1 h 20 min" },
    { label: "Drafts approved without edits", value: "17 of 23" },
    { label: "Skipped drafts", value: "6 · mostly “outside our area”" },
  ],
  nextWeek: "add “Arabkir” as a negative location, and post the bridal case study to two more Facebook groups.",
}

export async function getPeriodReports() {
  return periodReports
}

export async function getChannelStats() {
  return channelStats
}

export async function getTopLinks() {
  return topLinks
}

export async function getWeeklyReport() {
  return weeklyReport
}
