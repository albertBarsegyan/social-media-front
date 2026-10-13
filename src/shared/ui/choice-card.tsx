import type { ComponentProps, ReactNode } from "react"

import { cn } from "@/shared/lib/utils"

interface ChoiceCardProps extends Omit<ComponentProps<"button">, "title"> {
  selected: boolean
  title: ReactNode
  aside?: ReactNode
  description?: ReactNode
}

/** A selectable card used as a single-choice radio option. */
export function ChoiceCard({ selected, title, aside, description, className, ...props }: ChoiceCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "border-foreground ring-1 ring-foreground",
        className,
      )}
      {...props}
    >
      <span className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-medium">{title}</span>
        {aside ? <span className="text-sm text-muted-foreground">{aside}</span> : null}
      </span>
      {description ? <span className="text-xs text-muted-foreground">{description}</span> : null}
    </button>
  )
}
