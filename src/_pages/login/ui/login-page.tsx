import type { Metadata } from "next"
import { Suspense } from "react"

import { LoginForm } from "@/features/auth"

export const metadata: Metadata = { title: "Sign in" }

export function LoginPage() {
  return (
    // The form reads `?next=` to return to the page that required a session.
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
