import styled, { css } from 'styled-components'

import { TitleValueType } from '@/src/components/asset/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  position: relative;

  &::before {
    background-color: rgba(1, 157, 139, 0.15);
    content: '';
    height: calc(100% + var(--market-rows-row-gap));
    left: calc(var(--market-row-column-gap) / -2);
    position: absolute;
    top: 0;
    width: 1px;
  }

  &:first-child::before {
    display: none;
  }
`

Wrapper.defaultProps = {
  className: 'marketCellWrapper',
}

const MarketCellTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

const MarketCellValue = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 4px;
  display: flex;
  flex-wrap: wrap;
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: auto 0 0 0;
`

// make collapsible version!!1111
export const MarketRows = styled.div`
  --market-rows-row-gap: 8px;
  --container-height: 160px;

  display: flex;
  flex-direction: column;
  row-gap: var(--market-rows-row-gap);
`

export const MarketRowsCollapsable = styled(MarketRows)<{ isOpen?: boolean }>`
  transition: all 0.15s linear;

  > * {
    opacity: 0;
    transition: opacity 0.25s linear;
  }

  ${({ isOpen }) =>
    isOpen
      ? css`
          max-height: 115px;

          > * {
            opacity: 1;
          }
        `
      : css`
          max-height: 0;
          overflow: hidden;
        `}
`

MarketRowsCollapsable.defaultProps = {
  isOpen: true,
}

export const MarketRow = styled.div`
  --market-row-column-gap: 20px;

  column-gap: var(--market-row-column-gap);
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;

  &:last-child {
    .marketCellWrapper {
      &::before {
        height: 100%;
      }
    }
  }
`

interface Props {
  data: TitleValueType
}

export const MarketCell: React.FC<Props> = ({
  data: { extraInfo, title, value },
  ...restProps
}) => (
  <Wrapper {...restProps}>
    <MarketCellTitle>{title}</MarketCellTitle>
    <MarketCellValue>
      <Percentage decimals={25} value={value} />
      {extraInfo}
    </MarketCellValue>
  </Wrapper>
)
