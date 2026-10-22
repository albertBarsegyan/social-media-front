import type { Metadata } from "next"
import { Suspense } from "react"

import { RegisterForm } from "@/features/auth"

export const metadata: Metadata = { title: "Create account" }

export function RegisterPage() {
  return (
    // Without a boundary, Cache Components' dev validation can't render this segment for instant navigation.
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
