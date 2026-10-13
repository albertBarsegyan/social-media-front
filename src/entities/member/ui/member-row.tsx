import { Avatar, AvatarFallback } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"

import type { Member } from "../model/types"

export function MemberRow({ member }: { member: Member }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-3">
      <Avatar>
        <AvatarFallback>{member.initials}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{member.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {member.email} · {member.via}
        </div>
      </div>
      <div className="hidden max-w-56 text-xs text-muted-foreground sm:block">{member.scope}</div>
      <Badge variant="secondary">{member.role}</Badge>
    </div>
  )
}
