"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "next-themes"
import { useEffect, type ReactNode } from "react"

import { authApi, getQueryClient, onSessionExpired } from "@/shared/api"
import { routes } from "@/shared/config"
import { Toaster } from "@/shared/ui/sonner"
import { TooltipProvider } from "@/shared/ui/tooltip"

let expiring = false

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  // When the session can't be refreshed: clear cookies and cached data, then go to /login.
  useEffect(
    () =>
      onSessionExpired(() => {
        if (expiring) return
        expiring = true
        getQueryClient().clear()
        const next = `${window.location.pathname}${window.location.search}`
        void authApi
          .logout()
          .catch(() => undefined)
          .finally(() => {
            expiring = false
            router.replace(`${routes.login}?next=${encodeURIComponent(next)}`)
          })
      }),
    [router],
  )

  return (
    <QueryClientProvider client={getQueryClient()}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
