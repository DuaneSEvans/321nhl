import styled from "styled-components"
import { PointSystem, Scope, scopes } from "../types"

export default function Nav({
  selectedPointSystem,
  setSelectedPointSystem,
  selectedScope,
  setSelectedScope,
}: {
  selectedPointSystem: PointSystem
  setSelectedPointSystem: (pointSystem: PointSystem) => void
  selectedScope: Scope
  setSelectedScope: (scope: Scope) => void
}) {
  return (
    <Wrapper>
      <SystemNav>
        <RadioButtonWrapper>
          <input
            type="radio"
            id={PointSystem.THREE_TWO_ONE_ZERO}
            name="system"
            value={PointSystem.THREE_TWO_ONE_ZERO}
            checked={selectedPointSystem === PointSystem.THREE_TWO_ONE_ZERO}
            onChange={() =>
              setSelectedPointSystem(PointSystem.THREE_TWO_ONE_ZERO)
            }
          />
          <label htmlFor={PointSystem.THREE_TWO_ONE_ZERO}>3-2-1-0</label>
        </RadioButtonWrapper>
        <RadioButtonWrapper>
          <input
            type="radio"
            id={PointSystem.REGULAR}
            name="system"
            value={PointSystem.REGULAR}
            onChange={() => setSelectedPointSystem(PointSystem.REGULAR)}
            checked={selectedPointSystem === PointSystem.REGULAR}
          />
          <label htmlFor={PointSystem.REGULAR}>Regular</label>
        </RadioButtonWrapper>
      </SystemNav>
      <ScopeNav>
        {scopes.map((scope) => (
          <ScopeButton
            $isSelected={selectedScope === scope}
            key={scope}
            onClick={() => setSelectedScope(scope)}
          >
            {scope}
          </ScopeButton>
        ))}
      </ScopeNav>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 12px 8px 0px 8px;
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
`
const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  @media (prefers-color-scheme: dark) {
    color: white;
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
