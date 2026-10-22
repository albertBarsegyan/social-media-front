import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { settingsSections, type SettingsSection } from "@/shared/config"
import { Skeleton } from "@/shared/ui/skeleton"

import { BillingSection } from "./billing-section"
import { BrandSection, ChannelsSection, KeywordsSection, TeamSection, UsageSection } from "./client-sections"
import { SettingsNav } from "./settings-nav"

export const metadata: Metadata = { title: "Settings" }

export function generateStaticParams() {
  return settingsSections.map((section) => ({ section }))
}

const isSection = (value: string): value is SettingsSection => (settingsSections as readonly string[]).includes(value)

async function Section({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (!isSection(section)) notFound()

  switch (section) {
    case "brand":
      return <BrandSection />
    case "keywords":
      return <KeywordsSection />
    case "channels":
      return <ChannelsSection />
    case "team":
      return <TeamSection />
    case "usage":
      return <UsageSection />
    case "billing":
      return <BillingSection />
  }
}

export function SettingsPage({ params }: { params: Promise<{ section: string }> }) {
  return (
    <div className="grid gap-6 md:grid-cols-[190px_minmax(0,1fr)]">
      <SettingsNav />
      <div className="min-w-0 max-w-3xl">
        <Suspense fallback={<Skeleton className="h-96 rounded-xl" />}>
          <Section params={params} />
        </Suspense>
      </div>
    </div>
  )
}
