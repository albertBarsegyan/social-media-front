import type { Metadata } from "next"

import { ContentStudio } from "@/widgets/content-studio"

export const metadata: Metadata = { title: "Content studio" }

export function StudioPage() {
  return <ContentStudio />
}
