/** The prototype shows one fixed week: Mon Oct 12 – Sun Oct 18, 2026. */
export const week = {
  label: "Oct 12 – 18, 2026",
  month: "Oct",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  dates: [12, 13, 14, 15, 16, 17, 18],
  todayIndex: 1,
} as const

export function dayLabel(day: number) {
  return `${week.days[day]} ${week.dates[day]}`
}
