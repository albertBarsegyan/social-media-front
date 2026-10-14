"use client"

import { SparklesIcon } from "lucide-react"

import { Button } from "@/shared/ui/button"

export function GenerateButton({
  label,
  paused,
  pending,
  onGenerate,
}: {
  label: string
  paused: boolean
  pending: boolean
  onGenerate: () => void
}) {
  return (
    <div className="space-y-2">
      <Button className="w-full" disabled={paused || pending} onClick={onGenerate}>
        <SparklesIcon />
        {pending ? "Generating…" : label}
      </Button>
      {paused ? <p className="text-xs text-muted-foreground">AI budget reached — editing and approving still work.</p> : null}
    </div>
  )
}
