import styled from "styled-components"
import { Standing } from "./types"

export function Team({ standing }: { standing: Standing }) {
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
