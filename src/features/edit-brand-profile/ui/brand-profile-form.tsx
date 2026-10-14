"use client"

import { useCatalog } from "@/entities/catalog"
import type { BrandProfileInput, Locale } from "@/shared/api"
import { localeNames } from "@/shared/config"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { TagInput } from "@/shared/ui/tag-input"
import { Textarea } from "@/shared/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"

const languageOrder: Locale[] = ["hy", "ru", "en"]

/** What the AI reads before writing any reply or post. Controlled; saving is up to the caller. */
export function BrandProfileForm({
  value,
  onChange,
  disabled = false,
}: {
  value: BrandProfileInput
  onChange: (value: BrandProfileInput) => void
  disabled?: boolean
}) {
  const tones = useCatalog().data?.tones ?? []
  const update = (patch: Partial<BrandProfileInput>) => onChange({ ...value, ...patch })

  return (
    <fieldset disabled={disabled} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="brand-offer">What you offer</Label>
        <Textarea id="brand-offer" rows={3} maxLength={2000} value={value.offer} onChange={(e) => update({ offer: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand-audience">Who it’s for</Label>
        <Textarea
          id="brand-audience"
          rows={2}
          maxLength={2000}
          value={value.audience}
          onChange={(e) => update({ audience: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label id="brand-tone">Tone</Label>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          aria-labelledby="brand-tone"
          value={value.tones}
          onValueChange={(next) => update({ tones: next })}
          className="flex-wrap"
        >
          {tones.map((tone) => (
            <ToggleGroupItem key={tone} value={tone} className="px-3">
              {tone}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Languages</legend>
        <div className="flex flex-wrap gap-4">
          {languageOrder.map((lang) => (
            <label key={lang} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={value.languages.includes(lang)}
                onCheckedChange={(checked) =>
                  update({ languages: checked ? [...value.languages, lang] : value.languages.filter((l) => l !== lang) })
                }
              />
              {localeNames[lang]}
            </label>
          ))}
        </div>
        {value.languages.length === 0 ? <p className="text-xs text-destructive">Pick at least one language.</p> : null}
      </fieldset>
      <div className="space-y-2">
        <Label>Banned phrases</Label>
        <p className="text-xs text-muted-foreground">Drafts containing these are blocked before you see them.</p>
        <TagInput
          aria-label="Banned phrases"
          value={value.bannedPhrases}
          onChange={(bannedPhrases) => update({ bannedPhrases })}
          placeholder="Type and press Enter"
        />
      </div>
    </fieldset>
  )
}
