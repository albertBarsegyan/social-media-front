"use client"

import { useRouter } from "next/navigation"

import { useCurrentWorkspace, type Workspace } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

/** Make a client the current workspace and go to its dashboard (or finish its setup). */
export function OpenWorkspaceButton({ workspace }: { workspace: Workspace }) {
  const router = useRouter()
  const { setWorkspaceId } = useCurrentWorkspace()
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        setWorkspaceId(workspace.id)
        router.push(workspace.health === "setup" ? routes.onboarding : routes.dashboard)
      }}
    >
      Open
    </Button>
  )
}
