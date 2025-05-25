"use client"
import { Montserrat } from "next/font/google"
import {
  PointSystem,
  THREE_TWO_ONE_ZERO_COLORS,
  REGULAR_COLORS,
} from "../shared"
import { createContext, useContext, useState } from "react"

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-montserrat",
})

const PointSystemContext = createContext<{
  pointSystem: PointSystem
  setPointSystem: (pointSystem: PointSystem) => void
}>({
  pointSystem: PointSystem.THREE_TWO_ONE_ZERO,
  setPointSystem: () => {},
})

export function ThemeHTMLWrapper({ children }: { children: React.ReactNode }) {
  const [pointSystem, setPointSystem] = useState<PointSystem>(
    PointSystem.THREE_TWO_ONE_ZERO
  )

  const themeColors =
    pointSystem === PointSystem.THREE_TWO_ONE_ZERO
      ? THREE_TWO_ONE_ZERO_COLORS
      : REGULAR_COLORS

  return (
    <PointSystemContext.Provider
      value={{
        pointSystem,
        setPointSystem,
      }}
    >
      <html
        lang="en"
        className={montserrat.variable}
        style={themeColors}
        data-color-theme={pointSystem}
      >
        {children}
      </html>
    </PointSystemContext.Provider>
  )
}

export function usePointSystem() {
  return useContext(PointSystemContext)
}
