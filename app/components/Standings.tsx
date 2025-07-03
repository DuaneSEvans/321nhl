"use client"
import { PointSystem, Scope, Standing } from "../shared"
import styled from "styled-components"
import { useState } from "react"
import Nav from "./Nav"
import { StandingsView } from "./StandingsView"
import { usePointSystem } from "./PointSystemProvider"

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

  return (
    <Layout>
      <Nav selectedScope={scope} setScope={setScope} />
      <ContentContainer>
        <StandingsView
          scope={scope}
          standingsWithSystem={standingsWithSystem}
          officialStandings={officialStandings}
        />
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

const ContentContainer = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: var(--nav-height);
  align-items: center;
`
