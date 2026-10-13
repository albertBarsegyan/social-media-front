"use client"

import { isLocale, localeLabels, locales, type Locale } from "@/shared/config"
import { useLocale } from "@/shared/lib/i18n"
import { Button } from "@/shared/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs"

const tabOrder: Locale[] = ["hy", "ru", "en"]

/** Desktop: segmented control with all three languages. */
export function LanguageTabs() {
  const { locale, setLocale } = useLocale()
  return (
    <Tabs value={locale} onValueChange={(value) => isLocale(value) && setLocale(value)}>
      <TabsList aria-label="Interface language">
        {tabOrder.map((value) => (
          <TabsTrigger key={value} value={value} className="px-2.5 text-xs">
            {localeLabels[value]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

/** Mobile: one button that cycles through the languages. */
export function LanguageCycleButton() {
  const { locale, setLocale } = useLocale()
  const next = locales[(locales.indexOf(locale) + 1) % locales.length]
  return (
    <Button variant="outline" size="sm" onClick={() => setLocale(next)} aria-label="Change interface language">
      {localeLabels[locale]}
    </Button>
  )
}
