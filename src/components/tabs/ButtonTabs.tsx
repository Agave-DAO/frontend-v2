import styled, { css } from 'styled-components'

export const ButtonTabs = styled.div`
  align-items: center;
  column-gap: 10px;
  display: flex;
  margin: 0 0 16px;
`

export const ButtonTab = styled.button<{ isActive?: boolean }>`
  align-items: center;
  background-color: transparent;
  border-radius: 8px;
  border: none;
  color: ${({ theme: { colors } }) => colors.textColor};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 1.6rem;
  font-weight: 400;
  height: 32px;
  justify-content: center;
  line-height: 1.2;
  opacity: 0.7;
  padding: 0 var(--padding-sm);
  text-decoration: none;
  transition: all 0.15s linear;
  user-select: none;

  &:active {
    opacity: 0.8;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${({ theme: { colors } }) => colors.mainDark3};
      opacity: 1;
    `}

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
    height: 42px;
    padding: 0 var(--padding-md);
  }
`

ButtonTab.defaultProps = {
  isActive: false,
}
