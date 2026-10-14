"use client"

import Link from "next/link"
import { useState } from "react"

import { BudgetBreakdown, BudgetMeter, useAiBudget } from "@/entities/ai-budget"
import { useApprovalSummary } from "@/entities/approval"
import { useCatalog } from "@/entities/catalog"
import { channelInfo, ChannelMark } from "@/entities/channel"
import { kpiLabels, kpiOrder, useChannelStats, useOverviewReport, type ReportPeriod } from "@/entities/report"
import { useViewer } from "@/entities/viewer"
import { useCurrentWorkspace } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { firstName, formatCount, formatDate, formatDelta, formatUsdMicros } from "@/shared/lib/format"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { IntentVolumeChart } from "./intent-volume-chart"

const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`

function greeting(now = new Date()) {
  const hour = now.getHours()
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
}

function KpiTiles({ wid, period }: { wid: string; period: ReportPeriod }) {
  const report = useOverviewReport(wid, period)
  const draftThreshold = useCatalog().data?.draftThreshold
  if (report.isError) return <ErrorState error={report.error} onRetry={() => void report.refetch()} />
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {kpiOrder.map((key) =>
          report.data ? (
            <div key={key} className="rounded-xl border bg-card p-4">
              <div className="text-xs text-muted-foreground">{kpiLabels[key]}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tabular-nums">{formatCount(report.data.kpis[key].current)}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDelta(report.data.kpis[key].current, report.data.kpis[key].previous)}
                </span>
              </div>
            </div>
          ) : (
            <Skeleton key={key} className="h-20 rounded-xl" />
          ),
        )}
      </div>
      <Card className="gap-2">
        <CardHeader>
          <CardTitle>Buying-intent posts found</CardTitle>
          <CardDescription>
            {report.data
              ? `Scanned ${formatCount(report.data.scanned)} posts · ${formatCount(report.data.aboveThreshold)} at or above ${draftThreshold ?? "the threshold"}`
              : " "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.data ? <IntentVolumeChart data={report.data.volume} period={period} /> : <Skeleton className="h-44" />}
        </CardContent>
      </Card>
    </>
  )
}

function BudgetCard({ wid }: { wid: string }) {
  const budget = useAiBudget(wid)
  return (
    <Card className="gap-4">
      <CardHeader>
        <CardTitle>AI budget</CardTitle>
        <CardDescription>{budget.data ? `Resets ${formatDate(budget.data.resetsOn)}` : " "}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budget.isError ? (
          <ErrorState error={budget.error} onRetry={() => void budget.refetch()} />
        ) : !budget.data ? (
          <Skeleton className="h-32" />
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{formatUsdMicros(budget.data.usedUsdMicros)}</span>
              <span className="text-sm text-muted-foreground">of {formatUsdMicros(budget.data.capUsdMicros)}</span>
            </div>
            <BudgetMeter budget={budget.data} />
            <BudgetBreakdown budget={budget.data} />
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.settings("usage")}>Adjust cap</Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ChannelTable({ wid, period }: { wid: string; period: ReportPeriod }) {
  const stats = useChannelStats(wid, period)
  if (stats.isError) return <ErrorState error={stats.error} onRetry={() => void stats.refetch()} />
  if (!stats.data) return <Skeleton className="h-64" />
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Channel</TableHead>
          {["Found", "Replies", "Clicks", "Inquiries", "Deals"].map((label) => (
            <TableHead key={label} className="text-right">
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {stats.data.map((row) => (
          <TableRow key={row.channel}>
            <TableCell>
              <span className="flex items-center gap-2">
                <ChannelMark short={channelInfo[row.channel].short} />
                {channelInfo[row.channel].label}
              </span>
            </TableCell>
            <TableCell className="text-right tabular-nums">{row.buyingIntents ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{row.repliesSent ?? "—"}</TableCell>
            <TableCell className="text-right tabular-nums">{row.linkClicks}</TableCell>
            <TableCell className="text-right tabular-nums">{row.inquiries}</TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{row.deals}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function DashboardOverview() {
  const [period, setPeriod] = useState<ReportPeriod>("7d")
  const { workspaceId } = useCurrentWorkspace()
  const viewer = useViewer().data
  const summary = useApprovalSummary(workspaceId).data
  const pending = summary ? summary.pendingReplies + summary.pendingPosts : 0

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {greeting()}
            {viewer ? `, ${firstName(viewer.name)}` : ""}
          </h2>
          <p className="text-sm text-muted-foreground">
            What the engine found and what it brought in — {period === "7d" ? "last 7 days" : "last 30 days"}.
          </p>
        </div>
        <Tabs value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)}>
          <TabsList>
            <TabsTrigger value="7d">7 days</TabsTrigger>
            <TabsTrigger value="30d">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {summary && pending > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-primary p-4 text-primary-foreground">
          <div className="flex-1">
            <div className="font-semibold">{plural(pending, "draft")} waiting for you</div>
            <div className="text-sm opacity-80">
              {plural(summary.pendingReplies, "reply", "replies")} to buyers · {plural(summary.pendingPosts, "post")}. Nothing goes
              public until you approve.
            </div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={routes.approvals}>Review drafts</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-4">
          <KpiTiles wid={workspaceId} period={period} />
        </div>
        <BudgetCard wid={workspaceId} />
      </div>

      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>By channel</CardTitle>
          <Link href={routes.analytics} className="text-sm underline underline-offset-3">
            Open analytics
          </Link>
        </CardHeader>
        <CardContent>
          <ChannelTable wid={workspaceId} period={period} />
        </CardContent>
      </Card>
    </div>
  )
}
