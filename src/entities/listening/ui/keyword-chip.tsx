import type { Locale } from "@/shared/config"

export function KeywordChip({ lang, term }: { lang: Locale; term: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs">
      <span className="font-mono text-[10px] text-muted-foreground uppercase">{lang}</span>
      {term}
    </span>
  )
}
