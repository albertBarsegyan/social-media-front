import { Avatar, AvatarFallback } from "@/shared/ui/avatar"

import type { Viewer } from "../model/viewer"

export function ViewerBadge({ viewer }: { viewer: Viewer }) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar className="size-7">
        <AvatarFallback className="text-xs">{viewer.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-medium">{viewer.name}</div>
        <div className="truncate text-xs text-muted-foreground">{viewer.roleLabel}</div>
      </div>
    </div>
  )
}
