import { cookies } from "next/headers"
import { Suspense, type ReactNode } from "react"

import { CurrentWorkspaceProvider, defaultWorkspaceId, workspaceCookie } from "@/entities/workspace"
import { RaiseCapDialog } from "@/features/adjust-ai-cap"
import { WorkspaceSwitcherDialog } from "@/features/switch-workspace"
import { defaultLocale, isLocale, localeCookie } from "@/shared/config"
import { LocaleProvider } from "@/shared/lib/i18n"
import { SidebarInset, SidebarProvider } from "@/shared/ui/sidebar"
import { Skeleton } from "@/shared/ui/skeleton"
import { AppHeader, AppSidebar, MobileNav, StatusBanners } from "@/widgets/app-shell"

/** Reads the locale and workspace cookies, so it must render inside Suspense. */
async function Session({ children }: { children: ReactNode }) {
  const store = await cookies()
  const locale = store.get(localeCookie)?.value
  const workspaceId = store.get(workspaceCookie)?.value ?? defaultWorkspaceId

  return (
    <LocaleProvider initialLocale={isLocale(locale) ? locale : defaultLocale}>
      <CurrentWorkspaceProvider initialId={workspaceId}>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset className="min-w-0">
            <AppHeader />
            <StatusBanners />
            <div className="flex-1 px-4 pt-4 pb-6 md:px-7 md:pt-6 md:pb-10">{children}</div>
            <MobileNav />
          </SidebarInset>
          <WorkspaceSwitcherDialog />
          <RaiseCapDialog />
        </SidebarProvider>
      </CurrentWorkspaceProvider>
    </LocaleProvider>
  )
}

export function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Skeleton className="m-6 h-[60vh] rounded-xl" />}>
      <Session>{children}</Session>
    </Suspense>
  )
}
