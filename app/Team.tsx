import styled from "styled-components"
import { Standing } from "./types"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"

export function Team({ standing }: { standing: Standing }) {
  return (
    <>
      <PositionWrapper>{standing.leagueRank}</PositionWrapper>
      <ChangeArrow change={standing.change} />

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

function ChangeArrow({ change }: { change: number }): JSX.Element {
  return change === 0 ? (
    <span>-</span>
  ) : change > 0 ? (
    <span style={{ color: "green" }}>
      <ArrowUpIcon />
      {change}
    </span>
  ) : (
    <span style={{ color: "red" }}>
      <ArrowDownIcon />
      {change}
    </span>
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
