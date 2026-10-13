"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import { setClientCookie } from "@/shared/lib/cookies"

import { mockWorkspaces } from "../api/mock-workspaces"
import { defaultWorkspaceId, workspaceCookie } from "../config/workspace"
import type { Workspace } from "./types"

interface CurrentWorkspaceValue {
  workspace: Workspace
  workspaces: Workspace[]
  setWorkspaceId: (id: string) => void
}

function resolve(id: string) {
  return mockWorkspaces.find((ws) => ws.id === id) ?? mockWorkspaces[0]
}

const CurrentWorkspaceContext = createContext<CurrentWorkspaceValue>({
  workspace: resolve(defaultWorkspaceId),
  workspaces: mockWorkspaces,
  setWorkspaceId: () => {},
})

export function CurrentWorkspaceProvider({ initialId, children }: { initialId: string; children: ReactNode }) {
  const [id, setId] = useState(initialId)

  const setWorkspaceId = useCallback((next: string) => {
    setId(next)
    setClientCookie(workspaceCookie, next)
  }, [])

  const value = useMemo(
    () => ({ workspace: resolve(id), workspaces: mockWorkspaces, setWorkspaceId }),
    [id, setWorkspaceId],
  )

  return <CurrentWorkspaceContext value={value}>{children}</CurrentWorkspaceContext>
}

export function useCurrentWorkspace() {
  return useContext(CurrentWorkspaceContext)
}
