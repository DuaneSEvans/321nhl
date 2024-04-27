import styled from "styled-components"
import { ViewType } from "./Standings"
import { Standing } from "../types"
import { Team } from "./Team"

type TopThreeInDiv = { name: string; standings: Standing[] }

export function WildcardStandingsView({
  title,
  standings,
}: {
  title: ViewType
  standings: Standing[]
}): JSX.Element {
  const { topThreeInDiv1, topThreeInDiv2, wildCards } =
    calculatePlayOffSpots(standings)

  return (
    <ViewWrapper>
      <Header>{title}</Header>
      <TeamsWrapper>
        <TopThreeInDiv topThreeInDiv={topThreeInDiv1} />
        <Divider />
        <TopThreeInDiv topThreeInDiv={topThreeInDiv2} />
        <Divider />
        <WildCards wildCards={wildCards} />
      </TeamsWrapper>
    </ViewWrapper>
  )
}

function WildCards({ wildCards }: { wildCards: Standing[] }): JSX.Element {
  return (
    <>
      {wildCards.map((standing, i) => {
        return (
          <TeamWrapper key={i}>
            <Team standing={standing} rank={i + 1} />
          </TeamWrapper>
        )
      })}
    </>
  )
}

function TopThreeInDiv({
  topThreeInDiv,
}: {
  topThreeInDiv: TopThreeInDiv
}): JSX.Element {
  return (
    <TopThreeInDivWrapper>
      <h2>{topThreeInDiv.name}</h2>
      {topThreeInDiv.standings.map((standing, i) => {
        return (
          <TeamWrapper key={i}>
            <Team standing={standing} rank={i + 1} />
          </TeamWrapper>
        )
      })}
    </TopThreeInDivWrapper>
  )
}

function calculatePlayOffSpots(standings: Standing[]): {
  topThreeInDiv1: TopThreeInDiv
  topThreeInDiv2: TopThreeInDiv
  wildCards: Standing[]
} {
  const topThreeInDiv1: TopThreeInDiv = {
    name: "",
    standings: [],
  }
  const topThreeInDiv2: TopThreeInDiv = {
    name: "",
    standings: [],
  }
  const wildCards: Standing[] = []

  standings.forEach((s) => {
    if (
      (s.divisionName === "Pacific" || s.divisionName === "Atlantic") &&
      topThreeInDiv1.standings.length < 3
    ) {
      addToTopThreeInDiv(topThreeInDiv1, s)
    } else if (
      (s.divisionName === "Central" || s.divisionName === "Metropolitan") &&
      topThreeInDiv2.standings.length < 3
    ) {
      addToTopThreeInDiv(topThreeInDiv2, s)
    } else {
      wildCards.push(s)
    }
  })

  return { topThreeInDiv1, topThreeInDiv2, wildCards }
}

function addToTopThreeInDiv(topThreeInDiv: TopThreeInDiv, s: Standing) {
  topThreeInDiv.standings.push(s)
  topThreeInDiv.name === "" ? (topThreeInDiv.name = s.divisionName) : null
}

const Divider = styled.hr``

const TopThreeInDivWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Header = styled.h1`
  font-size: 2rem;
  text-align: center;
`

const TeamsWrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-width: 100vw;
  scroll-snap-align: center;
  padding: 16px;
`

const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ViewWrapper = styled.section``
