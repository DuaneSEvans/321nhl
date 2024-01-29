import styled from "styled-components"
import { ViewType } from "./Standings"
import { Standing } from "./types"
import { Team } from "./Team"

export function StandingsView({
  title,
  standings,
}: {
  title: ViewType
  standings: Standing[]
}): JSX.Element {
  return (
    <ViewWrapper>
      <Header>{title}</Header>
      <TeamsWrapper>
        {standings.map((standing, i) => {
          return (
            <TeamWrapper key={i}>
              <Team standing={standing} rank={i + 1} />
            </TeamWrapper>
          )
        })}
      </TeamsWrapper>
    </ViewWrapper>
  )
}

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
