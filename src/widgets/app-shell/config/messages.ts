import type { Messages } from "@/shared/lib/i18n"

import type { NavKey } from "./nav"

type ShellMessages = Record<NavKey, string> & { more: string; home: string; search: string; lead: string }

export const shellMessages: Messages<ShellMessages> = {
  en: { clients: "All clients", dashboard: "Dashboard", leads: "Leads", approvals: "Approvals", studio: "Content studio", calendar: "Calendar", analytics: "Analytics", settings: "Settings", telegram: "Telegram bot", onboarding: "Setup wizard", more: "More", home: "Home", search: "Search leads, posts, links", lead: "Lead" },
  ru: { clients: "Все клиенты", dashboard: "Обзор", leads: "Лиды", approvals: "Согласование", studio: "Контент-студия", calendar: "Календарь", analytics: "Аналитика", settings: "Настройки", telegram: "Telegram-бот", onboarding: "Мастер настройки", more: "Ещё", home: "Главная", search: "Поиск по лидам, постам, ссылкам", lead: "Лид" },
  hy: { clients: "Բոլոր հաճախորդները", dashboard: "Վահանակ", leads: "Լիդեր", approvals: "Հաստատումներ", studio: "Կոնտենտ ստուդիա", calendar: "Օրացույց", analytics: "Վերլուծություն", settings: "Կարգավորումներ", telegram: "Telegram բոտ", onboarding: "Կարգավորում", more: "Ավելին", home: "Գլխավոր", search: "Որոնել լիդեր, գրառումներ, հղումներ", lead: "Լիդ" },
}
