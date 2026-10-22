"use client"

import { Bar, BarChart, Cell, XAxis } from "recharts"

import type { ReportPeriod } from "@/entities/report"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/ui/chart"

const config = { count: { label: "Posts", color: "var(--chart-1)" } } satisfies ChartConfig

function bucketLabel(bucketStart: string, period: ReportPeriod) {
  const date = new Date(`${bucketStart}T00:00:00`)
  return period === "7d"
    ? date.toLocaleDateString("en-US", { weekday: "short" })
    : date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

/** Daily (7d) or weekly (30d) count of buying-intent posts; the latest bar is highlighted. */
export function IntentVolumeChart({ data, period }: { data: { bucketStart: string; count: number }[]; period: ReportPeriod }) {
  const points = data.map((point) => ({ ...point, label: bucketLabel(point.bucketStart, period) }))
  return (
    <ChartContainer config={config} className="aspect-auto h-44 w-full">
      <BarChart data={points} margin={{ top: 16, left: 0, right: 0, bottom: 0 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={4} label={{ position: "top", fontSize: 11, fill: "var(--muted-foreground)" }}>
          {points.map((point, index) => (
            <Cell key={point.bucketStart} fill={index === points.length - 1 ? "var(--primary)" : "var(--color-count)"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
