"use client"

import Link from "next/link"
import { useState } from "react"

import { skipReasonLabel } from "@/entities/buying-intent"
import { channelInfo, ChannelMark } from "@/entities/channel"
import { useChannelStats, useLinkStats, useWeeklyReport, type ReportPeriod } from "@/entities/report"
import { useCurrentWorkspace } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { formatDate } from "@/shared/lib/format"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"
import { StatRow } from "@/shared/ui/stat-row"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { DownloadReportButton } from "./download-report-button"

function FunnelBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 rounded-full bg-chart-2" style={{ width: `${Math.max(2, max ? (value / max) * 70 : 0)}%` }} />
      <span className="font-mono text-xs tabular-nums" aria-label={label}>
        {value}
      </span>
    </span>
  )
}

const percent = (part: number, whole: number, digits = 0) => (whole ? `${((part / whole) * 100).toFixed(digits)}%` : "—")

function FunnelCard({ wid, period }: { wid: string; period: ReportPeriod }) {
  const stats = useChannelStats(wid, period)
  const rows = stats.data ?? []
  const max = {
    clicks: Math.max(0, ...rows.map((row) => row.linkClicks)),
    inquiries: Math.max(0, ...rows.map((row) => row.inquiries)),
    deals: Math.max(0, ...rows.map((row) => row.deals)),
  }
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Clicks → inquiries → deals, by channel</CardTitle>
        <CardDescription>An inquiry is a DM, form or booking from a person; a deal is a won inquiry.</CardDescription>
      </CardHeader>
      <CardContent>
        {stats.isError ? (
          <ErrorState error={stats.error} onRetry={() => void stats.refetch()} />
        ) : !stats.data ? (
          <Skeleton className="h-64" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="w-1/5">Clicks</TableHead>
                <TableHead className="w-1/5">Inquiries</TableHead>
                <TableHead className="w-1/5">Deals</TableHead>
                <TableHead className="text-right">Click→inquiry</TableHead>
                <TableHead className="text-right">Inquiry→deal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.channel}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <ChannelMark short={channelInfo[row.channel].short} />
                      {channelInfo[row.channel].label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.linkClicks} max={max.clicks} label={`${row.linkClicks} clicks`} />
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.inquiries} max={max.inquiries} label={`${row.inquiries} inquiries`} />
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.deals} max={max.deals} label={`${row.deals} deals`} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{percent(row.inquiries, row.linkClicks, 1)}</TableCell>
                  <TableCell className="text-right tabular-nums">{percent(row.deals, row.inquiries)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

function LinksCard({ wid, period }: { wid: string; period: ReportPeriod }) {
  const links = useLinkStats(wid, period)
  const rows = links.data?.pages.flatMap((page) => page.items) ?? []
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>Top tracked links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {links.isError ? (
          <ErrorState error={links.error} onRetry={() => void links.refetch()} />
        ) : links.isPending ? (
          <Skeleton className="h-48" />
        ) : rows.length === 0 ? (
          <EmptyState title="No tracked links yet" description="Every drafted reply and scheduled post gets one." />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Inquiries</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ link, target, inquiries, deals }) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="font-mono text-xs">{link.url}</div>
                      <div className="text-xs text-muted-foreground">
                        {target.kind === "reply" ? `Reply · ${target.sourceName}` : `${channelInfo[target.channel].label} post`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{link.clicks}</TableCell>
                    <TableCell className="text-right tabular-nums">{inquiries}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{deals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {links.hasNextPage ? (
              <Button variant="outline" size="sm" disabled={links.isFetchingNextPage} onClick={() => void links.fetchNextPage()}>
                {links.isFetchingNextPage ? "Loading…" : "Show more"}
              </Button>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function WeeklyCard({ wid }: { wid: string }) {
  const weekly = useWeeklyReport(wid)
  const data = weekly.data
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>Weekly report{data ? ` · ${formatDate(data.from)}–${formatDate(new Date(new Date(data.to).getTime() - 1).toISOString())}` : ""}</CardTitle>
        <CardDescription>Sent Mondays to Telegram</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {weekly.isError ? (
          <ErrorState error={weekly.error} onRetry={() => void weekly.refetch()} />
        ) : !data ? (
          <Skeleton className="h-48" />
        ) : (
          <>
            <p className="text-sm leading-relaxed">
              {data.bestChannel
                ? `Best channel: ${channelInfo[data.bestChannel.channel].label} — ${data.bestChannel.deals} deals from ${data.bestChannel.repliesSent} replies.`
                : "No deals recorded last week yet."}
            </p>
            <div className="space-y-1.5">
              <StatRow label="Buying-intent posts" value={data.kpis.buyingIntents.current} />
              <StatRow label="Replies sent" value={data.kpis.repliesSent.current} />
              <StatRow label="Inquiries · deals" value={`${data.kpis.inquiries.current} · ${data.kpis.deals.current}`} />
              <StatRow label="Drafts approved without edits" value={`${data.draftsApprovedWithoutEdits} of ${data.draftsApproved}`} />
              <StatRow
                label="Skipped drafts"
                value={`${data.skipped.count}${data.skipped.topReason ? ` · mostly “${skipReasonLabel(data.skipped.topReason)}”` : ""}`}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <Link href={routes.telegramPreview}>Preview in Telegram</Link>
              </Button>
              <DownloadReportButton />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function AnalyticsReport() {
  const { workspaceId } = useCurrentWorkspace()
  const [period, setPeriod] = useState<ReportPeriod>("7d")
  return (
    <div className="space-y-4">
      <Tabs value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)}>
        <TabsList>
          <TabsTrigger value="7d">7 days</TabsTrigger>
          <TabsTrigger value="30d">30 days</TabsTrigger>
        </TabsList>
      </Tabs>
      <FunnelCard wid={workspaceId} period={period} />
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <LinksCard wid={workspaceId} period={period} />
        <WeeklyCard wid={workspaceId} />
      </div>
    </div>
  )
}
