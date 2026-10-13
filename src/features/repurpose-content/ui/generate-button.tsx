"use client"

import { SparklesIcon } from "lucide-react"

import { Button } from "@/shared/ui/button"

export function GenerateButton({ paused, onGenerate }: { paused: boolean; onGenerate: () => void }) {
  return (
    <div className="space-y-2">
      <Button className="w-full" disabled={paused} onClick={onGenerate}>
        <SparklesIcon />
        Regenerate all 9 · ~$0.40
      </Button>
      {paused ? <p className="text-xs text-muted-foreground">AI budget reached — editing and approving still work.</p> : null}
    </div>
  )
}
