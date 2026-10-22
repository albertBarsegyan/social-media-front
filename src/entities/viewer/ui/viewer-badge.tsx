import type { User } from "@/shared/api"
import { initials } from "@/shared/lib/format"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"

export function ViewerBadge({ user, roleLabel }: { user: User; roleLabel?: string }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <Avatar className="size-7">
        <AvatarFallback className="text-xs">{initials(user.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-medium">{user.name}</div>
        <div className="truncate text-xs text-muted-foreground">{roleLabel ?? user.email}</div>
      </div>
    </div>
  )
}
