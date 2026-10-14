"use client"

import { CheckIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, type ReactNode } from "react"

import { ConnectChannelsStep } from "@/features/connect-integration"
import { KeywordSetsEditor, SourcesEditor, useWeeklyEstimate } from "@/features/configure-listening"
import { WorkspaceBasicsForm } from "@/features/create-workspace"
import { BrandProfileForm } from "@/features/edit-brand-profile"
import { routes } from "@/shared/config"
import { toast } from "@/shared/lib/toast"
import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"

function StepHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function ListeningStep() {
  const estimate = useWeeklyEstimate()
  return (
    <div className="space-y-4">
      <KeywordSetsEditor />
      <div className="rounded-lg border p-3">
        <div className="text-sm font-medium">Sources</div>
        <SourcesEditor />
      </div>
      <p className="text-sm text-muted-foreground">
        Estimated <b className="text-foreground">~{estimate} buying-intent posts a week</b> · about $1.20/month in scoring
      </p>
    </div>
  )
}

const steps: { label: string; title: string; description: string; content: ReactNode }[] = [
  {
    label: "Workspace",
    title: "Workspace",
    description: "One workspace per client. Leads, drafts, budget and reports stay separate.",
    content: <WorkspaceBasicsForm />,
  },
  {
    label: "Brand profile",
    title: "Brand profile",
    description: "The AI reads this before writing any reply or post. Be specific.",
    content: <BrandProfileForm />,
  },
  {
    label: "Channels",
    title: "Connect channels",
    description: "Publishing goes through Buffer. Approvals and alerts go to Telegram.",
    content: <ConnectChannelsStep />,
  },
  {
    label: "Keywords & sources",
    title: "Keywords & sources",
    description: "Suggested from the brand profile. Turn off anything that doesn’t fit.",
    content: <ListeningStep />,
  },
]

/** Four-step setup for a new client workspace. */
export function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const current = steps[step]
  const last = step === steps.length - 1

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex h-14 items-center gap-3 border-b px-4 md:px-6">
        <span className="grid size-6 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">N</span>
        <span className="flex-1 text-sm font-semibold">New client workspace</span>
        <Button variant="ghost" size="sm" asChild>
          <Link href={routes.dashboard}>Exit</Link>
        </Button>
      </header>
      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-8 px-4 py-8 md:grid-cols-[200px_minmax(0,1fr)] md:px-6">
        <ol className="flex gap-2 overflow-x-auto md:flex-col">
          {steps.map((item, index) => (
            <li key={item.label}>
              <button
                type="button"
                disabled={index > step}
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
                    index <= step ? "bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  {index < step ? <CheckIcon className="size-3.5" /> : index + 1}
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ol>
        <section className="min-w-0">
          <StepHeading title={current.title} description={current.description} />
          {current.content}
          <div className="mt-8 flex items-center gap-2 border-t pt-4">
            <span className="flex-1 text-sm text-muted-foreground">
              Step {step + 1} of {steps.length}
            </span>
            {step > 0 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : null}
            {last ? (
              <Button
                onClick={() => {
                  router.push(routes.dashboard)
                  toast("Workspace ready — first scan is running")
                }}
              >
                Start first scan
              </Button>
            ) : (
              <Button onClick={() => setStep(step + 1)}>Continue</Button>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
