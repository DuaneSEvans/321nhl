import styled from "styled-components"
import { Scope, Standing, StandingWithChange } from "../types"
import { Team } from "./Team"

export function StandingsView({
  scope,
  standings,
  officialStandings,
}: {
  scope: Scope
  standings: Standing[]
  officialStandings: Standing[]
}): JSX.Element {
  const standingsWithChange = calculateStandingsWithChange(
    scope,
    standings,
    officialStandings
  )

  switch (scope) {
    case "League":
      return (
        <ViewWrapper>
          <Header>League</Header>
          <TeamsWrapper>
            {standingsWithChange.map((standing, i) => (
              <TeamWrapper key={standing.teamCommonName.default}>
                <Team standing={standing} rank={i + 1} />
              </TeamWrapper>
            ))}
          </TeamsWrapper>
        </ViewWrapper>
      )

    case "Conference": {
      const conferences = {
        Western: standingsWithChange.filter(
          (standing) => standing.conferenceName === "Western"
        ),
        Eastern: standingsWithChange.filter(
          (standing) => standing.conferenceName === "Eastern"
        ),
      }

      return (
        <ViewWrapper>
          {Object.entries(conferences).map(([name, standings]) => (
            <ConferenceWrapper key={name}>
              <Header>{name}</Header>
              <TeamsWrapper>
                {standings.map((standing, i) => (
                  <TeamWrapper key={standing.teamCommonName.default}>
                    <Team standing={standing} rank={i + 1} />
                  </TeamWrapper>
                ))}
              </TeamsWrapper>
            </ConferenceWrapper>
          ))}
        </ViewWrapper>
      )
    }

    case "Division": {
      const conferencesWithDivisions = {
        Western: {
          Pacific: standingsWithChange.filter(
            (standing) => standing.divisionName === "Pacific"
          ),
          Central: standingsWithChange.filter(
            (standing) => standing.divisionName === "Central"
          ),
        },
        Eastern: {
          Atlantic: standingsWithChange.filter(
            (standing) => standing.divisionName === "Atlantic"
          ),
          Metropolitan: standingsWithChange.filter(
            (standing) => standing.divisionName === "Metropolitan"
          ),
        },
      }

      return (
        <ViewWrapper>
          {Object.entries(conferencesWithDivisions).map(
            ([conferenceName, divisions]) => (
              <ConferenceWrapper key={conferenceName}>
                <Header>{conferenceName}</Header>
                {Object.entries(divisions).map(([divisionName, division]) => (
                  <Division
                    name={divisionName}
                    standings={division}
                    key={divisionName}
                  />
                ))}
              </ConferenceWrapper>
            )
          )}
        </ViewWrapper>
      )
    }

    case "Wild Card": {
      const pacificTop3 = standingsWithChange
        .filter((standing) => standing.divisionName === "Pacific")
        .slice(0, 3)
      const centralTop3 = standingsWithChange
        .filter((standing) => standing.divisionName === "Central")
        .slice(0, 3)
      const atlanticTop3 = standingsWithChange
        .filter((standing) => standing.divisionName === "Atlantic")
        .slice(0, 3)
      const metropolitanTop3 = standingsWithChange
        .filter((standing) => standing.divisionName === "Metropolitan")
        .slice(0, 3)

      const conferencesWithWildCard = {
        Western: {
          divisions: {
            Pacific: pacificTop3,
            Central: centralTop3,
          },
          wildCard: standingsWithChange.filter(
            (standing) =>
              ![...pacificTop3, ...centralTop3].includes(standing) &&
              standing.conferenceName === "Western"
          ),
        },
        Eastern: {
          divisions: {
            Atlantic: atlanticTop3,
            Metropolitan: metropolitanTop3,
          },
          wildCard: standingsWithChange.filter(
            (standing) =>
              ![...atlanticTop3, ...metropolitanTop3].includes(standing) &&
              standing.conferenceName === "Eastern"
          ),
        },
      }
      return (
        <ViewWrapper>
          {Object.entries(conferencesWithWildCard).map(
            ([conferenceName, { divisions, wildCard }]) => (
              <ConferenceWrapper key={conferenceName}>
                <Header>{conferenceName}</Header>
                {Object.entries(divisions).map(([divisionName, division]) => (
                  <Division
                    name={divisionName}
                    standings={division}
                    key={divisionName}
                  />
                ))}
                <SubHeader>Wild Card</SubHeader>
                <TeamsWrapper>
                  {wildCard.map((standing, i) => (
                    <div key={standing.teamCommonName.default}>
                      <TeamWrapper>
                        <Team standing={standing} rank={i + 1} />
                      </TeamWrapper>
                      {i === 1 && <Divider />}
                    </div>
                  ))}
                </TeamsWrapper>
              </ConferenceWrapper>
            )
          )}
        </ViewWrapper>
      )
    }
  }
}

