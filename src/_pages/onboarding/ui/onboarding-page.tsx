import type { Metadata } from "next"

import { OnboardingWizard } from "./onboarding-wizard"

export const metadata: Metadata = { title: "Setup wizard" }

export function OnboardingPage() {
  return <OnboardingWizard />
}
