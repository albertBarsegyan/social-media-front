"use client"

import { useCatalog } from "@/entities/catalog"
import { bundleDescriptions, bundleLabels } from "@/entities/workspace"
import type { CreateWorkspaceInput } from "@/shared/api"
import { formatMoney } from "@/shared/lib/format"
import { ChoiceCard } from "@/shared/ui/choice-card"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

const fields: { key: "name" | "businessType" | "city" | "trackingDomain"; label: string; placeholder: string; hint?: string }[] = [
  { key: "name", label: "Business name", placeholder: "Business name" },
  { key: "businessType", label: "Business type", placeholder: "Beauty salon" },
  { key: "city", label: "City", placeholder: "Yerevan" },
  { key: "trackingDomain", label: "Tracking domain", placeholder: "example.am/r/", hint: "No https://, ends with /" },
]

/** Onboarding step 1: basic details and the service bundle. Controlled by the wizard. */
export function WorkspaceBasicsForm({
  value,
  onChange,
}: {
  value: CreateWorkspaceInput
  onChange: (value: CreateWorkspaceInput) => void
}) {
  const bundles = useCatalog().data?.bundles.filter((bundle) => bundle.key !== "internal") ?? []
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={`ws-${field.key}`}>{field.label}</Label>
            <Input
              id={`ws-${field.key}`}
              required
              maxLength={field.key === "trackingDomain" ? 200 : 120}
              placeholder={field.placeholder}
              value={value[field.key]}
              onChange={(event) => onChange({ ...value, [field.key]: event.target.value })}
            />
            {field.hint ? <p className="text-xs text-muted-foreground">{field.hint}</p> : null}
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <Label id="ws-bundle">Service bundle</Label>
        <div role="radiogroup" aria-labelledby="ws-bundle" className="grid gap-2 sm:grid-cols-3">
          {bundles.map((bundle) => (
            <ChoiceCard
              key={bundle.key}
              selected={value.bundle === bundle.key}
              onClick={() => onChange({ ...value, bundle: bundle.key })}
              title={bundleLabels[bundle.key]}
              aside={`${formatMoney(bundle.monthlyPrice)}/mo`}
              description={bundleDescriptions[bundle.key]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
