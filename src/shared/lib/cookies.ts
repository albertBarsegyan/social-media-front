const ONE_YEAR = 60 * 60 * 24 * 365

/** Client-side cookie write; values are read back on the server via `cookies()`. */
export function setClientCookie(name: string, value: string, maxAge = ONE_YEAR) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax`
}
