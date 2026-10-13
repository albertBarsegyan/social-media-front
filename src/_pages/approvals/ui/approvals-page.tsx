import type { Metadata } from "next"

import { ApprovalsQueue } from "@/widgets/approvals-queue"

export const metadata: Metadata = { title: "Approvals" }

export function ApprovalsPage() {
  return <ApprovalsQueue />
}
