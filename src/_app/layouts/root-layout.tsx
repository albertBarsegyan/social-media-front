import type { Metadata } from "next"
import { Geist, Geist_Mono, Noto_Sans_Armenian } from "next/font/google"
import type { ReactNode } from "react"

import { Providers } from "../providers/providers"
import "../styles/globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const notoArmenian = Noto_Sans_Armenian({ variable: "--font-noto-armenian", subsets: ["armenian"] })

export const metadata: Metadata = {
  title: { template: "%s · Neo Growth Engine", default: "Neo Growth Engine" },
  description: "Find buying-intent posts, approve replies and posts, and track what brings in deals.",
}

export function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${notoArmenian.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
