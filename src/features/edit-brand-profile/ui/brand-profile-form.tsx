"use client"

import { brandProfileActions, toneOptions, useBrandProfile } from "@/entities/brand-profile"
import { localeNames, type Locale } from "@/shared/config"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { Checkbox } from "@/shared/ui/checkbox"
import { Label } from "@/shared/ui/label"
import { TagInput } from "@/shared/ui/tag-input"
import { Textarea } from "@/shared/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group"

const languageOrder: Locale[] = ["hy", "ru", "en"]

/** What the AI reads before writing any reply or post. Used in Settings and Onboarding. */
export function BrandProfileForm({ showSave = false }: { showSave?: boolean }) {
  const profile = useBrandProfile()
  const { update } = brandProfileActions

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="brand-offer">What you offer</Label>
        <Textarea id="brand-offer" rows={3} value={profile.offer} onChange={(event) => update({ offer: event.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="brand-audience">Who it’s for</Label>
        <Textarea
          id="brand-audience"
          rows={2}
          value={profile.audience}
          onChange={(event) => update({ audience: event.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label id="brand-tone">Tone</Label>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          aria-labelledby="brand-tone"
          value={profile.tones}
          onValueChange={(tones) => update({ tones })}
          className="flex-wrap"
        >
          {toneOptions.map((tone) => (
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
                checked={profile.languages.includes(lang)}
                onCheckedChange={(checked) =>
                  update({
                    languages: checked ? [...profile.languages, lang] : profile.languages.filter((l) => l !== lang),
                  })
                }
              />
              {localeNames[lang]}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label>Banned phrases</Label>
        <p className="text-xs text-muted-foreground">Drafts containing these are blocked before you see them.</p>
        <TagInput
          aria-label="Banned phrases"
          value={profile.bannedPhrases}
          onChange={(bannedPhrases) => update({ bannedPhrases })}
          placeholder="Type and press Enter"
        />
      </div>
      {showSave ? <Button onClick={() => toast("Saved")}>Save profile</Button> : null}
    </div>
  )
}
