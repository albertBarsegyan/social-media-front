import { routes } from "@/shared/config"

/** Only same-site paths are allowed as a post-login redirect target. */
export function safeNext(next: string | null): string {
  return next && next.startsWith("/") && !next.startsWith("//") ? next : routes.dashboard
}
