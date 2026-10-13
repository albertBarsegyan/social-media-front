import { getBilling } from "@/entities/billing/index.server"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Separator } from "@/shared/ui/separator"
import { Table, TableBody, TableCell, TableRow } from "@/shared/ui/table"

import { SectionCard } from "./section-card"

export async function BillingSection() {
  const { plan, invoices } = await getBilling()
  return (
    <div className="space-y-4">
      <SectionCard
        title="Current plan"
        description={`${plan.name} · ${plan.price}`}
        action={
          <Button size="sm" variant="outline" disabled title="Plan changes aren’t available in the prototype">
            Upgrade to {plan.upgradeTo}
          </Button>
        }
      >
        <p className="text-sm text-muted-foreground">{plan.description}</p>
        <Separator className="my-4" />
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          {[
            ["Setup fee", plan.setupFee],
            ["Next invoice", plan.nextInvoice],
            ["Payment", plan.payment],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </SectionCard>
      <SectionCard title="Invoices">
        <Table>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.date}>
                <TableCell className="font-mono text-xs">{invoice.date}</TableCell>
                <TableCell>{invoice.description}</TableCell>
                <TableCell className="text-right tabular-nums">{invoice.amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{invoice.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </SectionCard>
    </div>
  )
}
