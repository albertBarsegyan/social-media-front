import { createStore, useStore } from "@/shared/lib/store"

const dialogStore = createStore({ open: false })

export function useWorkspaceSwitcherOpen() {
  return useStore(dialogStore, (state) => state.open)
}

export function setWorkspaceSwitcherOpen(open: boolean) {
  dialogStore.setState({ open })
}
