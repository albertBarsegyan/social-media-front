"use client"

import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import type { Role, WorkspaceSummary } from "@/shared/api"
import { routes } from "@/shared/config"
import { setClientCookie } from "@/shared/lib/cookies"
import { Skeleton } from "@/shared/ui/skeleton"
import { ErrorState } from "@/shared/ui/error-state"

import { useWorkspaces } from "../api/queries"
import { workspaceCookie } from "../config/workspace"

interface CurrentWorkspaceValue {
  workspace: WorkspaceSummary
  workspaceId: string
  role: Role
  workspaces: WorkspaceSummary[]
  setWorkspaceId: (id: string) => void
}

const CurrentWorkspaceContext = createContext<CurrentWorkspaceValue | null>(null)

/**
 * Loads the viewer's workspaces and picks the current one (cookie first, then the first workspace).
 * A viewer without workspaces is sent to onboarding.
 */
export function CurrentWorkspaceProvider({ initialId, children }: { initialId?: string; children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const query = useWorkspaces()
  const [id, setId] = useState(initialId)

  const workspaces = useMemo(() => query.data?.pages.flatMap((page) => page.items) ?? [], [query.data])
  const workspace = workspaces.find((ws) => ws.id === id) ?? workspaces[0]

  const setWorkspaceId = useCallback(
    (next: string) => {
      setId(next)
      setClientCookie(workspaceCookie, next)
      void queryClient.invalidateQueries({ queryKey: ["workspaces", next] })
    },
    [queryClient],
  )

  useEffect(() => {
    if (query.isSuccess && workspaces.length === 0) router.replace(routes.onboarding)
  }, [query.isSuccess, workspaces.length, router])

  const value = useMemo(
    () =>
      workspace
        ? { workspace, workspaceId: workspace.id, role: workspace.myRole, workspaces, setWorkspaceId }
        : null,
    [workspace, workspaces, setWorkspaceId],
  )

  if (query.isError) return <ErrorState className="m-6" error={query.error} onRetry={() => void query.refetch()} />
  if (!value) return <Skeleton className="m-6 h-[60vh] rounded-xl" />
  return <CurrentWorkspaceContext value={value}>{children}</CurrentWorkspaceContext>
}

export function useCurrentWorkspace(): CurrentWorkspaceValue {
  const value = useContext(CurrentWorkspaceContext)
  if (!value) throw new Error("useCurrentWorkspace must be used inside CurrentWorkspaceProvider")
  return value
}
