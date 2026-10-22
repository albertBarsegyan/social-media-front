import type { Metadata } from "next"

import { ContentStudio } from "./content-studio"

export const metadata: Metadata = { title: "Content studio" }

export function StudioPage() {
  return <ContentStudio />
}
