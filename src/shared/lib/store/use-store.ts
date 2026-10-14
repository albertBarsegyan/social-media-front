"use client"

import { useSyncExternalStore } from "react"

import type { Store } from "./create-store"

/** Selectors run on the stable snapshot, so they may freely derive new arrays. */
export function useStore<S extends object, T>(store: Store<S>, selector: (state: S) => T): T {
  const state = useSyncExternalStore(store.subscribe, store.getState, store.getState)
  return selector(state)
}
