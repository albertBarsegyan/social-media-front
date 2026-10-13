import type { Campaign, Variant } from "../model/types"

const draft = (text: string): Variant => ({ text, status: "draft" })

export const mockCampaign: Campaign = {
  id: "bridal-anahit",
  title: "Bridal case study — Anahit & Davit",
  summary: "Soft low bun for a 12-hour outdoor wedding in Dilijan. Trial three weeks before; 2h 10m on the day; held until midnight.",
  media: ["before", "trial", "final look", "detail"],
  video: { name: "final-look.mp4", duration: "0:42" },
  variants: {
    instagram: {
      hy: draft("12 ժամ բաց երկնքի տակ Դիլիջանում, և հավաքվածքը տեղից չշարժվեց։\n\nԱնահիտը ուզում էր նուրբ ու բնական կերպար։ Փորձնական սանրվածքը արեցինք երեք շաբաթ առաջ, հարսանիքի օրը՝ 2 ժ 10 ր։\n\nԳրանցում ենք 2027-ի հունիսի հարսնացուներին՝ փորձնականը ներառված է։\n#հարսնացու #երևան"),
      ru: draft("12 часов на улице в Дилижане — и пучок не сдвинулся.\n\nАнаит хотела мягкий естественный образ, без «салонности». Пробная укладка за три недели, в день свадьбы — 2 ч 10 мин.\n\nЗаписываем невест на июнь 2027 — пробный образ включён.\n#невестаереван #свадебнаяприческа"),
      en: draft("12 hours outdoors in Dilijan, and the low bun didn’t move.\n\nAnahit wanted soft and natural, not “salon done”. We ran a trial three weeks out, then 2h 10m on the day.\n\nNow booking June 2027 brides — trial included.\n#yerevanbride #bridalhair"),
    },
    facebook: {
      hy: draft("Ի՞նչ է պետք հարսանեկան կերպարին, որ դիմանա 12 ժամ բացօթյա արարողությանը։ Անահիտն ու Դավիթն ամուսնացան Դիլիջանում սեպտեմբերին՝ քամի, արև, պար մինչև կեսգիշեր։\n\nՄենք արեցինք փորձնական կերպար երեք շաբաթ առաջ, նուրբ ցածր հավաքվածք՝ թաքնված հյուսքերով, և երկարատև դիմահարդարում։\n\nՊլանավորու՞մ եք 2027-ի հարսանիք․ գրեք մեզ։ Լուսանկարներ՝ mila.am/r/b7q4"),
      ru: draft("Что нужно свадебному образу, чтобы пережить 12 часов на улице? Анаит и Давид поженились в Дилижане в сентябре — ветер, солнце, танцы до полуночи.\n\nЧто мы сделали: пробный образ за три недели, мягкий низкий пучок со скрытыми косами для фиксации и стойкий макияж слоями.\n\nПланируете свадьбу в 2027? Напишите — честно расскажем, что выдерживает улицу. Фото: mila.am/r/b7q3"),
      en: draft("What does a bridal look need to survive a 12-hour outdoor wedding? Anahit and Davit married in Dilijan in September — wind, sun, dancing until midnight.\n\nWhat we did: a trial three weeks before, a soft low bun with hidden braids for structure, and long-wear makeup set in layers.\n\nPlanning a 2027 wedding? Message us and we’ll tell you honestly what holds up outdoors. Photos: mila.am/r/b7q2"),
    },
    telegram: {
      hy: draft("Նոր աշխատանք՝ Անահիտի հարսանիքը Դիլիջանում։ 12 ժամ, մեկ փորձնական սանրվածք, ոչ մի ուղղում։ → mila.am/r/tg13"),
      ru: draft("Новое в портфолио: свадьба Анаит в Дилижане. 12 часов на улице, одна пробная укладка, ни одной поправки. → mila.am/r/tg12"),
      en: draft("New in the portfolio: Anahit’s outdoor wedding in Dilijan. 12 hours, one trial, zero touch-ups. → mila.am/r/tg11"),
    },
  },
}

/** Social handles the variants are previewed under. */
export const campaignHandles = {
  instagram: "mila.beauty",
  facebook: "Mila Beauty Studio",
  telegram: "Mila Beauty · channel",
} as const
