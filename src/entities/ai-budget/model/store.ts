import { createStore, useStore } from "@/shared/lib/store"

interface BudgetState {
  used: number
  cap: number
  /** Pause scoring and drafting once the cap is reached. */
  hardCap: boolean
  alertAt80: boolean
}

const budgetStore = createStore<BudgetState>({ used: 4.1, cap: 6, hardCap: true, alertAt80: true })

export interface BudgetSnapshot extends BudgetState {
  percent: number
  reached: boolean
  level: "normal" | "high" | "reached"
  breakdown: { label: string; value: string }[]
}

function snapshot(state: BudgetState): BudgetSnapshot {
  const percent = Math.min(100, Math.round((state.used / state.cap) * 100))
  const reached = state.used >= state.cap
  return {
    ...state,
    percent,
    reached,
    level: percent >= 100 ? "reached" : percent >= 80 ? "high" : "normal",
    breakdown: [
      { label: "Intent scoring · 1,840 posts", value: "$1.20" },
      { label: "Reply drafts · 46", value: "$1.35" },
      { label: "Repurposing · 3 sources", value: "$1.55" },
    ],
  }
}

export function useAiBudget() {
  return useStore(budgetStore, snapshot)
}

export const aiBudgetActions = {
  raiseCap: (cap: number) => budgetStore.setState({ cap }),
  setHardCap: (hardCap: boolean) => budgetStore.setState({ hardCap }),
  setAlertAt80: (alertAt80: boolean) => budgetStore.setState({ alertAt80 }),
  isReached: () => snapshot(budgetStore.getState()).reached,
}

export function formatMoney(value: number) {
  return `$${value.toFixed(2)}`
}
