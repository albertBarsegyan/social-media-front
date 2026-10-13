"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"

import { defaultLocale, localeCookie, type Locale } from "@/shared/config/i18n"
import { setClientCookie } from "@/shared/lib/cookies"

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  setLocale: () => {},
})

export function LocaleProvider({ initialLocale, children }: { initialLocale: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState(initialLocale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    setClientCookie(localeCookie, next)
  }, [])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return <LocaleContext value={value}>{children}</LocaleContext>
}

export function useLocale() {
  return useContext(LocaleContext)
}

/** Per-slice dictionaries: each slice keeps its own copy in `config/messages.ts`. */
export type Messages<T> = Record<Locale, T>

export function useMessages<T>(messages: Messages<T>): T {
  return messages[useLocale().locale]
}
