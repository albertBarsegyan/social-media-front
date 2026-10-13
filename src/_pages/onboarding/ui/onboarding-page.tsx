import type { Metadata } from "next"

import { OnboardingWizard } from "@/widgets/onboarding-wizard"

export const metadata: Metadata = { title: "Setup wizard" }

export function OnboardingPage() {
  return <OnboardingWizard />
}
