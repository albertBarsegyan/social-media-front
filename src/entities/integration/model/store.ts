import { createStore, useStore } from "@/shared/lib/store"

import { mockIntegrations } from "../api/mock-integrations"

/**
 * Workspaces whose Instagram token was refreshed in this session. A workspace
 * reports a broken channel through its health; reconnecting clears it here.
 */
const integrationStore = createStore({ integrations: mockIntegrations, reconnected: [] as string[] })

export function useIntegrations() {
  return useStore(integrationStore, (state) => state.integrations)
}

export function useIsReconnected(workspaceId: string) {
  return useStore(integrationStore, (state) => state.reconnected.includes(workspaceId))
}

export const integrationActions = {
  reconnect: (workspaceId: string) =>
    integrationStore.setState((state) => ({ reconnected: [...state.reconnected, workspaceId] })),
}
