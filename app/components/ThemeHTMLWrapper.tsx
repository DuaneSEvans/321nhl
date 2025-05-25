"use client"
import { Montserrat } from "next/font/google"
import {
  PointSystem,
  THREE_TWO_ONE_ZERO_COLORS,
  REGULAR_COLORS,
} from "../shared"
import { usePointSystem } from "./PointSystemProvider"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
})

export function ThemeHTMLWrapper({ children }: { children: React.ReactNode }) {
  const { pointSystem } = usePointSystem()
  const themeColors =
    pointSystem === PointSystem.THREE_TWO_ONE_ZERO
      ? THREE_TWO_ONE_ZERO_COLORS
      : REGULAR_COLORS

  return (
    <html
      lang="en"
      className={montserrat.variable}
      style={themeColors}
      data-color-theme={pointSystem}
    >
      {children}
    </html>
  )
}
