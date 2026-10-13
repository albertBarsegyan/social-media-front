"use client"

import { useState } from "react"

import { serviceBundles } from "@/entities/workspace"
import { ChoiceCard } from "@/shared/ui/choice-card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

const fields = [
  { id: "ws-name", label: "Business name", value: "Mila Beauty Studio" },
  { id: "ws-type", label: "Business type", value: "Beauty salon" },
  { id: "ws-city", label: "City", value: "Yerevan" },
  { id: "ws-domain", label: "Tracking domain", value: "mila.am/r/" },
]

/** Onboarding step 1: basic details and the service bundle. */
export function WorkspaceBasicsForm() {
  const [bundle, setBundle] = useState("Leads")
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input id={field.id} defaultValue={field.value} />
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label id="ws-bundle">Service bundle</Label>
        <div role="radiogroup" aria-labelledby="ws-bundle" className="grid gap-2 sm:grid-cols-3">
          {serviceBundles.map((option) => (
            <ChoiceCard
              key={option.name}
              selected={bundle === option.name}
              onClick={() => setBundle(option.name)}
              title={option.name}
              aside={option.price}
              description={option.description}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
