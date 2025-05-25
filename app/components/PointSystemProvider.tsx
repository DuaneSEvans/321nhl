"use client"
import { PointSystem } from "../shared"
import { createContext, useContext, useState } from "react"

const PointSystemContext = createContext<{
  pointSystem: PointSystem
  setPointSystem: (pointSystem: PointSystem) => void
}>({
  pointSystem: PointSystem.THREE_TWO_ONE_ZERO,
  setPointSystem: () => {},
})

export function PointSystemProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [pointSystem, setPointSystem] = useState<PointSystem>(
    PointSystem.THREE_TWO_ONE_ZERO
  )
  return (
    <PointSystemContext.Provider
      value={{
        pointSystem,
        setPointSystem,
      }}
    >
      {children}
    </PointSystemContext.Provider>
  )
}

export function usePointSystem() {
  return useContext(PointSystemContext)
}
