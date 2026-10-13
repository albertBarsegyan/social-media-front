import type { KeywordSet, ListeningSource } from "../model/types"

/** Rough weekly match count used to preview the effect of toggles. */
export function estimateWeeklyMatches(sets: KeywordSet[], sources: ListeningSource[]) {
  return sets.filter((set) => set.on).length * 13 + sources.filter((source) => source.on).length * 2
}
