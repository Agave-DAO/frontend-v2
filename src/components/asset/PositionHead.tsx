import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Head } from '@/src/components/asset/Asset'
import { AssetBadge } from '@/src/components/asset/AssetBadge'
import { HeadInnerCollapsable } from '@/src/components/asset/HeadInnerCollapsable'
import { Icon } from '@/src/components/asset/Icon'
import { Swap } from '@/src/components/assets/Swap'
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'

const iconDimensions = 36

const Wrapper = styled(Head)`
  align-items: center;
  column-gap: 4px;
  flex-wrap: wrap;
  padding-bottom: 16px;
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
`

const Collapsable = styled(HeadInnerCollapsable)`
  --container-height: 165px;

  border: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      margin-top: 16px;
      max-height: var(--container-height);
      padding-top: 16px;

      > * {
        opacity: 1;
      }
    `}
`

export const PositionHead: React.FC = ({ ...restProps }) => {
  const positionTokens = {
    type: 'short',
    status: 'open',
    tokens: [
      { symbol: 'usdc', value: '4,000.00' },
      { symbol: 'xdai', value: '19,146,465.00' },
    ],
  }
  const { status, tokens, type } = positionTokens
  const [isOpen, setIsOpen] = useState(false)
  const limitPriceValue = '<0.000001 WXDAI'
  const swapValue = '1 USDC = 10.000034 XDAI'

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
          {(type === 'long' || type === 'short') && `Limit price: ${limitPriceValue}`}
          {type === 'collateralSwap' && (
            <>
              {swapValue} <Swap />
            </>
          )}
        </Description>
        <ButtonToggleInfo isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </Controls>
      <Collapsable isOpen={isOpen}>asdasd</Collapsable>
    </Wrapper>
  )
}
