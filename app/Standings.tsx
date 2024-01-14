"use client"
import { useQuery } from "@tanstack/react-query"
import type { RawStanding, Standing } from "./types"
import styled from "styled-components"

export default function Standings() {
  const query = useQuery({
    queryKey: ["/api/standings"],
    queryFn: async (): Promise<{ standings: RawStanding[] }> => {
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

  const rawStandings = query.data.standings
  const standings321 = calculate321Standings(rawStandings)

  return (
    <main>
      {standings321.map((alteredStanding, i) => {
        return (
          <TeamWrapper key={i}>
            <TeamHeader>{alteredStanding.teamCommonName.default}</TeamHeader>
            <TeamCard standing={alteredStanding} />
          </TeamWrapper>
        )
      })}
    </main>
  )
}

function calculate321Standings(rawStandings: RawStanding[]): Standing[] {
  const standings321 = rawStandings.map((teamStanding) => {
    const { regulationWins, regulationPlusOtWins, losses, otLosses } =
      teamStanding
    const nonRegulationWins = regulationPlusOtWins - regulationWins
    const points = regulationWins * 3 + nonRegulationWins * 2 + otLosses
    return {
      ...teamStanding,
      regulationLosses: losses,
      nonRegulationLosses: otLosses,
      nonRegulationWins,
      points,
    }
  })

  // Sort by highest points
  return standings321.sort((a, b) => b.points - a.points)
}

const TeamWrapper = styled.article`
  padding: 1rem;
`

function TeamCard({ standing }: { standing: Standing }) {
  return (
    <div>
      <div>Points: {standing.points}</div>
      <div>
        {standing.regulationWins} - {standing.nonRegulationWins} -{" "}
        {standing.nonRegulationLosses} - {standing.regulationLosses}
      </div>
    </div>
  )
}
const TeamRow = styled.div``

const TeamHeader = styled.h1``
