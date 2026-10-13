import { cn } from "@/shared/lib/utils"

export function WorkspaceAvatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground",
        className,
      )}
    >
      {initials}
    </span>
  )
}
