"use client"

import { Bar, BarChart, Cell, XAxis } from "recharts"

import type { VolumePoint } from "@/entities/report"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/shared/ui/chart"

const config = { value: { label: "Posts", color: "var(--chart-1)" } } satisfies ChartConfig

/** Daily (or weekly) count of buying-intent posts; the latest bar is highlighted. */
export function IntentVolumeChart({ data }: { data: VolumePoint[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-44 w-full">
      <BarChart data={data} margin={{ top: 16, left: 0, right: 0, bottom: 0 }}>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="value" radius={4} label={{ position: "top", fontSize: 11, fill: "var(--muted-foreground)" }}>
          {data.map((point, index) => (
            <Cell key={point.label} fill={index === data.length - 1 ? "var(--primary)" : "var(--color-value)"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
