import ky from "ky"

import { toApiError } from "./errors"

const API_URL = process.env.NEXT_PUBLIC_API_URL

/** Paths that must never trigger a refresh-and-retry on 401. */
const AUTH_PATHS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"]

let sessionExpiredHandler: () => void = () => {}

/** Called once when the session can't be refreshed (the app redirects to /login). */
export function onSessionExpired(handler: () => void) {
  sessionExpiredHandler = handler
}

let refreshing: Promise<boolean> | null = null

/** Single-flight refresh: parallel 401s share one `POST /auth/refresh`. */
function refreshSession(): Promise<boolean> {
  refreshing ??= ky
    .post("auth/refresh", { prefix: API_URL, credentials: "include", retry: 0 })
    .then(() => true, () => false)
    .finally(() => {
      refreshing = null
    })
  return refreshing
}

/**
 * The one HTTP client. Auth lives in httpOnly cookies, so requests only need `credentials: "include"`.
 * On 401 it refreshes the session once and retries the request once; if that fails the session ends.
 * Every failure is rethrown as an `ApiError`.
 */
export const api = ky.create({
  prefix: API_URL,
  credentials: "include",
  timeout: 20_000,
  // Limit 1 only allows the forced retry below; automatic retries are left to TanStack Query.
  retry: { limit: 1, shouldRetry: () => false },
  hooks: {
    init: [
      () => {
        if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not set (see .env.example)")
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401) return
        if (AUTH_PATHS.some((path) => new URL(request.url).pathname.endsWith(path))) return
        if (retryCount === 0 && (await refreshSession())) return ky.retry({ code: "SESSION_REFRESHED" })
        sessionExpiredHandler()
      },
    ],
    beforeError: [({ error }) => toApiError(error)],
  },
})

/** Drops undefined values so they don't become `?key=undefined`. */
export function query(params: Record<string, string | number | boolean | undefined | null>) {
  const out: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") out[key] = String(value)
  }
  return out
}
