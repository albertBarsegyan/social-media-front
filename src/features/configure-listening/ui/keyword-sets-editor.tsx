"use client"

import { KeywordChip, type ListeningConfig } from "@/entities/listening"
import { Switch } from "@/shared/ui/switch"

import { useToggleKeywordSet } from "../api/mutations"

export function KeywordSetsEditor({
  wid,
  config,
  canEdit,
  showNegative = false,
}: {
  wid: string
  config: ListeningConfig
  canEdit: boolean
  showNegative?: boolean
}) {
  const toggle = useToggleKeywordSet(wid)
  return (
    <div className="space-y-3">
      {config.keywordSets.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          No keyword sets yet. They’re phrases buyers use when asking for a recommendation, grouped by service.
        </p>
      ) : null}
      {config.keywordSets.map((set) => (
        <div key={set.id} className="rounded-lg border p-3">
          <label className="flex items-center gap-3">
            <Switch
              checked={set.enabled}
              disabled={!canEdit}
              onCheckedChange={(enabled) => toggle.mutate({ id: set.id, enabled })}
            />
            <span className="text-sm font-medium">{set.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{set.terms.length} phrases</span>
          </label>
          {set.terms.length ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {set.terms.map(({ lang, term }) => (
                <KeywordChip key={`${lang}-${term}`} lang={lang} term={term} />
              ))}
            </div>
          ) : null}
        </div>
      ))}
      {showNegative ? (
        <div className="rounded-lg border border-dashed p-3">
          <div className="text-sm font-medium">Negative keywords</div>
          {config.negativeKeywords.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {config.negativeKeywords.map((term) => (
                <span key={term} className="rounded-md bg-muted px-2 py-0.5 text-xs line-through decoration-muted-foreground">
                  {term}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">None. Posts containing these words are scored 0.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}
