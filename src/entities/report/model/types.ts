export type ReportPeriod = "7d" | "30d"

export interface Kpi {
  label: string
  value: string
  delta: string
}

export interface VolumePoint {
  label: string
  value: number
}

export interface ChannelStat {
  key: string
  label: string
  short: string
  found: number | null
  replies: number | null
  clicks: number
  leads: number
  deals: number
}

export interface TrackedLink {
  slug: string
  what: string
  clicks: number
  leads: number
  deals: number
}

export interface WeeklyReport {
  title: string
  schedule: string
  summary: string
  stats: { label: string; value: string }[]
  nextWeek: string
}

export interface PeriodReport {
  kpis: Kpi[]
  volume: VolumePoint[]
  scanned: string
}
