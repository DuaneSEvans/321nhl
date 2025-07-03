"use client"
import { PointSystem, Scope, Standing } from "../shared"
import styled from "styled-components"
import { useRef, useEffect, useState } from "react"
import Nav from "./Nav"
import { StandingsView } from "./StandingsView"
import { usePointSystem } from "./PointSystemProvider"
import { AnimatePresence, motion } from "framer-motion"

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default function Standings({
  officialStandings,
}: {
  officialStandings: Standing[]
}) {
  const { pointSystem } = usePointSystem()
  const [scope, setScope] = useState<Scope>("Wild Card")

  const standingsWithSystem =
    pointSystem === PointSystem.REGULAR
      ? { standings: officialStandings, system: PointSystem.REGULAR }
      : {
          standings: calculate321Standings(officialStandings),
          system: PointSystem.THREE_TWO_ONE_ZERO,
        }

  const prevSystem = usePrevious(standingsWithSystem.system)
  const systemChanged = prevSystem !== standingsWithSystem.system

  return (
    <Layout>
      <Nav selectedScope={scope} setScope={setScope} />
      <ContentContainer>
        <AnimatePresence mode="wait">
          <StandingsView
            key={scope}
            scope={scope}
            standingsWithSystem={standingsWithSystem}
            officialStandings={officialStandings}
            systemChanged={systemChanged}
          />
        </AnimatePresence>
      </ContentContainer>
    </Layout>
  )
}

function calculate321Standings(officialStandings: Standing[]): Standing[] {
  return officialStandings
    .map((teamStanding) => {
      const points =
        teamStanding.regulationWins * 3 +
        teamStanding.nonRegulationWins * 2 +
        teamStanding.nonRegulationLosses
      return {
        ...teamStanding,
        points,
      }
    })
    .sort(byNHLStandingsRules)
}

/**
 * Sort by points
 * ====== TIE BREAKERS ======
 * 1. If points are equal, sort by regulation + overtime wins
 * 2. Head to head record of the two teams <-- not implemented
 * 3. Goal differential <-- not implemented
 * 4. Greater number of goals scored in all games during regular season <-- not implemented
 */
const byNHLStandingsRules = (a: Standing, b: Standing) => {
  if (a.points > b.points) {
    return -1
  }
  if (a.points < b.points) {
    return 1
  }

  // If points are equal, sort by regulation + overtime wins
  const aWins = a.regulationWins + a.nonRegulationWins
  const bWins = b.regulationWins + b.nonRegulationWins
  if (aWins > bWins) {
    return -1
  }
  if (aWins < bWins) {
    return 1
  }
  return 0
}

const Layout = styled.main`
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: var(--nav-height);
  align-items: center;
  overflow: hidden; // avoids a scrollbar on initial animation
`
