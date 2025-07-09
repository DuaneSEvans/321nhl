"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import { baseMotionProps } from "../shared"

function InfoModal({ onClose }: { onClose: () => void }) {
  return (
    <Wrapper
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={baseMotionProps}
    >
      <Content
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={baseMotionProps}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <XIcon />
        </CloseButton>
        <ContentBody>
          <Title>The 3-2-1 Point System</Title>
          <Text>
            The NHL's current system creates strange incentives by awarding a
            different number of total points for games that end in regulation
            (2) versus overtime (3). This often encourages conservative play
            from teams just trying to secure the single "loser point."
          </Text>
          <Text>
            The 3-2-1 system, widely used in European hockey and other sports
            leagues, fixes this by making every game worth three points:
          </Text>
          <List>
            <li>
              <strong>3 points</strong> for a regulation win
            </li>
            <li>
              <strong>2 points</strong> for an overtime or shootout win
            </li>
            <li>
              <strong>1 point</strong> for an overtime or shootout loss
            </li>
            <li>
              <strong>0 points</strong> for a regulation loss
            </li>
          </List>
          <Text>
            This site reimagines the NHL standings as if the league used this
            more competitive model. See how things would shake out.
          </Text>
          <Text>
            Find me at{" "}
            <Link href="https://duane.dev" target="_blank">
              duane.dev
            </Link>
            .
          </Text>
        </ContentBody>
      </Content>
    </Wrapper>
  )
}

export default InfoModal

const CloseButton = styled.button`
  display: flex;
  align-self: flex-end;
  align-items: center;
  justify-content: end;
  background-color: transparent;
  border: none;
  cursor: pointer;
`

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={24}
      height={24}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  )
}

const List = styled.ul`
  padding-left: 24px;
  list-style: none;
`

const Text = styled.p`
  text-align: justify;
`

const Link = styled.a`
  text-decoration: underline;
  color: var(--color-info-accent);
`

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
`

const Wrapper = styled(motion.div)`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 11;
  isolation: isolate;
  padding: 12px 8px;
`
const Content = styled(motion.div)`
  background-color: var(--color-info-modal-bg);
  border-radius: 12px;
  padding: 24px 16px;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 100%;
  overflow-y: auto;
`
const ContentBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`
