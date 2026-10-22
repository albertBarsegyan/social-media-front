import type { Metadata } from "next"
import { Suspense } from "react"

import { Skeleton } from "@/shared/ui/skeleton"

import { OnboardingWizard } from "./onboarding-wizard"

export const metadata: Metadata = { title: "Setup wizard" }

export function OnboardingPage() {
  return (
    // The wizard reads `?workspace=` to resume a workspace, which needs a Suspense boundary.
    <Suspense fallback={<Skeleton className="m-6 h-[60vh] rounded-xl" />}>
      <OnboardingWizard />
    </Suspense>
  )
}