// TODO(dse): dry up
function calculateStandingsWithChange(
  scope: Scope,
  calculated321Standings: Standing[],
  officialStandings: Standing[]
): StandingWithChange[] {
  // Wild card is special
  if (scope === "Wild Card") {
    const getTop3OfOtherDivision = (
      standing: Standing,
      standingsToCompare: Standing[]
    ) => {
      return standingsToCompare
        .filter(
          (s) =>
            s.divisionName !== standing.divisionName &&
            s.conferenceName === standing.conferenceName
        )
        .slice(0, 3)
    }

    const getWildCardPosition = (
      standing: Standing,
      standingsToCompare: Standing[],
      top3OfOtherDivision: Standing[]
    ) => {
      return standingsToCompare
        .filter((standingToCompare) => {
          return (
            standingToCompare.conferenceName === standing.conferenceName &&
            !top3OfOtherDivision.includes(standingToCompare)
          )
        })
        .findIndex(
          (s) => s.teamCommonName.default === standing.teamCommonName.default
        )
    }

    return calculated321Standings.map((standing) => {
      const top3OfOtherDivisionOfficial = getTop3OfOtherDivision(
        standing,
        officialStandings
      )
      const oldPosition = getWildCardPosition(
        standing,
        officialStandings,
        top3OfOtherDivisionOfficial
      )

      const top3OfOtherDivisionCalculated = getTop3OfOtherDivision(
        standing,
        calculated321Standings
      )
      const newPosition = getWildCardPosition(
        standing,
        calculated321Standings,
        top3OfOtherDivisionCalculated
      )

      return { ...standing, change: oldPosition - newPosition }
    })
  }

  const byMatchingScope =
    (scope: Scope, standing: Standing) => (providedStanding: Standing) => {
      if (scope === "League") {
        return true
      }
      if (scope === "Conference") {
        return providedStanding.conferenceName === standing.conferenceName
      }
      if (scope === "Division") {
        return providedStanding.divisionName === standing.divisionName
      }
      if (scope === "Wild Card") {
        throw new Error("Wild Card calculated separately")
      }
      return false
    }

  return calculated321Standings.map((standing) => {
    const oldPosition = officialStandings
      .filter(byMatchingScope(scope, standing))
      .findIndex(
        (s) => s.teamCommonName.default === standing.teamCommonName.default
      )
    const newPosition = calculated321Standings
      .filter(byMatchingScope(scope, standing))
      .findIndex(
        (s) => s.teamCommonName.default === standing.teamCommonName.default
      )
    return { ...standing, change: oldPosition - newPosition }
  })
}

function Division({
  name,
  standings,
}: {
  name: string
  standings: StandingWithChange[]
}): JSX.Element {
  return (
    <>
      <SubHeader>{name}</SubHeader>
      <TeamsWrapper>
        {standings.map((standing, i) => (
          <TeamWrapper key={standing.teamCommonName.default}>
            <Team standing={standing} rank={i + 1} />
          </TeamWrapper>
        ))}
      </TeamsWrapper>
    </>
  )
}

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--color-header-bg);
  padding: 8px;
`

const SubHeader = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  padding: 8px;
`

const ConferenceWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  padding: 8px;
`

const TeamWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ViewWrapper = styled.section`
  display: flex;
  flex-direction: column;
`

const Divider = styled.div`
  height: 1px;
  background-color: var(--color-secondary);
  margin-top: 16px;
`
