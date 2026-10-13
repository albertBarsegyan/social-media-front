import "server-only"

import { mockLeads } from "./mock-leads"

/** Known lead ids, used to prerender lead pages. */
export async function getLeadIds() {
  return mockLeads.map((lead) => lead.id)
}
