"use client"

import { CheckIcon } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { useBrandProfile } from "@/entities/brand-profile"
import { useListeningConfig } from "@/entities/listening"
import { useWorkspace, useWorkspaces, workspaceCookie, type Workspace } from "@/entities/workspace"
import { KeywordSetsEditor, SourcesEditor } from "@/features/configure-listening"
import { ConnectChannelsStep } from "@/features/connect-integration"
import { useCreateWorkspace, useUpdateWorkspace, WorkspaceBasicsForm } from "@/features/create-workspace"
import { BrandProfileForm, useSaveBrandProfile } from "@/features/edit-brand-profile"
import type { BrandProfileInput, CreateWorkspaceInput } from "@/shared/api"
import { routes } from "@/shared/config"
import { setClientCookie } from "@/shared/lib/cookies"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { ErrorState } from "@/shared/ui/error-state"
import { Skeleton } from "@/shared/ui/skeleton"

const steps = [
  { label: "Workspace", title: "Workspace", description: "One workspace per client. Leads, drafts, budget and reports stay separate." },
  { label: "Brand profile", title: "Brand profile", description: "The AI reads this before writing any reply or post. Be specific." },
  { label: "Channels", title: "Connect channels", description: "Publishing goes through Buffer. Approvals and alerts go to Telegram." },
  { label: "Keywords & sources", title: "Keywords & sources", description: "What to listen for, and where." },
] as const

const emptyBasics: CreateWorkspaceInput = { name: "", businessType: "", city: "", trackingDomain: "", bundle: "leads" }
const basicsOf = ({ name, businessType, city, trackingDomain, bundle }: Workspace): CreateWorkspaceInput => ({
  name,
  businessType,
  city,
  trackingDomain,
  bundle,
})

function Footer({ step, busy, canContinue, onBack, onNext, nextLabel }: {
  step: number
  busy: boolean
  canContinue: boolean
  onBack?: () => void
  onNext: () => void
  nextLabel: string
}) {
  return (
    <div className="mt-8 flex items-center gap-2 border-t pt-4">
      <span className="flex-1 text-sm text-muted-foreground">
        Step {step + 1} of {steps.length}
      </span>
      {onBack ? (
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
      ) : null}
      <Button disabled={busy || !canContinue} onClick={onNext}>
        {busy ? "Saving…" : nextLabel}
      </Button>
    </div>
  )
}

function BasicsStep({ workspace, onDone }: { workspace?: Workspace; onDone: (workspace: Workspace) => void }) {
  const [value, setValue] = useState(() => (workspace ? basicsOf(workspace) : emptyBasics))
  const create = useCreateWorkspace()
  const update = useUpdateWorkspace()
  const complete = Object.values(value).every((field) => String(field).trim())
  return (
    <>
      <WorkspaceBasicsForm value={value} onChange={setValue} />
      <Footer
        step={0}
        busy={create.isPending || update.isPending}
        canContinue={complete}
        nextLabel="Continue"
        onNext={() =>
          workspace
            ? update.mutate({ wid: workspace.id, input: { ...value, onboardingStep: Math.max(2, workspace.onboardingStep) } }, { onSuccess: onDone })
            : create.mutate(value, {
                onSuccess: (created) =>
                  update.mutate({ wid: created.id, input: { onboardingStep: 2 } }, { onSuccess: onDone }),
              })
        }
      />
    </>
  )
}

function BrandStep({ wid, onBack, onDone }: { wid: string; onBack: () => void; onDone: () => void }) {
  const query = useBrandProfile(wid)
  if (query.isPending) return <Skeleton className="h-80 rounded-lg" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  const { offer, audience, tones, languages, bannedPhrases } = query.data
  return (
    <BrandForm
      wid={wid}
      initial={{ offer, audience, tones, languages: languages.length ? languages : ["hy", "ru", "en"], bannedPhrases }}
      onBack={onBack}
      onDone={onDone}
    />
  )
}

function BrandForm({ wid, initial, onBack, onDone }: { wid: string; initial: BrandProfileInput; onBack: () => void; onDone: () => void }) {
  const [value, setValue] = useState(initial)
  const save = useSaveBrandProfile(wid)
  return (
    <>
      <BrandProfileForm value={value} onChange={setValue} />
      <Footer
        step={1}
        busy={save.isPending}
        canContinue={value.languages.length > 0}
        nextLabel="Continue"
        onBack={onBack}
        onNext={() => save.mutate(value, { onSuccess: onDone })}
      />
    </>
  )
}

