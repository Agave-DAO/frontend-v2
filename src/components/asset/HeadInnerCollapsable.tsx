import styled, { css } from 'styled-components'

export const HeadInnerCollapsable = styled.div<{ isOpen?: boolean }>`
  --container-height: 165px;

  border-top: 0 solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  transition: all 0.15s linear;
  width: 100%;

  > * {
    opacity: 0;
    transition: opacity 0.25s linear;
  }

  ${({ isOpen }) =>
    isOpen
      ? css`
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 16px;
          max-height: var(--container-height);
          padding-top: 16px;

          > * {
            opacity: 1;
          }
        `
      : css`
          max-height: 0;
          overflow: hidden;
        `}
`
