"use client"

import { useState } from "react"

import { useCatalog } from "@/entities/catalog"
import { useAiBudget } from "@/entities/ai-budget"
import { useCurrentWorkspace } from "@/entities/workspace"
import { formatUsdMicros } from "@/shared/lib/format"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { ChoiceCard } from "@/shared/ui/choice-card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/shared/ui/dialog"

import { useUpdateAiBudget } from "../api/mutations"
import { setRaiseCapOpen, useRaiseCapOpen } from "../model/dialog"

export function RaiseCapDialog() {
  const open = useRaiseCapOpen()
  const { workspaceId, role } = useCurrentWorkspace()
  const catalog = useCatalog().data
  const budget = useAiBudget(workspaceId).data
  const update = useUpdateAiBudget(workspaceId)
  const [choice, setChoice] = useState<number>()

  const options = (catalog?.aiCapOptionsUsdMicros ?? []).filter((cap) => !budget || cap > budget.capUsdMicros)
  const cap = choice ?? options[0]
  const draftCost = catalog?.aiUnitCostsUsdMicros.draft

  const raise = () => {
    if (!cap) return
    update.mutate(
      { capUsdMicros: cap },
      {
        onSuccess: () => {
          setRaiseCapOpen(false)
          toast(`Cap raised to ${formatUsdMicros(cap)} · AI resumed`)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setRaiseCapOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise this month’s AI cap</DialogTitle>
          <DialogDescription>
            {catalog
              ? `Scoring costs about ${formatUsdMicros(catalog.aiUnitCostsUsdMicros.scoring)} per post, a reply draft about ${formatUsdMicros(catalog.aiUnitCostsUsdMicros.draft)}.`
              : null}{" "}
            The cap protects the plan’s margin.
          </DialogDescription>
        </DialogHeader>
        {role !== "operator" ? (
          <p className="text-sm text-muted-foreground">Only an operator can change the cap.</p>
        ) : options.length === 0 ? (
          <p className="text-sm text-muted-foreground">The cap is already above the preset options. Change it in Settings → Usage.</p>
        ) : (
          <div role="radiogroup" aria-label="New monthly cap" className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <ChoiceCard
                key={option}
                selected={cap === option}
                onClick={() => setChoice(option)}
                title={formatUsdMicros(option)}
                description={
                  draftCost && budget ? `≈ +${Math.floor((option - budget.capUsdMicros) / draftCost)} drafts` : undefined
                }
              />
            ))}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => setRaiseCapOpen(false)}>
            Keep paused
          </Button>
          <Button disabled={role !== "operator" || !cap || update.isPending} onClick={raise}>
            Raise cap
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
