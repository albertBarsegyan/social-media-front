import { useInfiniteQuery, useQuery } from "@tanstack/react-query"

import { cursorPaging, reportsApi, workspaceScope, type ReportPeriod } from "@/shared/api"

export const reportKeys = {
  all: (wid: string) => [...workspaceScope(wid), "reports"] as const,
  overview: (wid: string, period: ReportPeriod) => [...reportKeys.all(wid), "overview", period] as const,
  channels: (wid: string, period: ReportPeriod) => [...reportKeys.all(wid), "channels", period] as const,
  links: (wid: string, period: ReportPeriod) => [...reportKeys.all(wid), "links", period] as const,
  weekly: (wid: string) => [...reportKeys.all(wid), "weekly"] as const,
}

export function useOverviewReport(wid: string, period: ReportPeriod) {
  return useQuery({ queryKey: reportKeys.overview(wid, period), queryFn: () => reportsApi.overview(wid, period) })
}

export function useChannelStats(wid: string, period: ReportPeriod) {
  return useQuery({ queryKey: reportKeys.channels(wid, period), queryFn: () => reportsApi.channels(wid, period) })
}

export function useLinkStats(wid: string, period: ReportPeriod) {
  return useInfiniteQuery({
    queryKey: reportKeys.links(wid, period),
    queryFn: ({ pageParam }) => reportsApi.links(wid, { period, cursor: pageParam, limit: 10 }),
    ...cursorPaging,
  })
}

export function useWeeklyReport(wid: string) {
  return useQuery({ queryKey: reportKeys.weekly(wid), queryFn: () => reportsApi.weekly(wid) })
}
