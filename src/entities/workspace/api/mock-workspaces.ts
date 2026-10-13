import type { Workspace } from "../model/types"

export const mockWorkspaces: Workspace[] = [
  { id: "mila", name: "Mila Beauty Studio", type: "Salon · Yerevan", bundle: "Leads", initials: "MB", pending: 8, leads: 34, deals: 10, budget: 68, health: "ok", healthLabel: "All channels connected", owner: "Mila Petrosyan" },
  { id: "lavash", name: "Lavash & Co", type: "Restaurant · Gyumri", bundle: "Content", initials: "LC", pending: 5, leads: null, deals: null, budget: 22, health: "err", healthLabel: "Instagram disconnected", owner: "Gor Avetisyan" },
  { id: "ararat", name: "Ararat Dental Clinic", type: "Clinic · Yerevan", bundle: "Leads + Bookings", initials: "AD", pending: 2, leads: 19, deals: 6, budget: 91, health: "warn", healthLabel: "AI budget at 91%", owner: "Dr. Narine Hovhannisyan" },
  { id: "neo", name: "Neo Labs", type: "Agency · own use", bundle: "Internal", initials: "NL", pending: 3, leads: 12, deals: 2, budget: 38, health: "ok", healthLabel: "All channels connected", owner: "Albert Hakobyan" },
  { id: "kino", name: "Kino Café", type: "Café · Yerevan", bundle: "Content", initials: "KC", pending: 0, leads: null, deals: null, budget: 0, health: "setup", healthLabel: "Setup — step 3 of 4", owner: "Lusine Grigoryan" },
]
