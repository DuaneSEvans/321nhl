"use client"
import styled from "styled-components"
import { StandingWithChange } from "../shared"
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid"
import { AnimatedTeamWrapper } from "./StandingsView"
import Image from "next/image"

export function Team({
  standing,
  rank,
}: {
  standing: StandingWithChange
  rank: number
}) {
  const {
    change,
    teamLogo,
    teamCommonName,
    teamAbbrev,
    regulationWins,
    nonRegulationWins,
    nonRegulationLosses,
    regulationLosses,
    points,
  } = standing

  const gamesPlayed =
    regulationWins + nonRegulationWins + nonRegulationLosses + regulationLosses

  const mobileRecord = `${regulationWins} - ${nonRegulationWins} - ${nonRegulationLosses} - ${regulationLosses}`

  return (
    <>
      <Stat>{rank}</Stat>
      <ChangeArrow change={change} />

      <TeamHeader>
        <TeamLogo src={teamLogo} />
        <TeamName>{teamCommonName.default}</TeamName>
        <TeamAbbreviation>{teamAbbrev.default}</TeamAbbreviation>
      </TeamHeader>

      <DesktopView>
        <Stat>{gamesPlayed}</Stat>
        <Stat>{regulationWins}</Stat>
        <Stat>{nonRegulationWins}</Stat>
        <Stat>{nonRegulationLosses}</Stat>
        <Stat>{regulationLosses}</Stat>
        <Stat>{points}</Stat>
      </DesktopView>
      <MobileView>
        <Stat>{mobileRecord}</Stat>
        <Stat>{points}</Stat>
      </MobileView>
    </>
  )
}

export function TableHeader(): JSX.Element {
  return (
    <AnimatedTeamWrapper>
      <StatHeader>Rank</StatHeader>
      <ChangeArrow change={0} />
      <TeamHeader>Team</TeamHeader>
      <DesktopView>
        <StatHeader>GP</StatHeader>
        <StatHeader>W</StatHeader>
        <StatHeader>OTW</StatHeader>
        <StatHeader>OTL</StatHeader>
        <StatHeader>L</StatHeader>
        <StatHeader>Pts</StatHeader>
      </DesktopView>
      <MobileView>
        <StatHeader>W-OTW-OTL-L</StatHeader>
        <StatHeader>Pts</StatHeader>
      </MobileView>
    </AnimatedTeamWrapper>
  )
}

const DesktopView = styled.div`
  display: contents;

  @media (max-width: 475px) {
    display: none;
  }
`

const MobileView = styled.div`
  display: contents;

  @media (min-width: 476px) {
    display: none;
  }
`

const TeamName = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    display: none;
  }
`

const TeamAbbreviation = styled.span`
  font-weight: bold;

  @media (min-width: 641px) {
    display: none;
  }
`

function TeamLogo({ src }: { src: string }): JSX.Element {
  return (
    <ImageWrapper>
      <Image src={src} alt="Team Logo" fill />
    </ImageWrapper>
  )
}

const StatHeader = styled.span`
  text-align: center;
  font-weight: bold;
  white-space: nowrap;
`

const ImageWrapper = styled.div`
  width: 36px;
  height: 24px;
  position: relative;
  margin-right: 0.5rem;
  min-width: 36px;
`

function ChangeArrow({ change }: { change: number }): JSX.Element {
  return change === 0 ? (
    <span></span>
  ) : change > 0 ? (
    <ChangeWrapper style={{ color: "green" }}>
      <ArrowUpIcon />
      {Math.abs(change)}
    </ChangeWrapper>
  ) : (
    <ChangeWrapper style={{ color: "red" }}>
      <ArrowDownIcon />
      {Math.abs(change)}
    </ChangeWrapper>
  )
}

const ChangeWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Stat = styled.span`
  text-align: center;
  white-space: nowrap;
`

const TeamHeader = styled.span`
  display: flex;
  align-items: center;
  font-weight: bold;
`
