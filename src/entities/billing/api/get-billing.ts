import "server-only"

import type { Invoice, Plan } from "../model/types"

const plan: Plan = {
  name: "Leads",
  price: "$99 / month",
  description: "Content + buyer-intent monitoring and reply drafts approved in Telegram",
  upgradeTo: "Leads + Bookings",
  setupFee: "$150 · paid Sep 28",
  nextInvoice: "Nov 1 · ֏38,500",
  payment: "Bank transfer (AMD)",
}

const invoices: Invoice[] = [
  { date: "Oct 1, 2026", description: "Leads · October", amount: "֏38,500", status: "Paid" },
  { date: "Sep 28, 2026", description: "Setup fee", amount: "֏58,300", status: "Paid" },
]

export async function getBilling() {
  return { plan, invoices }
}
