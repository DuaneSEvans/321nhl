import QueryProvider from "./QueryProvider"
import "./globals.css"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeHTMLWrapper } from "./components/ThemeHTMLWrapper"

const isLocal = process.env.NODE_ENV === "development"
const title = "3-2-1 NHL Standings"
const devTitle = `< ${title} />`

export const metadata: Metadata = {
  title: isLocal ? devTitle : title,
  description:
    "The NHL Standings if the league followed a 3-2-1-0 point system",
  icons:
    "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏒</text></svg>",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeHTMLWrapper>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </ThemeHTMLWrapper>
  )
}
