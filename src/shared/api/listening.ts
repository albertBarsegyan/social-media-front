import { api } from "./client"
import type { ListeningChannel, Locale } from "./types"

export interface KeywordTerm {
  lang: Locale
  term: string
}

export interface KeywordSet {
  id: string
  name: string
  enabled: boolean
  terms: KeywordTerm[]
  createdAt: string
}

export interface ListeningSource {
  id: string
  channel: ListeningChannel
  name: string
  enabled: boolean
  createdAt: string
}

export interface ListeningConfig {
  keywordSets: KeywordSet[]
  negativeKeywords: string[]
  sources: ListeningSource[]
  estimatedWeeklyMatches: number
  scanIntervalMinutes: number
}

export const listeningApi = {
  get: (wid: string) => api.get(`workspaces/${wid}/listening`).json<ListeningConfig>(),
  createKeywordSet: (wid: string, input: { name: string; enabled?: boolean; terms: KeywordTerm[] }) =>
    api.post(`workspaces/${wid}/keyword-sets`, { json: input }).json<KeywordSet>(),
  updateKeywordSet: (wid: string, id: string, input: Partial<Pick<KeywordSet, "name" | "enabled" | "terms">>) =>
    api.patch(`workspaces/${wid}/keyword-sets/${id}`, { json: input }).json<KeywordSet>(),
  deleteKeywordSet: (wid: string, id: string) => api.delete(`workspaces/${wid}/keyword-sets/${id}`).then(() => undefined),
  setNegativeKeywords: (wid: string, terms: string[]) =>
    api.put(`workspaces/${wid}/negative-keywords`, { json: { terms } }).json<{ terms: string[] }>(),
  createSource: (wid: string, input: { channel: ListeningChannel; name: string; enabled?: boolean }) =>
    api.post(`workspaces/${wid}/sources`, { json: input }).json<ListeningSource>(),
  updateSource: (wid: string, id: string, input: Partial<Pick<ListeningSource, "name" | "enabled">>) =>
    api.patch(`workspaces/${wid}/sources/${id}`, { json: input }).json<ListeningSource>(),
  deleteSource: (wid: string, id: string) => api.delete(`workspaces/${wid}/sources/${id}`).then(() => undefined),
}
