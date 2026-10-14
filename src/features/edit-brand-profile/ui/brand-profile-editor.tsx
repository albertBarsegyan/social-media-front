"use client"

import { useState } from "react"

import { useBrandProfile, type BrandProfile, type BrandProfileInput } from "@/entities/brand-profile"
import { toast } from "@/shared/lib/toast"
import { Button } from "@/shared/ui/button"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

import { useSaveBrandProfile } from "../api/mutations"
import { BrandProfileForm } from "./brand-profile-form"

const toInput = ({ offer, audience, tones, languages, bannedPhrases }: BrandProfile): BrandProfileInput => ({
  offer,
  audience,
  tones,
  languages,
  bannedPhrases,
})

function Editor({ wid, profile, canEdit }: { wid: string; profile: BrandProfile; canEdit: boolean }) {
  const [draft, setDraft] = useState(() => toInput(profile))
  const save = useSaveBrandProfile(wid)
  const dirty = JSON.stringify(draft) !== JSON.stringify(toInput(profile))

  return (
    <div className="space-y-5">
      <BrandProfileForm value={draft} onChange={setDraft} disabled={!canEdit} />
      {canEdit ? (
        <div className="flex items-center gap-3">
          <Button
            disabled={!dirty || save.isPending || draft.languages.length === 0}
            onClick={() => save.mutate(draft, { onSuccess: () => toast("Brand profile saved") })}
          >
            {save.isPending ? "Saving…" : "Save profile"}
          </Button>
          {dirty ? <span className="text-xs text-muted-foreground">Unsaved changes</span> : null}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Only an operator can edit the brand profile.</p>
      )}
    </div>
  )
}

/** Settings → Brand profile: loads, edits and saves. */
export function BrandProfileEditor({ wid, canEdit }: { wid: string; canEdit: boolean }) {
  const query = useBrandProfile(wid)
  if (query.isPending) return <Skeleton className="h-80 rounded-lg" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  // Remount with the saved profile so the form resets after a save or a workspace switch.
  return <Editor key={`${wid}-${query.data.updatedAt}`} wid={wid} profile={query.data} canEdit={canEdit} />
}
