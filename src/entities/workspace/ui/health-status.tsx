import type { WorkspaceHealth, WorkspaceHealthStatus } from "@/shared/api"
import { cn } from "@/shared/lib/utils"

import { healthLabel } from "../config/workspace"

const dotClasses: Record<WorkspaceHealthStatus, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  err: "bg-destructive",
  setup: "bg-ring",
}

export function HealthStatus({ health, className }: { health: WorkspaceHealth; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dotClasses[health.status])} />
      {healthLabel(health)}
    </span>
  )
}
