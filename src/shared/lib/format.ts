import type { Money } from "@/shared/api"

const MICROS = 1_000_000

/** `usdMicros` (1 USD = 1 000 000) → "$4.10"; sub-cent amounts keep their precision ("$0.0006"). */
export function formatUsdMicros(micros: number): string {
  const dollars = micros / MICROS
  if (dollars !== 0 && Math.abs(dollars) < 0.01) return `$${dollars.toFixed(4).replace(/0+$/, "")}`
  return `$${dollars.toFixed(2)}`
}

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: money.amountMinor % 100 === 0 ? 0 : 2,
  }).format(money.amountMinor / 100)
}

/** "12 min ago", "3 h ago", "Yesterday", "Oct 12". */
export function formatRelative(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime())
  const minutes = Math.round(diff / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  if (hours < 48) return "Yesterday"
  return formatDate(iso)
}

/** ISO instant or `YYYY-MM-DD` → "Oct 12" (adds the year when it isn't this year). */
export function formatDate(value: string): string {
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00`) : new Date(value)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }) })
}

/** "14:30" in the viewer's time zone. */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
}

/** Change against the previous period: "+5", "−3" or "±0". */
export function formatDelta(current: number, previous: number): string {
  const delta = current - previous
  if (delta === 0) return "±0"
  return delta > 0 ? `+${delta.toLocaleString("en-US")}` : `−${Math.abs(delta).toLocaleString("en-US")}`
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US")
}

/** "Ararat Dental Clinic" → "AC". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  return ((parts[0]?.[0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : (parts[0]?.[1] ?? ""))).toUpperCase() || "?"
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name
}
