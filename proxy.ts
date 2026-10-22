import { NextResponse, type NextRequest } from "next/server"

import { publicRoutes, routes } from "@/shared/config/routes"

/**
 * Optimistic auth redirect. The API sets a non-secret `nge_session` hint cookie alongside the httpOnly
 * tokens; real authorization still happens on every API call.
 */
const SESSION_HINT_COOKIE = "nge_session"

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const hasSession = request.cookies.has(SESSION_HINT_COOKIE)
  const isPublic = publicRoutes.some((route) => pathname === route)

  if (!hasSession && !isPublic) {
    const url = new URL(routes.login, request.url)
    url.searchParams.set("next", `${pathname}${search}`)
    return NextResponse.redirect(url)
  }
  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL(routes.dashboard, request.url))
  }
  return NextResponse.next()
}

export const config = {
  // Everything except Next internals and static files.
  matcher: ["/((?!_next/|favicon.ico|.*\\.[a-zA-Z0-9]+$).*)"],
}
