"use client"

import Link from "next/link"
import { useState } from "react"

import { BudgetBreakdown, BudgetMeter, budgetPeriod, formatMoney, useAiBudget } from "@/entities/ai-budget"
import { ChannelMark } from "@/entities/channel"
import { useLeads } from "@/entities/lead"
import { usePosts } from "@/entities/post"
import type { ChannelStat, PeriodReport, ReportPeriod } from "@/entities/report"
import { useViewer } from "@/entities/viewer"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { IntentVolumeChart } from "./intent-volume-chart"

interface DashboardOverviewProps {
  reports: Record<ReportPeriod, PeriodReport>
  channelStats: ChannelStat[]
}

export function DashboardOverview({ reports, channelStats }: DashboardOverviewProps) {
  const [period, setPeriod] = useState<ReportPeriod>("7d")
  const viewer = useViewer()
  const budget = useAiBudget()
  const leads = useLeads()
  const posts = usePosts()
  const report = reports[period]

  const pendingReplies = leads.filter((lead) => lead.status === "pending").length
  const pendingPosts = posts.filter((post) => post.status === "pending").length

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Good afternoon, {viewer.firstName}</h2>
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

      {pendingReplies + pendingPosts > 0 ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-primary p-4 text-primary-foreground">
          <div className="flex-1">
            <div className="font-semibold">{pendingReplies + pendingPosts} drafts waiting for you</div>
            <div className="text-sm opacity-80">
              {pendingReplies} replies to buyers · {pendingPosts} posts. Nothing goes public until you approve.
            </div>
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link href={routes.approvals}>Review drafts</Link>
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {report.kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4">
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{kpi.value}</span>
              <span className="text-xs text-success-muted-foreground">{kpi.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="gap-2">
          <CardHeader>
            <CardTitle>Buying-intent posts found</CardTitle>
            <CardDescription>{report.scanned}</CardDescription>
          </CardHeader>
          <CardContent>
            <IntentVolumeChart data={report.volume} />
          </CardContent>
        </Card>
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>AI budget</CardTitle>
            <CardDescription>Resets {budgetPeriod.resetsOn}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold tabular-nums">{formatMoney(budget.used)}</span>
              <span className="text-sm text-muted-foreground">of {formatMoney(budget.cap)}</span>
            </div>
            <BudgetMeter budget={budget} />
            <BudgetBreakdown budget={budget} />
            <Button variant="outline" size="sm" asChild>
              <Link href={routes.settings("usage")}>Adjust cap</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>By channel</CardTitle>
          <Link href={routes.analytics} className="text-sm underline underline-offset-3">
            Open analytics
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                {["Found", "Replies", "Clicks", "Leads", "Deals"].map((label) => (
                  <TableHead key={label} className="text-right">
                    {label}
                  </TableHead>
                ))}
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
                  <TableCell className="text-right tabular-nums">{row.found ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.replies ?? "—"}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.clicks}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.leads}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">{row.deals}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
