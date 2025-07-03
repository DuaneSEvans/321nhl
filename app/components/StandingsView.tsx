import styled from "styled-components"
import {
  divisions,
  PointSystem,
  Scope,
  Standing,
  StandingWithChange,
} from "../shared"
import { TableHeader, Team } from "./Team"
import React, { useEffect, useRef } from "react"
import { motion } from "framer-motion"

function usePrevious<T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export function StandingsView({
  scope,
  standingsWithSystem,
  officialStandings,
}: {
  scope: Scope
  standingsWithSystem: { standings: Standing[]; system: PointSystem }
  officialStandings: Standing[]
}): JSX.Element {
  const standingsWithChange = calculateStandingsWithChange(
    scope,
    standingsWithSystem.standings,
    officialStandings
  )
  const prevSystem = usePrevious(standingsWithSystem.system)
  const shouldAnimate = prevSystem !== standingsWithSystem.system

  switch (scope) {
    case "League":
      return (
        <ViewWrapper>
          <Header>League</Header>
          <TeamsWrapper>
            <TableHeader />
            {standingsWithChange.map((standing, i) => (
              <AnimatedTeam
                standing={standing}
                rank={i + 1}
                key={standing.teamCommonName.default}
                shouldAnimate={shouldAnimate}
              />
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
                <TableHeader />
                {standings.map((standing, i) => (
                  <AnimatedTeam
                    standing={standing}
                    rank={i + 1}
                    key={standing.teamCommonName.default}
                    shouldAnimate={shouldAnimate}
                  />
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
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </ConferenceWrapper>
            )
          )}
        </ViewWrapper>
      )
    }

    case "Wild Card": {
      const [pacificTop3, centralTop3, atlanticTop3, metropolitanTop3] =
        divisions.map((division) => {
          return standingsWithChange
            .filter((standing) => standing.divisionName === division)
            .slice(0, 3)
        })

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
                    shouldAnimate={shouldAnimate}
                  />
                ))}
                <SubHeader>Wild Card</SubHeader>
                <TeamsWrapper>
                  <TableHeader />
                  {wildCard.map((standing, i) => (
                    <React.Fragment key={standing.teamCommonName.default}>
                      <AnimatedTeam
                        standing={standing}
                        rank={i + 1}
                        shouldAnimate={shouldAnimate}
                      />
                      {i === 1 && <Divider />}
                    </React.Fragment>
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

function AnimatedTeam({
  standing,
  rank,
  shouldAnimate,
}: {
  standing: StandingWithChange
  rank: number
  shouldAnimate: boolean
}): JSX.Element {
  return (
    <AnimatedTeamWrapper
      layoutId={standing.teamCommonName.default}
      layout="position"
      transition={
        shouldAnimate
          ? { type: "spring", stiffness: 200, damping: 30 }
          : { duration: 0 }
      }
    >
      <Team standing={standing} rank={rank} />
    </AnimatedTeamWrapper>
  )
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
  shouldAnimate,
}: {
  name: string
  standings: StandingWithChange[]
  shouldAnimate: boolean
}): JSX.Element {
  return (
    <>
      <SubHeader>{name}</SubHeader>
      <TeamsWrapper>
        <TableHeader />
        {standings.map((standing, i) => (
          <AnimatedTeam
            standing={standing}
            rank={i + 1}
            key={standing.teamCommonName.default}
            shouldAnimate={shouldAnimate}
          />
        ))}
      </TeamsWrapper>
    </>
  )
}

const Header = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--color-header-bg);
  padding: 8px calc(50vw - 50% + 8px);
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
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

export const AnimatedTeamWrapper = styled(motion.div)`
  display: grid;
  /* rank, change, name, GP, W, OTW, OTL, L, Pts */
  grid-template-columns: 1fr 1rem minmax(72px, 3fr) repeat(6, 1fr);

  @media (max-width: 640px) {
    /* rank, change, name, record, pts */
    grid-template-columns: 1rem 1rem 2fr 2fr 1fr;
  }

  align-items: center;
  gap: 1rem;
  padding: 8px 0 8px 0;
`

const Divider = styled.div`
  height: 4px;
  background-color: black;
  margin: 4px 0 4px 0;
`

const TeamsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 8px;

  & > ${AnimatedTeamWrapper}:not(:last-of-type) {
    border-bottom: 1px solid var(--color-secondary);
  }

  & > ${AnimatedTeamWrapper}:has(+ ${Divider}) {
    border-bottom: none;
  }
`

const ViewWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: var(--max-content-width);
`
