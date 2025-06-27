"use client"
import { Montserrat } from "next/font/google"
import {
  PointSystem,
  THREE_TWO_ONE_ZERO_COLORS,
  REGULAR_COLORS,
  CSS_VARS,
} from "../shared"
import { usePointSystem } from "./PointSystemProvider"
import { createGlobalStyle } from "styled-components"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
})

const GlobalStyle = createGlobalStyle<{
  cssVars: { [key: string]: string | number }
}>`
  body {
    ${({ cssVars }) =>
      Object.entries(cssVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n    ")}
  }
`

export function ThemeHTMLWrapper({ children }: { children: React.ReactNode }) {
  const { pointSystem } = usePointSystem()
  const themeColors =
    pointSystem === PointSystem.THREE_TWO_ONE_ZERO
      ? THREE_TWO_ONE_ZERO_COLORS
      : REGULAR_COLORS

  const cssVars = {
    ...themeColors,
    ...CSS_VARS,
  }

  return (
    <>
      <GlobalStyle cssVars={cssVars} />
      <div className={montserrat.variable}>{children}</div>
    </>
  )
}
