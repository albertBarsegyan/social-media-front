import { createStore, useStore } from "@/shared/lib/store"

import { mockKeywordSets, mockNegativeKeywords, mockSources } from "../api/mock-listening"

const listeningStore = createStore({
  keywordSets: mockKeywordSets,
  negativeKeywords: mockNegativeKeywords,
  sources: mockSources,
})

export function useListeningConfig() {
  return useStore(listeningStore, (state) => state)
}

export const listeningActions = {
  toggleKeywordSet: (index: number, on: boolean) =>
    listeningStore.setState(({ keywordSets }) => ({
      keywordSets: keywordSets.map((set, i) => (i === index ? { ...set, on } : set)),
    })),
  toggleSource: (index: number, on: boolean) =>
    listeningStore.setState(({ sources }) => ({
      sources: sources.map((source, i) => (i === index ? { ...source, on } : source)),
    })),
}
