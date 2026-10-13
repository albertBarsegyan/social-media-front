"use client"

import { KeywordChip, listeningActions, useListeningConfig } from "@/entities/listening"
import { Switch } from "@/shared/ui/switch"

export function KeywordSetsEditor({ showNegative = false }: { showNegative?: boolean }) {
  const { keywordSets, negativeKeywords } = useListeningConfig()
  return (
    <div className="space-y-3">
      {keywordSets.map((set, index) => (
        <div key={set.name} className="rounded-lg border p-3">
          <label className="flex items-center gap-3">
            <Switch checked={set.on} onCheckedChange={(on) => listeningActions.toggleKeywordSet(index, on)} />
            <span className="text-sm font-medium">{set.name}</span>
            <span className="ml-auto text-xs text-muted-foreground">{set.terms.length} phrases</span>
          </label>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {set.terms.map(([lang, term]) => (
              <KeywordChip key={term} lang={lang} term={term} />
            ))}
          </div>
        </div>
      ))}
      {showNegative ? (
        <div className="rounded-lg border border-dashed p-3">
          <div className="text-sm font-medium">Negative keywords</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {negativeKeywords.map((term) => (
              <span key={term} className="rounded-md bg-muted px-2 py-0.5 text-xs line-through decoration-muted-foreground">
                {term}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
