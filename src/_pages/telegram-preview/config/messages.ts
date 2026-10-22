import type { Messages } from "@/shared/lib/i18n"

/** `{name}` placeholders are filled with live workspace data by `fill`. */
interface BotMessages {
  newLead: string
  why: string
  draft: string
  approve: string
  edit: string
  skip: string
  open: string
  approved: string
  posted: string
  skipped: string
  editPrompt: string
  weekly: string
  weeklyLines: string[]
  best: string
  noBest: string
  budget: string
  openDash: string
  pending: string
  budgetHit: string
  budgetOk: string
  raise: string
  keep: string
  disc: string
  allConnected: string
  reconnect: string
}

/** Bot copy follows the interface language; draft replies stay in the post’s language. */
export const botMessages: Messages<BotMessages> = {
  en: { newLead: "New lead · intent {score}/100", why: "Why:", draft: "Draft reply", approve: "Approve", edit: "Edit", skip: "Skip", open: "Open post", approved: "Approved. The reply is copied — open the post, paste and send. Then tap Posted.", posted: "Posted", skipped: "Skipped. Why? It helps the scoring.", editPrompt: "Send me the corrected reply as a message.", weekly: "Weekly report · {range}", weeklyLines: ["Buying-intent posts found: {intents}", "Replies sent: {replies}", "Link clicks: {clicks}", "Inquiries: {inquiries}", "Deals: {deals}"], best: "Best channel: {channel} — {deals} deals from {replies} replies.", noBest: "No deals recorded last week.", budget: "AI budget: {used} of {cap}", openDash: "Open dashboard", pending: "Waiting for approval ({count})", budgetHit: "AI budget reached ({used} of {cap}). Scoring and drafting are paused until {date}.", budgetOk: "AI budget: {used} of {cap} used this month.", raise: "Raise cap", keep: "Keep paused", disc: "{provider} needs reconnecting. Work that depends on it is paused.", allConnected: "All channels connected.", reconnect: "Reconnect" },
  ru: { newLead: "Новый лид · намерение {score}/100", why: "Почему:", draft: "Черновик ответа", approve: "Одобрить", edit: "Изменить", skip: "Пропустить", open: "Открыть пост", approved: "Одобрено. Ответ скопирован — откройте пост, вставьте и отправьте. Затем нажмите «Опубликовано».", posted: "Опубликовано", skipped: "Пропущено. Почему? Это улучшит оценку.", editPrompt: "Пришлите исправленный ответ сообщением.", weekly: "Отчёт за неделю · {range}", weeklyLines: ["Найдено постов с намерением купить: {intents}", "Отправлено ответов: {replies}", "Переходов по ссылкам: {clicks}", "Обращений: {inquiries}", "Сделок: {deals}"], best: "Лучший канал: {channel} — {deals} сделки из {replies} ответов.", noBest: "За прошлую неделю сделок нет.", budget: "AI-бюджет: {used} из {cap}", openDash: "Открыть обзор", pending: "Ждут одобрения ({count})", budgetHit: "AI-бюджет исчерпан ({used} из {cap}). Оценка и черновики на паузе до {date}.", budgetOk: "AI-бюджет: использовано {used} из {cap} в этом месяце.", raise: "Поднять лимит", keep: "Оставить паузу", disc: "{provider}: нужно переподключить. Зависящая работа на паузе.", allConnected: "Все каналы подключены.", reconnect: "Переподключить" },
  hy: { newLead: "Նոր լիդ · մտադրություն {score}/100", why: "Ինչու՝", draft: "Պատասխանի սևագիր", approve: "Հաստատել", edit: "Խմբագրել", skip: "Բաց թողնել", open: "Բացել գրառումը", approved: "Հաստատված է։ Պատասխանը պատճենված է — բացեք գրառումը, տեղադրեք և ուղարկեք։ Հետո սեղմեք «Հրապարակված է»։", posted: "Հրապարակված է", skipped: "Բաց թողնված է։ Ինչու՞։ Սա կօգնի գնահատմանը։", editPrompt: "Ուղարկեք ուղղված պատասխանը հաղորդագրությամբ։", weekly: "Շաբաթական հաշվետվություն · {range}", weeklyLines: ["Գտնված գնման մտադրությամբ գրառումներ՝ {intents}", "Ուղարկված պատասխաններ՝ {replies}", "Հղումների սեղմումներ՝ {clicks}", "Դիմումներ՝ {inquiries}", "Գործարքներ՝ {deals}"], best: "Լավագույն ալիքը՝ {channel} — {deals} գործարք {replies} պատասխանից։", noBest: "Անցած շաբաթ գործարքներ չկան։", budget: "AI բյուջե՝ {used} / {cap}", openDash: "Բացել վահանակը", pending: "Սպասում են հաստատման ({count})", budgetHit: "AI բյուջեն սպառված է ({used} / {cap})։ Գնահատումն ու սևագրերը դադարեցված են մինչև {date}։", budgetOk: "AI բյուջե՝ այս ամիս օգտագործված է {used} / {cap}։", raise: "Բարձրացնել սահմանը", keep: "Թողնել դադարեցված", disc: "{provider}-ը պետք է վերամիացնել։ Կախված աշխատանքը դադարեցված է։", allConnected: "Բոլոր ալիքները միացված են։", reconnect: "Վերամիացնել" },
}

/** Replaces `{key}` placeholders. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}
