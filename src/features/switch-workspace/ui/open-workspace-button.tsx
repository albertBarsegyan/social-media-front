"use client"

import { useRouter } from "next/navigation"

import { useCurrentWorkspace, type WorkspaceSummary } from "@/entities/workspace"
import { routes } from "@/shared/config"
import { Button } from "@/shared/ui/button"

/** Make a client the current workspace and go to its dashboard (or finish its setup). */
export function OpenWorkspaceButton({ workspace }: { workspace: WorkspaceSummary }) {
  const router = useRouter()
  const { setWorkspaceId } = useCurrentWorkspace()
  const inSetup = workspace.health.status === "setup"
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        setWorkspaceId(workspace.id)
        router.push(inSetup && workspace.myRole === "operator" ? routes.onboardingFor(workspace.id) : routes.dashboard)
      }}
    >
      {inSetup ? "Finish setup" : "Open"}
    </Button>
  )
}
