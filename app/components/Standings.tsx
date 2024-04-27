"use client"
import { useQuery } from "@tanstack/react-query"
import type { Standing } from "../types"
import styled from "styled-components"
import { useState } from "react"
import { StandingsView } from "./StandingsView"
import { WildcardStandingsView } from "./WildcardStandingsView"

enum PointSystem {
  REGULAR = "regular",
  THREE_TWO_ONE_ZERO = "321",
}

const views = [
  "Pacific",
  "Central",
  "Western",
  "Atlantic",
  "Metropolitan",
  "Eastern",
  "League",
] as const
export type ViewType = (typeof views)[number]

export default function Standings() {
  const [selectedPointSystem, setSelectedPointSystem] = useState<
    PointSystem.THREE_TWO_ONE_ZERO | PointSystem.REGULAR
  >(PointSystem.THREE_TWO_ONE_ZERO)

  const query = useQuery({
    queryKey: ["/api/standings"],
    queryFn: async (): Promise<{ officialStandings: Standing[] }> => {
      const response = await fetch("/api/standings", {
        method: "POST",
      })
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

  const calculatedStandingsWithTitle = views.map((view) => {
    const viewStandings = getViewStandings(view, officialStandings)

    const calculatedStandings =
      selectedPointSystem === PointSystem.THREE_TWO_ONE_ZERO
        ? calculate321Standings(viewStandings)
        : viewStandings

    return {
      title: view,
      calculatedStandings,
    }
  })

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
      <ContextContainer>
        {calculatedStandingsWithTitle.map(({ title, calculatedStandings }) => {
          if (title === "Eastern" || title === "Western") {
            return (
              <WildcardStandingsView
                key={title}
                title={title}
                standings={calculatedStandings}
              />
            )
          }
          return (
            <StandingsView
              key={title}
              title={title}
              standings={calculatedStandings}
            />
          )
        })}
      </ContextContainer>
    </Layout>
  )
}

function calculate321Standings(officialStandings: Standing[]): Standing[] {
  const standings321 = officialStandings
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

  return standings321.map((standing, i) => {
    const officialStandingPlace = officialStandings.findIndex(
      (s) => s.teamCommonName === standing.teamCommonName
    )
    if (officialStandingPlace === -1) {
      throw new Error("Could not find team in official standings")
    }

    return {
      ...standing,
      leagueRank: i + 1,
      // Subtract the regular index from the 321 index to calculate the change
      change: officialStandingPlace - i,
    }
  })
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

function getViewStandings(view: ViewType, standings: Standing[]): Standing[] {
  switch (view) {
    case "Pacific":
      return standings.filter((standing) => standing.divisionName === "Pacific")
    case "Central":
      return standings.filter((standing) => standing.divisionName === "Central")
    case "Western":
      return standings.filter(
        (standing) => standing.conferenceName === "Western"
      )
    case "Atlantic":
      return standings.filter(
        (standing) => standing.divisionName === "Atlantic"
      )
    case "Metropolitan":
      return standings.filter(
        (standing) => standing.divisionName === "Metropolitan"
      )
    case "Eastern":
      return standings.filter(
        (standing) => standing.conferenceName === "Eastern"
      )
    case "League":
      return standings
    default:
      throw new Error("Invalid view")
  }
}

const Layout = styled.main`
  display: flex;
  flex-direction: column;

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
  @media (prefers-color-scheme: dark) {
    color: white;
  }
`

const ContextContainer = styled.section`
  display: flex;
  margin-top: calc(var(--nav-height) + 16px);
  overflow: auto;
  width: 100%;
  scroll-snap-type: x mandatory;
`
