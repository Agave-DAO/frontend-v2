import { css } from 'styled-components'

export const tooltipCSS = css`
  .customTooltip {
    background-color: ${({ theme: { tooltip } }) => tooltip.backgroundColor};
    border-radius: 8px;
    color: ${({ theme: { tooltip } }) => tooltip.textColor};
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px 16px;
    z-index: 1000;

    a {
      color: ${({ theme: { colors } }) => colors.mainLight};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    .text {
      color: ${({ theme: { tooltip } }) => tooltip.textColor};
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.5;
    }

    .rows {
      display: flex;
      flex-direction: column;
      row-gap: 6px;
    }

    .row {
      align-items: center;
      background-color: ${({ theme: { colors } }) => colors.darkGreen50};
      border-radius: 4px;
      display: flex;
      justify-content: space-between;
      padding: 6px 10px;
    }

    .rowKey {
      color: ${({ theme: { tooltip } }) => tooltip.textColor};
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.2;
    }

    .rowValue {
      color: ${({ theme: { tooltip } }) => tooltip.textColor};
      font-size: 1.4rem;
      font-weight: 400;
      line-height: 1.2;
    }
  }
`
