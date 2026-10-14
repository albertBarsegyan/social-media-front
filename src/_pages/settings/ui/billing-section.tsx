"use client"

import { useBilling } from "@/entities/billing"
import { bundleDescriptions, bundleLabels, useCurrentWorkspace } from "@/entities/workspace"
import { formatDate, formatMoney } from "@/shared/lib/format"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"
import { ErrorState } from "@/shared/ui/error-state"
import { Separator } from "@/shared/ui/separator"
import { Skeleton } from "@/shared/ui/skeleton"
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table"

import { SectionCard } from "./section-card"

export function BillingSection() {
  const { workspaceId, role } = useCurrentWorkspace()
  const billing = useBilling(workspaceId, { enabled: role === "operator" })

  if (role !== "operator") {
    return (
      <SectionCard title="Billing">
        <p className="text-sm text-muted-foreground">Only an operator can see billing for this workspace.</p>
      </SectionCard>
    )
  }
  if (billing.isPending) return <Skeleton className="h-64 rounded-xl" />
  if (billing.isError) return <ErrorState error={billing.error} onRetry={() => void billing.refetch()} />

  const plan = billing.data
  return (
    <div className="space-y-4">
      <SectionCard
        title="Current plan"
        description={`${bundleLabels[plan.bundle]} · ${formatMoney(plan.monthlyPrice)} / month`}
        action={
          plan.upgradeTo ? (
            <Button size="sm" variant="outline" disabled title="Plan changes aren’t available yet">
              Upgrade to {bundleLabels[plan.upgradeTo]}
            </Button>
          ) : null
        }
      >
        <p className="text-sm text-muted-foreground">{bundleDescriptions[plan.bundle]}</p>
        <Separator className="my-4" />
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Setup fee</dt>
            <dd className="mt-0.5 font-medium">{formatMoney(plan.setupFee)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Monthly</dt>
            <dd className="mt-0.5 font-medium">{formatMoney(plan.monthlyPrice)}</dd>
          </div>
        </dl>
      </SectionCard>
      <SectionCard title="Invoices">
        {plan.invoices.length === 0 ? (
          <EmptyState title="No invoices yet" description="Invoices appear here once payments are set up." />
        ) : (
          <Table>
            <TableBody>
              {plan.invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-xs">{formatDate(invoice.issuedOn)}</TableCell>
                  <TableCell>{invoice.kind === "setup_fee" ? "Setup fee" : "Subscription"}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatMoney(invoice.amount)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{invoice.status === "paid" ? "Paid" : "Open"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </SectionCard>
    </div>
  )
}
