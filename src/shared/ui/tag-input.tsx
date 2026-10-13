"use client"

import { XIcon } from "lucide-react"
import { useState, type KeyboardEvent } from "react"

import { cn } from "@/shared/lib/utils"

interface TagInputProps {
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  className?: string
  "aria-label"?: string
}

export function TagInput({ value, onChange, placeholder, className, ...props }: TagInputProps) {
  const [draft, setDraft] = useState("")

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const next = draft.trim()
    if (event.key === "Enter" && next) {
      event.preventDefault()
      if (!value.includes(next)) onChange([...value, next])
      setDraft("")
    } else if (event.key === "Backspace" && !draft && value.length) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 shadow-xs focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        className,
      )}
    >
      {value.map((tag) => (
        <span key={tag} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((t) => t !== tag))}
            className="text-muted-foreground hover:text-foreground"
            aria-label={`Remove ${tag}`}
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={props["aria-label"]}
        className="min-w-32 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  )
}
