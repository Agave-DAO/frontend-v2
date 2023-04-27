import { useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { AsCollateral } from '@/src/components/asset/AsCollateral'
import { Head, HeadContents, Icon } from '@/src/components/asset/Asset'
import { AssetBadge } from '@/src/components/asset/AssetBadge'
import { AssetTitle } from '@/src/components/asset/AssetTitle'
import { AssetValue, Props as AssetValueProps } from '@/src/components/asset/AssetValue'
import { HeadInnerCollapsable } from '@/src/components/asset/HeadInnerCollapsable'
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'
import { RewardPair } from '@/src/components/common/RewardPair'
import { Percentage } from '@/src/components/helpers/Percentage'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

const Wrapper = styled(Head)`
  flex-wrap: wrap;
  padding-bottom: 16px;
`

const Controls = styled.div`
  display: flex;
  flex-direction: column;
`

const ToggleButton = styled(ButtonToggleInfo)`
  margin-left: auto;
  margin-top: auto;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const MainRow = styled(Row)`
  margin-bottom: 8px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 16px;
  }

  .label {
    font-size: 1.4rem;

    @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
      font-size: 1.6rem;
    }
  }

  .value {
    font-size: 1.6rem;
    font-weight: 700;
  }
`

const Label = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor60};
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

Label.defaultProps = {
  className: 'label',
}

const Value = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  flex-direction: row;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

Value.defaultProps = {
  className: 'value',
}

const UseAsCollateral = styled(MainRow)`
  margin: 0;
  padding-top: 32px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding-top: 40px;
  }
`

export interface Props extends AssetValueProps {
  badge?: string
  baseRate: BigNumber
  incentivesRate: BigNumber
  isBorrow?: boolean
  totalAP: BigNumber
  tokenAddress: string
  useAsCollateral?: boolean
}

export const UserAssetHead: React.FC<Props> = ({
  badge,
  baseRate,
  incentivesRate,
  isBorrow = false,
  tokenAddress,
  tokenValue,
  totalAP,
  usdValue,
  useAsCollateral,
  ...restProps
}) => {
  const { symbol } = useAgaveTokens().getTokenByAddress(tokenAddress)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper {...restProps}>
      <Icon symbol={symbol}>
        <TokenIcon dimensions={36} symbol={symbol} />
      </Icon>
      <HeadContents>
        <AssetTitle>Balance</AssetTitle>
        <AssetValue tokenValue={tokenValue} usdValue={usdValue} />
      </HeadContents>
      <Controls>
        {badge && <AssetBadge>{badge}</AssetBadge>}
        <ToggleButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </Controls>
      <HeadInnerCollapsable isOpen={isOpen}>
        <MainRow>
          <Label>Total {isBorrow ? 'APR' : 'APY'}</Label>
          <Value>
            <Percentage decimals={25} value={totalAP} />
          </Value>
        </MainRow>
        <Row>
          <Label>Base rate</Label>
          <Value>
            <Percentage decimals={25} value={baseRate} />
          </Value>
        </Row>
        <Row>
          <Label>Incentives rate</Label>
          <Value>
            <RewardPair size={18} />
            <Percentage decimals={25} value={incentivesRate} />
          </Value>
        </Row>
        {useAsCollateral !== undefined && (
          <UseAsCollateral>
            <Label>Collateral</Label>
            <AsCollateral assetAddress={tokenAddress} isActive={useAsCollateral} />
          </UseAsCollateral>
        )}
      </HeadInnerCollapsable>
    </Wrapper>
  )
}
