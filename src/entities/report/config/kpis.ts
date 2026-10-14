import type { Kpis } from "@/shared/api"

export const kpiLabels: Record<keyof Kpis, string> = {
  buyingIntents: "Buying-intent posts",
  repliesSent: "Replies sent",
  linkClicks: "Link clicks",
  inquiries: "Inquiries",
  deals: "Deals",
}

export const kpiOrder: (keyof Kpis)[] = ["buyingIntents", "repliesSent", "linkClicks", "inquiries", "deals"]
