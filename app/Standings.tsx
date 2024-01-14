"use client"
import { useQuery } from "@tanstack/react-query"
import type { Standings as StandingsType } from "./types"
import styled from "styled-components"

export default function Standings() {
  const query = useQuery({
    queryKey: ["/api/standings"],
    queryFn: async (): Promise<{ data: StandingsType }> => {
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

  return (
    <main>
      {query.data.data.standings.map((team, i) => {
        return (
          <TeamWrapper key={i}>
            <TeamHeader>{team.teamCommonName.default}</TeamHeader>
            <TeamRow>{JSON.stringify(team)}</TeamRow>
          </TeamWrapper>
        )
      })}
    </main>
  )
}

const TeamWrapper = styled.article`
  padding: 1rem;
`

const TeamRow = styled.div``

const TeamHeader = styled.h1``
