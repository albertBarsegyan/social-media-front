"use client"

import type { ReactNode } from "react"

import { aiBudgetActions, formatMoney, useAiBudget } from "@/entities/ai-budget"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Switch } from "@/shared/ui/switch"

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

export function CapSettings() {
  const budget = useAiBudget()
  return (
    <div className="space-y-4">
      <SettingRow id="ai-cap" title="Monthly cap" description="Leads plan includes $6 of AI usage">
        <Input
          id="ai-cap"
          className="w-28 text-right"
          inputMode="decimal"
          defaultValue={formatMoney(budget.cap)}
          onBlur={(event) => {
            const cap = Number.parseFloat(event.target.value.replace(/[^0-9.]/g, ""))
            if (Number.isFinite(cap) && cap > 0) aiBudgetActions.raiseCap(cap)
          }}
        />
      </SettingRow>
      <SettingRow id="ai-hard-cap" title="Pause AI when the cap is reached" description="Drafts already written stay approvable">
        <Switch id="ai-hard-cap" checked={budget.hardCap} onCheckedChange={aiBudgetActions.setHardCap} />
      </SettingRow>
      <SettingRow id="ai-alert" title="Alert in Telegram at 80%">
        <Switch id="ai-alert" checked={budget.alertAt80} onCheckedChange={aiBudgetActions.setAlertAt80} />
      </SettingRow>
    </div>
  )
}
