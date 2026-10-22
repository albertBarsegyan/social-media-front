"use client"

import type { ReactNode } from "react"

import type { AiBudget } from "@/entities/ai-budget"
import { bundleLabels, useCurrentWorkspace } from "@/entities/workspace"
import { formatUsdMicros } from "@/shared/lib/format"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"

import { useUpdateAiBudget } from "../api/mutations"

function SettingRow({ id, title, description, children }: { id: string; title: string; description?: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor={id}>{title}</Label>
        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </div>
  )
}

/** Cap, hard-stop and alert settings. Read-only for non-operators. */
export function CapSettings({ budget }: { budget: AiBudget }) {
  const { workspaceId, workspace, role } = useCurrentWorkspace()
  const update = useUpdateAiBudget(workspaceId)
  const readOnly = role !== "operator" || update.isPending

  return (
    <div className="space-y-4">
      <SettingRow id="ai-cap" title="Monthly cap" description={`${bundleLabels[workspace.bundle]} plan`}>
        <Input
          // Remount when the saved value changes so the field shows it.
          key={budget.capUsdMicros}
          id="ai-cap"
          className="w-28 text-right"
          inputMode="decimal"
          disabled={readOnly}
          defaultValue={formatUsdMicros(budget.capUsdMicros)}
          onBlur={(event) => {
            const dollars = Number.parseFloat(event.target.value.replace(/[^0-9.]/g, ""))
            const micros = Math.round(dollars * 1_000_000)
            if (Number.isFinite(dollars) && micros > 0 && micros !== budget.capUsdMicros) {
              update.mutate({ capUsdMicros: micros })
            }
          }}
        />
      </SettingRow>
      <SettingRow id="ai-hard-cap" title="Pause AI when the cap is reached" description="Drafts already written stay approvable">
        <Switch
          id="ai-hard-cap"
          disabled={readOnly}
          checked={budget.hardCap}
          onCheckedChange={(hardCap) => update.mutate({ hardCap })}
        />
      </SettingRow>
      <SettingRow id="ai-alert" title="Alert in Telegram at 80%">
        <Switch
          id="ai-alert"
          disabled={readOnly}
          checked={budget.alertAt80}
          onCheckedChange={(alertAt80) => update.mutate({ alertAt80 })}
        />
      </SettingRow>
    </div>
  )
}
