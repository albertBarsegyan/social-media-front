"use client"

import { useState } from "react"

import { aiBudgetActions, aiUnitCosts, capOptions } from "@/entities/ai-budget"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { ChoiceCard } from "@/shared/ui/choice-card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

import { setRaiseCapOpen, useRaiseCapOpen } from "../model/dialog"

export function RaiseCapDialog() {
  const open = useRaiseCapOpen()
  const [cap, setCap] = useState(10)

  const raise = () => {
    aiBudgetActions.raiseCap(cap)
    setRaiseCapOpen(false)
    toast(`Cap raised to $${cap} · scoring resumed`)
  }

  return (
    <Dialog open={open} onOpenChange={setRaiseCapOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Raise this month’s AI cap</DialogTitle>
          <DialogDescription>
            Scoring costs about {aiUnitCosts.scoring}, a reply draft about {aiUnitCosts.draft}. The cap protects your
            margin on the Leads plan.
          </DialogDescription>
        </DialogHeader>
        <div role="radiogroup" aria-label="New monthly cap" className="grid grid-cols-3 gap-2">
          {capOptions.map((option) => (
            <ChoiceCard
              key={option.cap}
              selected={cap === option.cap}
              onClick={() => setCap(option.cap)}
              title={`$${option.cap}`}
              description={option.note}
            />
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setRaiseCapOpen(false)}>
            Keep paused
          </Button>
          <Button onClick={raise}>Raise cap</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
