"use client"
import { useQuery } from "@tanstack/react-query"
import type { Standing } from "./types"
import styled from "styled-components"
import { useState } from "react"
import { Team } from "./Team"

enum PointSystem {
  REGULAR = "regular",
  THREE_TWO_ONE_ZERO = "321",
}

export default function Standings() {
  const [selectedPointSystem, setSelectedPointSystem] = useState<
    PointSystem.THREE_TWO_ONE_ZERO | PointSystem.REGULAR
  >(PointSystem.THREE_TWO_ONE_ZERO)

  const query = useQuery({
    queryKey: ["/api/standings"],
    queryFn: async (): Promise<{ officialStandings: Standing[] }> => {
      const response = await fetch("/api/standings")
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      return response.json()
    },
  })

  if (query.isPending || !query.data) {
    return <div>Loading...</div>
  }

  const officialStandings = query.data.officialStandings
  const standings =
    selectedPointSystem === PointSystem.THREE_TWO_ONE_ZERO
      ? calculate321Standings(officialStandings)
      : officialStandings

  return (
    <Layout>
      <ToggleSystemNav>
        <RadioButtonWrapper>
          <input
            type="radio"
            id={PointSystem.THREE_TWO_ONE_ZERO}
            name="system"
            value={PointSystem.THREE_TWO_ONE_ZERO}
            checked={selectedPointSystem === PointSystem.THREE_TWO_ONE_ZERO}
            onChange={() =>
              setSelectedPointSystem(PointSystem.THREE_TWO_ONE_ZERO)
            }
          />
          <label htmlFor={PointSystem.THREE_TWO_ONE_ZERO}>3-2-1-0</label>
        </RadioButtonWrapper>
        <RadioButtonWrapper>
          <input
            type="radio"
            id={PointSystem.REGULAR}
            name="system"
            value={PointSystem.REGULAR}
            onChange={() => setSelectedPointSystem(PointSystem.REGULAR)}
            checked={selectedPointSystem === PointSystem.REGULAR}
          />
          <label htmlFor={PointSystem.REGULAR}>Regular</label>
        </RadioButtonWrapper>
      </ToggleSystemNav>
      <StandingsWrapper>
        {standings.map((standing, i) => {
          return (
            <TeamWrapper key={i}>
              <Team standing={standing} />
            </TeamWrapper>
          )
        })}
      </StandingsWrapper>
    </Layout>
  )
}

function calculate321Standings(officialStandings: Standing[]): Standing[] {
  const standings321 = officialStandings.map((teamStanding) => {
    const points =
      teamStanding.regulationWins * 3 +
      teamStanding.nonRegulationWins * 2 +
      teamStanding.nonRegulationLosses
    return {
      ...teamStanding,
      points,
    }
  })

  // Sort by highest points
  return standings321
    .sort(byNHLStandingsRules)
    .map((standing, i) => ({ ...standing, leagueRank: i + 1 }))
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
  padding: 8px;

  --nav-height: 64px;
`

const ToggleSystemNav = styled.nav`
  display: flex;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: space-around;
  height: var(--nav-height);
  gap: 16px;
  background-color: black;
`

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const StandingsWrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: calc(var(--nav-height) + 16px);
`
