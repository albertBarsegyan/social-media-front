import { api } from "./client"
import type { Bundle, Money } from "./types"

export interface Invoice {
  id: string
  /** YYYY-MM-DD */
  issuedOn: string
  kind: "setup_fee" | "subscription"
  amount: Money
  status: "paid" | "open"
}

export interface Billing {
  bundle: Bundle
  monthlyPrice: Money
  setupFee: Money
  upgradeTo: Bundle | null
  invoices: Invoice[]
}

export const billingApi = {
  get: (wid: string) => api.get(`workspaces/${wid}/billing`).json<Billing>(),
}
