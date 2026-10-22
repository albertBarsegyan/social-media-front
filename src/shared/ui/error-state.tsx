import { CircleAlertIcon } from "lucide-react"

import { errorMessage } from "@/shared/api"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/ui/empty-state"

/** Inline error for a failed query, with a retry button. */
export function ErrorState({ error, onRetry, title = "Couldn’t load this", className }: {
  error: unknown
  onRetry?: () => void
  title?: string
  className?: string
}) {
  return (
    <EmptyState
      className={className}
      icon={<CircleAlertIcon />}
      title={title}
      description={errorMessage(error)}
      actions={
        onRetry ? (
          <Button size="sm" variant="outline" onClick={onRetry}>
            Try again
          </Button>
        ) : null
      }
    />
  )
}
