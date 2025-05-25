"use client"
import styled from "styled-components"
import { PointSystem, Scope, scopes } from "../shared"
import { usePointSystem } from "./ThemeHTMLWrapper"

export default function Nav({
  pointSystem,
  selectedScope,
  setScope,
}: {
  pointSystem: PointSystem
  selectedScope: Scope
  setScope: (scope: Scope) => void
}) {
  const { setPointSystem } = usePointSystem()
  return (
    <Wrapper>
      <SystemNav>
        <RadioButtonWrapper>
          <input
            type="radio"
            id={PointSystem.REGULAR}
            name="system"
            value={PointSystem.REGULAR}
            onChange={() => setPointSystem(PointSystem.REGULAR)}
            checked={pointSystem === PointSystem.REGULAR}
          />
          <label htmlFor={PointSystem.REGULAR}>Regular</label>
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
          <label htmlFor={PointSystem.THREE_TWO_ONE_ZERO}>3-2-1-0</label>
        </RadioButtonWrapper>
      </SystemNav>
      <ScopeNav>
        {scopes.map((scope) => (
          <ScopeButton
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 8px 0px 8px;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  justify-content: space-between;
  background-color: black;
  height: var(--nav-height);
`

const SystemNav = styled.nav`
  display: flex;
  width: 100%;
  justify-content: space-around;
  height: 100%;
`
const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media (prefers-color-scheme: dark) {
    color: white;
  }

  input[type="radio"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
  }

  input[type="radio"]:checked + label {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
  }
`
const ScopeNav = styled.nav`
  display: flex;
  width: 100%;
`

const ScopeButton = styled.button<{ $isSelected: boolean }>`
  background-color: transparent;
  flex: 1;
  border: none;
  color: ${({ $isSelected }) =>
    $isSelected ? "var(--color-primary)" : "var(--color-secondary)"};
  font-weight: ${({ $isSelected }) => ($isSelected ? "bold" : "normal")};
  border-bottom: 4px solid
    ${({ $isSelected }) => ($isSelected ? "var(--color-accent)" : "black")};
  padding: 8px 0px;
  cursor: pointer;
`
