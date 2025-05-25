"use client"
import styled from "styled-components"
import { motion } from "framer-motion"
import {
  PointSystem,
  REGULAR_COLORS,
  Scope,
  scopes,
  THREE_TWO_ONE_ZERO_COLORS,
} from "../shared"
import { usePointSystem } from "./PointSystemProvider"

const transition = { type: "spring", stiffness: 500, damping: 40 }

export default function Nav({
  selectedScope,
  setScope,
}: {
  selectedScope: Scope
  setScope: (scope: Scope) => void
}) {
  const { pointSystem, setPointSystem } = usePointSystem()
  const targetAccentColor =
    pointSystem === PointSystem.REGULAR
      ? REGULAR_COLORS["--color-accent"]
      : THREE_TWO_ONE_ZERO_COLORS["--color-accent"]

  return (
    <Wrapper>
      <SystemNavWrapper>
        <SystemNav>
          <AnimatedBackground
            layout
            initial={false}
            animate={{
              x: pointSystem === PointSystem.REGULAR ? "0%" : "100%",
              borderTopLeftRadius:
                pointSystem === PointSystem.REGULAR ? "8px" : "0px",
              borderBottomLeftRadius:
                pointSystem === PointSystem.REGULAR ? "8px" : "0px",
              borderTopRightRadius:
                pointSystem === PointSystem.THREE_TWO_ONE_ZERO ? "8px" : "0px",
              borderBottomRightRadius:
                pointSystem === PointSystem.THREE_TWO_ONE_ZERO ? "8px" : "0px",
              backgroundColor: targetAccentColor,
            }}
            transition={transition}
          />
          <RadioButtonWrapper>
            <input
              type="radio"
              id={PointSystem.REGULAR}
              name="system"
              value={PointSystem.REGULAR}
              onChange={() => setPointSystem(PointSystem.REGULAR)}
              checked={pointSystem === PointSystem.REGULAR}
            />
            <SystemLabel htmlFor={PointSystem.REGULAR}>Regular</SystemLabel>
          </RadioButtonWrapper>
          <RadioButtonWrapper>
            <input
              type="radio"
              id={PointSystem.THREE_TWO_ONE_ZERO}
              name="system"
              value={PointSystem.THREE_TWO_ONE_ZERO}
              checked={pointSystem === PointSystem.THREE_TWO_ONE_ZERO}
              onChange={() => setPointSystem(PointSystem.THREE_TWO_ONE_ZERO)}
            />
            <SystemLabel htmlFor={PointSystem.THREE_TWO_ONE_ZERO}>
              3-2-1-0
            </SystemLabel>
          </RadioButtonWrapper>
        </SystemNav>
      </SystemNavWrapper>
      <ScopeNav>
        {scopes.map((scope) => (
          <ScopeButton
            layout
            initial={false}
            animate={{
              borderColor:
                selectedScope === scope ? targetAccentColor : "black",
            }}
            transition={transition}
            $isSelected={selectedScope === scope}
            key={scope}
            onClick={() => setScope(scope)}
          >
            {scope}
          </ScopeButton>
        ))}
      </ScopeNav>
    </Wrapper>
  )
}

const AnimatedBackground = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  z-index: 0;
`

const SystemNavWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
`
const SystemLabel = styled.label`
  width: 100%;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  background-color: transparent;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 8px 0px 8px;
  gap: 8px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--color-nav-bg);
  height: var(--nav-height);
`

const SystemNav = styled.nav`
  display: flex;
  width: 100%;
  max-width: 500px;
  height: 100%;
  border: 1px solid var(--color-secondary);
  border-radius: 8px;
  position: relative;
  overflow: hidden;
`
const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
  color: var(--color-unselected-system-text);

  input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  input[type="radio"]:checked + label {
    color: var(--color-selected-system-text);
    font-weight: bold;
  }
`
const ScopeNav = styled.nav`
  display: flex;
  width: 100%;
`

const ScopeButton = styled(motion.button)<{ $isSelected: boolean }>`
  background-color: transparent;
  flex: 1;
  border: none;
  color: ${({ $isSelected }) =>
    $isSelected ? "var(--color-primary)" : "var(--color-secondary)"};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};
  border-bottom: 4px solid;
  /* border-color: ${({ $isSelected }) =>
    $isSelected ? "var(--color-accent)" : "black"}; */
  padding: 8px 0px;
  cursor: pointer;
`
