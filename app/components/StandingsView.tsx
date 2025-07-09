"use client"
import styled from "styled-components"
import {
  baseMotionProps,
  divisions,
  PointSystem,
  REGULAR_COLORS,
  Scope,
  Standing,
  StandingWithChange,
  THREE_TWO_ONE_ZERO_COLORS,
} from "../shared"
import { TableHeader, Team } from "./Team"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { systemTransition } from "./Nav"

export function StandingsView({
  scope,
  standingsWithSystem,
  officialStandings,
  systemChanged,
}: {
  scope: Scope
  standingsWithSystem: { standings: Standing[]; system: PointSystem }
  officialStandings: Standing[]
  systemChanged: boolean
}): JSX.Element {
  const standingsWithChange = calculateStandingsWithChange(
    scope,
    standingsWithSystem.standings,
    officialStandings
  )

  const [alternateRowBgColor, headerBgColor] = getSystemColors(
    standingsWithSystem.system
  )

  switch (scope) {
    case "League":
      return (
        <AnimatedViewWrapper>
          <AnimatedHeader targetAccentColor={headerBgColor}>
            League
          </AnimatedHeader>
          <AnimatedTeams scopeKey={scope}>
            <TableHeader />
            {standingsWithChange.map((standing, i) => (
              <AnimatedTeam
                standing={standing}
                rank={i + 1}
                key={standing.teamCommonName.default}
                shouldSlideTeam={systemChanged}
                alternateRowBgColor={alternateRowBgColor}
                isOdd={i % 2 === 0}
              />
            ))}
          </AnimatedTeams>
        </AnimatedViewWrapper>
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
        <AnimatedViewWrapper>
          {Object.entries(conferences).map(([name, standings]) => (
            <ConferenceWrapper key={name}>
              <AnimatedHeader targetAccentColor={headerBgColor}>
                {name}
              </AnimatedHeader>
              <AnimatedTeams scopeKey={name}>
                <TableHeader />
                {standings.map((standing, i) => (
                  <AnimatedTeam
                    standing={standing}
                    rank={i + 1}
                    key={standing.teamCommonName.default}
                    shouldSlideTeam={systemChanged}
                    isOdd={i % 2 === 0}
                    alternateRowBgColor={alternateRowBgColor}
                  />
                ))}
              </AnimatedTeams>
            </ConferenceWrapper>
          ))}
        </AnimatedViewWrapper>
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
        <AnimatedViewWrapper>
          {Object.entries(conferencesWithDivisions).map(
            ([conferenceName, divisions]) => (
              <ConferenceWrapper key={conferenceName}>
                <AnimatedHeader targetAccentColor={headerBgColor}>
                  {conferenceName}
                </AnimatedHeader>
                {Object.entries(divisions).map(([divisionName, division]) => (
                  <Division
                    name={divisionName}
                    standings={division}
                    key={divisionName}
                    systemChanged={systemChanged}
                    scope={scope}
                    alternateRowBgColor={alternateRowBgColor}
                  />
                ))}
              </ConferenceWrapper>
            )
          )}
        </AnimatedViewWrapper>
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
        <AnimatedViewWrapper>
          {Object.entries(conferencesWithWildCard).map(
            ([conferenceName, { divisions, wildCard }]) => (
              <ConferenceWrapper key={conferenceName}>
                <AnimatedHeader targetAccentColor={headerBgColor}>
                  {conferenceName}
                </AnimatedHeader>
                {Object.entries(divisions).map(([divisionName, division]) => (
                  <Division
                    name={divisionName}
                    standings={division}
                    key={divisionName}
                    systemChanged={systemChanged}
                    scope={scope}
                    alternateRowBgColor={alternateRowBgColor}
                  />
                ))}
                <AnimatedSubHeader>Wild Card</AnimatedSubHeader>
                <AnimatedTeams scopeKey={scope}>
                  <TableHeader />
                  {wildCard.map((standing, i) => (
                    <React.Fragment key={standing.teamCommonName.default}>
                      <AnimatedTeam
                        standing={standing}
                        rank={i + 1}
                        shouldSlideTeam={systemChanged}
                        isOdd={i % 2 === 0}
                        alternateRowBgColor={alternateRowBgColor}
                      />
                      {i === 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </AnimatedTeams>
              </ConferenceWrapper>
            )
          )}
        </AnimatedViewWrapper>
      )
    }
  }
}

function AnimatedSubHeader({ children }: { children: React.ReactNode }) {
  return (
    <AnimatedSubHeaderWrapper {...subHeaderMotionProps}>
      {children}
    </AnimatedSubHeaderWrapper>
  )
}

function AnimatedTeam({
  standing,
  rank,
  shouldSlideTeam,
  isOdd,
  alternateRowBgColor,
}: {
  standing: StandingWithChange
  rank: number
  shouldSlideTeam: boolean
  isOdd: boolean
  alternateRowBgColor: string
}): JSX.Element {
  return (
    <AnimatedTeamWrapper
      layoutId={standing.teamCommonName.default}
      layout="position"
      animate={{
        backgroundColor: isOdd ? alternateRowBgColor : "rgba(255, 255, 255, 0)",
      }}
      transition={
        shouldSlideTeam
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

function getSystemColors(system: PointSystem): [string, string] {
  return system === PointSystem.REGULAR
    ? [
        REGULAR_COLORS["--color-accent-tertiary"],
        REGULAR_COLORS["--color-accent-secondary"],
      ]
    : [
        THREE_TWO_ONE_ZERO_COLORS["--color-accent-tertiary"],
        THREE_TWO_ONE_ZERO_COLORS["--color-accent-secondary"],
      ]
}

function Division({
  name,
  standings,
  systemChanged,
  scope,
  alternateRowBgColor,
}: {
  name: string
  standings: StandingWithChange[]
  systemChanged: boolean
  scope: Scope
  alternateRowBgColor: string
}): JSX.Element {
  return (
    <>
      <AnimatedSubHeader>{name}</AnimatedSubHeader>
      <AnimatedTeams scopeKey={scope}>
        <TableHeader />
        {standings.map((standing, i) => (
          <AnimatedTeam
            standing={standing}
            rank={i + 1}
            key={standing.teamCommonName.default}
            shouldSlideTeam={systemChanged}
            isOdd={i % 2 === 0}
            alternateRowBgColor={alternateRowBgColor}
          />
        ))}
      </AnimatedTeams>
    </>
  )
}

const subHeaderMotionProps = {
  ...baseMotionProps,
  transition: { ...baseMotionProps, delay: 0 },
}

const teamsMotionProps = {
  ...baseMotionProps,
  transition: { ...baseMotionProps, delay: 0.1 },
}

function AnimatedViewWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AnimatePresence mode="wait">
      <ViewWrapper>{children}</ViewWrapper>
    </AnimatePresence>
  )
}

function AnimatedTeams({
  children,
  scopeKey,
}: {
  children: React.ReactNode
  scopeKey: string
}) {
  return (
    <AnimatedTeamsWrapper key={scopeKey} {...teamsMotionProps}>
      {children}
    </AnimatedTeamsWrapper>
  )
}

function AnimatedHeader({
  children,
  targetAccentColor,
}: {
  children: React.ReactNode
  targetAccentColor: string
}) {
  return (
    <AnimatedHeaderWrapper
      initial={false}
      animate={{
        backgroundColor: targetAccentColor,
      }}
      transition={systemTransition}
    >
      {children}
    </AnimatedHeaderWrapper>
  )
}

const AnimatedHeaderWrapper = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: bold;
  background-color: var(--color-accent-secondary);
  padding: 8px calc(50vw - 50% + 8px);
  margin-left: calc(50% - 50vw);
  margin-right: calc(50% - 50vw);
`

const AnimatedSubHeaderWrapper = styled(motion.h2)`
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

  @media (max-width: 475px) {
    /* rank, change, name, record, pts */
    grid-template-columns: 1fr 1rem 2fr 2fr 1fr;
  }

  align-items: center;
  gap: 1rem;
  padding: 8px 0 8px 0;
`

const Divider = styled.div`
  height: 4px;
  background-color: black;
`

const AnimatedTeamsWrapper = styled(motion.div)`
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
