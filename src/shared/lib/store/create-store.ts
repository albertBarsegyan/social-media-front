import { useSyncExternalStore } from "react"

type Updater<S> = Partial<S> | ((state: S) => Partial<S>)

export interface Store<S> {
  getState: () => S
  setState: (updater: Updater<S>) => void
  subscribe: (listener: () => void) => () => void
  reset: () => void
}

/**
 * Minimal client store for prototype data. Server renders always see the
 * initial state because mutations only happen in event handlers.
 */
export function createStore<S extends object>(initial: S): Store<S> {
  let state = initial
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (updater) => {
      const patch = typeof updater === "function" ? updater(state) : updater
      state = { ...state, ...patch }
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    reset: () => {
      state = initial
      listeners.forEach((listener) => listener())
    },
  }
}

/** Selectors run on the stable snapshot, so they may freely derive new arrays. */
export function useStore<S extends object, T>(store: Store<S>, selector: (state: S) => T): T {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState)
  return selector(state)
}
