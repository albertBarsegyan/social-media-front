import type { Member } from "@/shared/api"
import { initials } from "@/shared/lib/format"
import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"

import { roleLabels, roleScopes } from "../config/roles"

export function MemberRow({ member }: { member: Member }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <Avatar>
        <AvatarFallback>{initials(member.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{member.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {member.email} · {member.telegramLinked ? "Web + Telegram" : "Web"}
        </div>
      </div>
      <div className="hidden max-w-56 text-xs text-muted-foreground sm:block">{roleScopes[member.role]}</div>
      <Badge variant="secondary">{roleLabels[member.role]}</Badge>
    </div>
  )
}
