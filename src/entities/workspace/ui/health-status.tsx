import { cn } from "@/shared/lib/utils"

import type { WorkspaceHealth } from "../model/types"

const dotClasses: Record<WorkspaceHealth, string> = {
  ok: "bg-success",
  warn: "bg-warning",
  err: "bg-destructive",
  setup: "bg-ring",
}

export function HealthStatus({ health, label, className }: { health: WorkspaceHealth; label: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dotClasses[health])} />
      {label}
    </span>
  )
}
