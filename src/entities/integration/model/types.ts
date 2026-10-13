export interface Integration {
  id: "buffer" | "telegram-bot" | "blotato" | "apify"
  name: string
  role: string
  detail: string
  status: string
}
