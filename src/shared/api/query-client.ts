import { MutationCache, QueryClient } from "@tanstack/react-query"

import { toast } from "@/shared/lib/toast"

import { ApiError, errorMessage, toApiError } from "./errors"

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApiError
    mutationMeta: {
      /** Skip the global error toast (the caller shows its own). */
      silentError?: boolean
    }
  }
}

const MAX_RETRIES = 2

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        // Retry network and 5xx failures only; a 4xx won't change by asking again.
        retry: (failureCount, error) => !toApiError(error).isClientError && failureCount < MAX_RETRIES,
        refetchOnWindowFocus: true,
      },
      mutations: { retry: false },
    },
    mutationCache: new MutationCache({
      onError: (error, _variables, _onMutateResult, mutation) => {
        if (!mutation.meta?.silentError) toast.error(errorMessage(error))
      },
    }),
  })
}

let browserQueryClient: QueryClient | undefined

/** A fresh client per server render; one shared client in the browser. */
export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient()
  browserQueryClient ??= makeQueryClient()
  return browserQueryClient
}
