import Link from "next/link"

import { ChannelMark } from "@/entities/channel"
import type { ChannelStat, TrackedLink, WeeklyReport } from "@/entities/report"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { StatRow } from "@/shared/ui/stat-row"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"

import { DownloadReportButton } from "./download-report-button"

interface AnalyticsReportProps {
  channelStats: ChannelStat[]
  links: TrackedLink[]
  weekly: WeeklyReport
}

function FunnelBar({ value, max, label }: { value: number; max: number; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 rounded-full bg-chart-2" style={{ width: `${Math.max(2, (value / max) * 70)}%` }} />
      <span className="font-mono text-xs tabular-nums" aria-label={label}>
        {value}
      </span>
    </span>
  )
}

const percent = (part: number, whole: number, digits = 0) => (whole ? `${((part / whole) * 100).toFixed(digits)}%` : "—")

export function AnalyticsReport({ channelStats, links, weekly }: AnalyticsReportProps) {
  const max = {
    clicks: Math.max(...channelStats.map((row) => row.clicks)),
    leads: Math.max(...channelStats.map((row) => row.leads)),
    deals: Math.max(...channelStats.map((row) => row.deals)),
  }

  return (
    <div className="space-y-4">
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Clicks → leads → deals, by channel</CardTitle>
          <CardDescription>Last 7 days · a lead is a DM, form or booking that came through a tracked link</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="w-1/5">Clicks</TableHead>
                <TableHead className="w-1/5">Leads</TableHead>
                <TableHead className="w-1/5">Deals</TableHead>
                <TableHead className="text-right">Click→lead</TableHead>
                <TableHead className="text-right">Lead→deal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelStats.map((row) => (
                <TableRow key={row.key}>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <ChannelMark short={row.short} />
                      {row.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.clicks} max={max.clicks} label={`${row.clicks} clicks`} />
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.leads} max={max.leads} label={`${row.leads} leads`} />
                  </TableCell>
                  <TableCell>
                    <FunnelBar value={row.deals} max={max.deals} label={`${row.deals} deals`} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{percent(row.leads, row.clicks, 1)}</TableCell>
                  <TableCell className="text-right tabular-nums">{percent(row.deals, row.leads)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Top tracked links</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Leads</TableHead>
                  <TableHead className="text-right">Deals</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link) => (
                  <TableRow key={link.slug}>
                    <TableCell>
                      <div className="font-mono text-xs">{link.slug}</div>
                      <div className="text-xs text-muted-foreground">{link.what}</div>
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{link.clicks}</TableCell>
                    <TableCell className="text-right tabular-nums">{link.leads}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">{link.deals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>{weekly.title}</CardTitle>
            <CardDescription>{weekly.schedule}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{weekly.summary}</p>
            <div className="space-y-1.5">
              {weekly.stats.map((stat) => (
                <StatRow key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
            <p className="rounded-lg bg-muted p-3 text-sm">
              <b>Next week:</b> {weekly.nextWeek}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" asChild>
                <Link href={routes.telegramPreview}>Preview in Telegram</Link>
              </Button>
              <DownloadReportButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