function ListeningStep({ wid }: { wid: string }) {
  const query = useListeningConfig(wid)
  if (query.isPending) return <Skeleton className="h-64 rounded-lg" />
  if (query.isError) return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  return (
    <div className="space-y-4">
      <KeywordSetsEditor wid={wid} config={query.data} canEdit />
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium">Sources</div>
        <SourcesEditor wid={wid} config={query.data} canEdit />
      </div>
      <p className="text-sm text-muted-foreground">
        Estimated <b className="text-foreground">~{query.data.estimatedWeeklyMatches} buying-intent posts a week</b> at these settings.
      </p>
    </div>
  )
}

/** Four-step setup for a new client workspace, or resumes `?workspace=<id>`. Every step is saved. */
export function OnboardingWizard() {
  const router = useRouter()
  const params = useSearchParams()
  const [wid, setWid] = useState<string | undefined>(params.get("workspace") ?? undefined)
  const workspace = useWorkspace(wid)
  const hasWorkspaces = (useWorkspaces().data?.pages[0]?.items.length ?? 0) > 0
  const [stepChoice, setStep] = useState<number>()
  const update = useUpdateWorkspace()

  // Resume where the workspace left off.
  const step = stepChoice ?? (workspace.data ? Math.min(steps.length, workspace.data.onboardingStep) - 1 : 0)
  const maxStep = workspace.data ? workspace.data.onboardingStep - 1 : 0
  const current = steps[step]

  const advance = (to: number) => {
    if (!wid) return
    update.mutate({ wid, input: { onboardingStep: Math.max(to + 1, workspace.data?.onboardingStep ?? 1) } }, { onSuccess: () => setStep(to) })
  }

  const finish = () => {
    if (!wid) return
    update.mutate(
      { wid, input: { onboardingStep: steps.length, onboardingCompleted: true } },
      {
        onSuccess: (done) => {
          setClientCookie(workspaceCookie, done.id)
          toast(`${done.name} is ready`)
          router.push(routes.dashboard)
        },
      },
    )
  }

  if (wid && workspace.isError) return <ErrorState className="m-6" error={workspace.error} onRetry={() => void workspace.refetch()} />
  if (wid && workspace.isPending) return <Skeleton className="m-6 h-[60vh] rounded-xl" />

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
        <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">N</span>
        <span className="flex-1 truncate text-sm font-semibold">{workspace.data?.name ?? "New client workspace"}</span>
        {hasWorkspaces ? (
          <Button variant="ghost" size="sm" asChild>
            <Link href={routes.dashboard}>Exit</Link>
          </Button>
        ) : null}
      </header>
      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-8 md:grid-cols-[200px_minmax(0,1fr)] md:px-6">
        <ol className="flex gap-2 overflow-x-auto md:flex-col">
          {steps.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                disabled={index > maxStep}
                onClick={() => setStep(index)}
                aria-current={index === step ? "step" : undefined}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm whitespace-nowrap",
                  index === step ? "font-medium text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid size-6 place-items-center rounded-full text-xs",
                    index <= maxStep ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {index < maxStep ? <CheckIcon className="size-3.5" /> : index + 1}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
        <section className="min-w-0">
          <div className="mb-5">
            <h2 className="text-lg font-semibold">{current.title}</h2>
            <p className="text-sm text-muted-foreground">{current.description}</p>
          </div>
          {step === 0 ? (
            <BasicsStep
              key={workspace.data?.id ?? "new"}
              workspace={workspace.data}
              onDone={(saved) => {
                setWid(saved.id)
                setClientCookie(workspaceCookie, saved.id)
                router.replace(routes.onboardingFor(saved.id))
                setStep(1)
              }}
            />
          ) : wid && step === 1 ? (
            <BrandStep wid={wid} onBack={() => setStep(0)} onDone={() => advance(2)} />
          ) : wid && step === 2 ? (
            <>
              <ConnectChannelsStep wid={wid} />
              <Footer step={2} busy={update.isPending} canContinue nextLabel="Continue" onBack={() => setStep(1)} onNext={() => advance(3)} />
            </>
          ) : wid ? (
            <>
              <ListeningStep wid={wid} />
              <Footer step={3} busy={update.isPending} canContinue nextLabel="Finish setup" onBack={() => setStep(2)} onNext={finish} />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}
