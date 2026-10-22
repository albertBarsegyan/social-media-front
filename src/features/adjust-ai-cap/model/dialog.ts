import { createStore, useStore } from "@/shared/lib/store"

const dialogStore = createStore({ open: false })

export function useRaiseCapOpen() {
  return useStore(dialogStore, (state) => state.open)
}

export function setRaiseCapOpen(open: boolean) {
  dialogStore.setState({ open })
}
