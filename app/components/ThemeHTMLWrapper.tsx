"use client"
import {
  PointSystem,
  THREE_TWO_ONE_ZERO_COLORS,
  REGULAR_COLORS,
  CSS_VARS,
} from "../shared"
import { usePointSystem } from "./PointSystemProvider"
import { createGlobalStyle } from "styled-components"

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
      {children}
    </>
  )
}
