"use client"
import { useQuery } from "@tanstack/react-query"
import type { Standing } from "./types"
import styled from "styled-components"
import { useState } from "react"

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
            onClick={() =>
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
            onClick={() => setSelectedPointSystem(PointSystem.REGULAR)}
            checked={selectedPointSystem === PointSystem.REGULAR}
          />
          <label htmlFor={PointSystem.REGULAR}>Regular</label>
        </RadioButtonWrapper>
      </ToggleSystemNav>
      <StandingsWrapper>
        {standings.map((standing, i) => {
          return (
            <TeamCardWrapper key={i}>
              <TeamCard standing={standing} />
            </TeamCardWrapper>
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
    .sort((a, b) => b.points - a.points)
    .map((standing, i) => ({ ...standing, leagueRank: i + 1 }))
}

function TeamCard({ standing }: { standing: Standing }) {
  return (
    <>
      <PositionWrapper>{standing.leagueRank}</PositionWrapper>
      <TeamContentWrapper>
        <TeamHeader>
          {standing.teamCommonName.default}
          <MiniPoints>
            ({standing.regulationWins} - {standing.nonRegulationWins} -{" "}
            {standing.nonRegulationLosses} - {standing.regulationLosses})
          </MiniPoints>
        </TeamHeader>
        <div>Points: {standing.points}</div>
      </TeamContentWrapper>
    </>
  )
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

const TeamCardWrapper = styled.div`
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

const PositionWrapper = styled.span`
  width: 2rem;
  font-size: 2rem;
  text-align: center;
`

const TeamContentWrapper = styled.div``

const MiniPoints = styled.span`
  font-size: 0.8rem;
  font-weight: lighter;
  margin-left: 0.75rem;
`

const TeamHeader = styled.h1``
