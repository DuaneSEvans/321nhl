"use client"
import styled from "styled-components"
import { PointSystem, Scope, scopes } from "../shared"
import { usePointSystem } from "./PointSystemProvider"

export default function Nav({
  selectedScope,
  setScope,
}: {
  selectedScope: Scope
  setScope: (scope: Scope) => void
}) {
  const { pointSystem, setPointSystem } = usePointSystem()
  return (
    <Wrapper>
      <SystemNavWrapper>
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
  justify-content: space-between;
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
    background-color: var(--color-accent);
    border-radius: 8px 0px 0px 8px;
    color: var(--color-selected-system-text);
    font-weight: bold;
  }

  &:last-child input[type="radio"]:checked + label {
    border-radius: 0px 8px 8px 0px;
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
