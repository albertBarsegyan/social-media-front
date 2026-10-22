import type { Messages } from "./locale-context"

/** Generic action verbs reused across slices. */
export const commonMessages: Messages<{ approve: string; edit: string; skip: string }> = {
  en: { approve: "Approve", edit: "Edit", skip: "Skip" },
  ru: { approve: "Одобрить", edit: "Изменить", skip: "Пропустить" },
  hy: { approve: "Հաստատել", edit: "Խմբագրել", skip: "Բաց թողնել" },
}
