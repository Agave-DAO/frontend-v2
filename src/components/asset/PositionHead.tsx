import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Head } from '@/src/components/asset/Asset'
import { AssetBadge } from '@/src/components/asset/AssetBadge'
import { HeadInnerCollapsable } from '@/src/components/asset/HeadInnerCollapsable'
import { Icon } from '@/src/components/asset/Icon'
import { Swap } from '@/src/components/assets/Swap'
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'
import {
  ClosedCollateralSwapDetails,
  ClosedPositionDetails,
  CollateralSwapDetails,
  PositionDetails,
} from '@/src/pagePartials/strategy/positions/PositionDetails'

const iconDimensions = 36

const Wrapper = styled(Head)`
  align-items: center;
  column-gap: 4px;
  flex-wrap: wrap;
  padding-bottom: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    column-gap: 8px;
  }
`

const Icons = styled.div`
  align-items: center;
  display: flex;
`

const OverlappingIcon = styled(Icon)`
  margin-left: -${(iconDimensions + 20) / 2}px;
`

const Values = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto 0;
`

const Value = styled.span`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  text-transform: uppercase;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.9rem;
  }
`

const Badges = styled.div`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  margin-left: auto;
  row-gap: 4px;
`

const Controls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  width: 100%;
`

const Description = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.white60};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

const Collapsable = styled(HeadInnerCollapsable)`
  --container-height: 'none';

  border: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      max-height: var(--container-height);
      padding-top: 16px;

      > * {
        opacity: 1;
      }
    `}
`

interface Props {
  positionTokens: any
  value: string
}

export const PositionHead: React.FC<Props> = ({ positionTokens, value, ...restProps }) => {
  const { status, tokens, type } = positionTokens
  const notCollateralSwap = type === 'long' || type === 'short'
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper {...restProps}>
      <Icons>
        <Icon dimensions={iconDimensions} symbol={tokens[0].symbol} />
        <OverlappingIcon dimensions={iconDimensions} symbol={tokens[1].symbol} />
      </Icons>
      <Values>
        <Value>
          {tokens[0].value} {tokens[0].symbol}
        </Value>
        <Value>
          {tokens[1].value} {tokens[1].symbol}
        </Value>
      </Values>
      <Badges>
        <AssetBadge type={type as 'long' | 'short' | 'collateralSwap' | 'neutral' | undefined}>
          {type === 'long' && 'Long'}
          {type === 'short' && 'Short'}
          {type === 'collateralSwap' && 'Coll. Swap'}
        </AssetBadge>
        <AssetBadge type={'neutral'}>{status}</AssetBadge>
      </Badges>
      <Controls>
        <Description>
          {notCollateralSwap && `Limit price: ${value}`}
          {type === 'collateralSwap' && (
            <>
              {value} <Swap />
            </>
          )}
        </Description>
        <ButtonToggleInfo isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </Controls>
      <Collapsable isOpen={isOpen}>
        {status === 'open' ? (
          notCollateralSwap ? (
            <PositionDetails />
          ) : (
            <CollateralSwapDetails />
          )
        ) : notCollateralSwap ? (
          <ClosedPositionDetails />
        ) : (
          <ClosedCollateralSwapDetails />
        )}
      </Collapsable>
    </Wrapper>
  )
}
