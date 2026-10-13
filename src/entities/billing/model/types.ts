export interface Plan {
  name: string
  price: string
  description: string
  upgradeTo: string
  setupFee: string
  nextInvoice: string
  payment: string
}

export interface Invoice {
  date: string
  description: string
  amount: string
  status: "Paid"
}
