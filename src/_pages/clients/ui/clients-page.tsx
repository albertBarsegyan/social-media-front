import type { Metadata } from "next"

import { ClientsOverview } from "./clients-overview"

export const metadata: Metadata = { title: "All clients" }

export function ClientsPage() {
  return <ClientsOverview />
}
