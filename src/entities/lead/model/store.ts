import { channelInfo } from "@/entities/channel/@x/lead"
import { createStore, useStore } from "@/shared/lib/store"

import { mockGeneratedDraft, mockLeads } from "../api/mock-leads"
import type { Lead } from "./types"

const leadStore = createStore({ leads: mockLeads })

function patchLead(id: string, patch: Partial<Lead>) {
  leadStore.setState(({ leads }) => ({ leads: leads.map((lead) => (lead.id === id ? { ...lead, ...patch } : lead)) }))
}

function findLead(id: string) {
  return leadStore.getState().leads.find((lead) => lead.id === id)
}

export function useLeads() {
  return useStore(leadStore, (state) => state.leads)
}

export function useLead(id: string | undefined) {
  return useStore(leadStore, (state) => state.leads.find((lead) => lead.id === id))
}

export const leadActions = {
  /** Manual channels move to "approved" (post by hand); X replies post right away. */
  approve(id: string): "approved" | "posted" | undefined {
    const lead = findLead(id)
    if (!lead) return undefined
    const status = channelInfo[lead.source].manual ? "approved" : "posted"
    patchLead(id, { status })
    return status
  },
  skip(id: string, reason: string) {
    patchLead(id, { status: "skipped", skipReason: reason })
  },
  restore(id: string) {
    const lead = findLead(id)
    if (lead) patchLead(id, { status: lead.draft ? "pending" : "nodraft", skipReason: undefined })
  },
  markPosted(id: string) {
    patchLead(id, { status: "posted" })
  },
  saveDraft(id: string, draft: string) {
    patchLead(id, { draft, edited: true })
  },
  generateDraft(id: string) {
    patchLead(id, { status: "pending", ...mockGeneratedDraft })
  },
}
