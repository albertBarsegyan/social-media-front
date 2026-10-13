import type { Messages } from "@/shared/lib/i18n"

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
  reasons: string[]
  editPrompt: string
  weekly: string
  weeklyLines: string[]
  best: string
  budget: string
  openDash: string
  pending: string
  budgetHit: string
  raise: string
  keep: string
  disc: string
  reconnect: string
}

/** Bot copy follows the interface language; draft replies stay in the post’s language. */
export const botMessages: Messages<BotMessages> = {
  en: { newLead: "New lead · intent 91/100", why: "Why: asks for a salon recommendation, moving to Yerevan, needs an English-speaking stylist.", draft: "Draft reply", approve: "Approve", edit: "Edit", skip: "Skip", open: "Open post", approved: "Approved. The reply is copied — open the post, paste and send. Then tap Posted.", posted: "Posted", skipped: "Skipped. Why? It helps the scoring.", reasons: ["Not relevant", "Outside our area", "Already handled"], editPrompt: "Send me the corrected reply as a message.", weekly: "Weekly report · Oct 5–11", weeklyLines: ["Buying-intent posts found: 64", "Replies sent: 23", "Link clicks: 547", "New leads: 34", "Deals: 10"], best: "Best channel: Facebook groups — 4 deals from 8 replies.", budget: "AI budget: $4.10 of $6.00", openDash: "Open dashboard", pending: "Waiting for approval (8)", budgetHit: "AI budget reached ($6.00 of $6.00). Scoring and drafting are paused until Nov 1.", raise: "Raise cap to $10", keep: "Keep paused", disc: "Instagram disconnected in Buffer. 2 scheduled posts are paused.", reconnect: "Reconnect" },
  ru: { newLead: "Новый лид · намерение 91/100", why: "Почему: просит посоветовать салон, переезжает в Ереван, нужен англоговорящий мастер.", draft: "Черновик ответа", approve: "Одобрить", edit: "Изменить", skip: "Пропустить", open: "Открыть пост", approved: "Одобрено. Ответ скопирован — откройте пост, вставьте и отправьте. Затем нажмите «Опубликовано».", posted: "Опубликовано", skipped: "Пропущено. Почему? Это улучшит оценку.", reasons: ["Не по теме", "Не наш район", "Уже ответили"], editPrompt: "Пришлите исправленный ответ сообщением.", weekly: "Отчёт за неделю · 5–11 окт", weeklyLines: ["Найдено постов с намерением купить: 64", "Отправлено ответов: 23", "Переходов по ссылкам: 547", "Новых лидов: 34", "Сделок: 10"], best: "Лучший канал: группы Facebook — 4 сделки из 8 ответов.", budget: "AI-бюджет: $4.10 из $6.00", openDash: "Открыть обзор", pending: "Ждут одобрения (8)", budgetHit: "AI-бюджет исчерпан ($6.00 из $6.00). Оценка и черновики на паузе до 1 ноября.", raise: "Поднять лимит до $10", keep: "Оставить паузу", disc: "Instagram отключён в Buffer. 2 запланированных поста на паузе.", reconnect: "Переподключить" },
  hy: { newLead: "Նոր լիդ · մտադրություն 91/100", why: "Ինչու՝ խնդրում է խորհուրդ տալ սրահ, տեղափոխվում է Երևան, պետք է անգլախոս վարպետ։", draft: "Պատասխանի սևագիր", approve: "Հաստատել", edit: "Խմբագրել", skip: "Բաց թողնել", open: "Բացել գրառումը", approved: "Հաստատված է։ Պատասխանը պատճենված է — բացեք գրառումը, տեղադրեք և ուղարկեք։ Հետո սեղմեք «Հրապարակված է»։", posted: "Հրապարակված է", skipped: "Բաց թողնված է։ Ինչու՞։ Սա կօգնի գնահատմանը։", reasons: ["Թեմայից դուրս", "Մեր տարածքից դուրս", "Արդեն պատասխանել ենք"], editPrompt: "Ուղարկեք ուղղված պատասխանը հաղորդագրությամբ։", weekly: "Շաբաթական հաշվետվություն · հոկտ. 5–11", weeklyLines: ["Գտնված գնման մտադրությամբ գրառումներ՝ 64", "Ուղարկված պատասխաններ՝ 23", "Հղումների սեղմումներ՝ 547", "Նոր լիդեր՝ 34", "Գործարքներ՝ 10"], best: "Լավագույն ալիքը՝ Facebook խմբեր — 4 գործարք 8 պատասխանից։", budget: "AI բյուջե՝ $4.10 / $6.00", openDash: "Բացել վահանակը", pending: "Սպասում են հաստատման (8)", budgetHit: "AI բյուջեն սպառված է ($6.00 / $6.00)։ Գնահատումն ու սևագրերը դադարեցված են մինչև նոյեմբերի 1-ը։", raise: "Բարձրացնել մինչև $10", keep: "Թողնել դադարեցված", disc: "Instagram-ը անջատված է Buffer-ում։ 2 պլանավորված գրառում դադարեցված է։", reconnect: "Վերամիացնել" },
}
