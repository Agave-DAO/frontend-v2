import styled from 'styled-components'

import { HealthFactor } from '@/src/components/common/HealthFactor'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import {
  CurrentLTV as CurrentLTVTooltip,
  HealthFactor as HealthFactorTooltip,
} from '@/src/pagePartials/common/tooltips'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: 24px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background-color: ${({ theme: { colors } }) => colors.darkGreen20};
    border-radius: 24px;
    min-width: 0;
    padding: 40px 24px;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 0 26px;
  row-gap: 16px;
  width: 100%;
`

const InfoRow = styled.div`
  align-items: center;
  column-gap: 8px;
  display: flex;
  justify-content: space-between;
`

const Label = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

const Value = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
`

const HFWrapper = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.secondary20};
  border-radius: 16px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  padding: 16px;
  row-gap: 8px;
  width: 100%;
`

const Title = styled.h4`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  justify-content: center;
  line-height: 1.2;
  margin: 0;
  width: 100%;
`

const EmptyContent = styled.div`
  color: ${({ theme: { colors } }) => colors.lighterGray};
  font-size: 1.4rem;
  line-height: 1.5;
  margin: auto;
  padding: 0 30px;
  text-align: center;
`

export const UserAccountSummary: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address } = useWeb3ConnectedApp()
    const {
      currentLTV,
      currentLiquidationThreshold,
      healthFactor,
      maxLtv,
      userBorrows,
      userCollateral,
      userDeposits,
    } = useUserAccountDetails(address)

    return userDeposits.isZero() ? (
      <EmptyContent>
        Your wallet is empty.
        <br />
        <b>Get started by making your first deposit.</b>
      </EmptyContent>
    ) : (
      <Wrapper {...restProps}>
        <Info>
          <InfoRow>
            <Label>Borrowed</Label>
            <Value>
              <Amount value={userBorrows} />
            </Value>
          </InfoRow>
          <InfoRow>
            <Label>Collateral</Label>
            <Value>
              <Amount value={userCollateral} />
            </Value>
          </InfoRow>
          <InfoRow>
            <Label>
              LTV{' '}
              <Tooltip
                content={
                  <CurrentLTVTooltip
                    currentLTV={<Percentage decimals={18} value={currentLTV} />}
                    liquidationThreshold={
                      <Percentage decimals={18} value={currentLiquidationThreshold} />
                    }
                    maxLTV={<Percentage decimals={18} value={maxLtv} />}
                  />
                }
              />
            </Label>
            <Value>
              <Percentage decimals={18} value={currentLTV} />
            </Value>
          </InfoRow>
        </Info>
        <HFWrapper>
          <Title>
            Health status <Tooltip content={HealthFactorTooltip} />
          </Title>
          <HealthFactor value={healthFactor} />
        </HFWrapper>
      </Wrapper>
    )
  },
  ({ ...restProps }) => (
    <Wrapper {...restProps}>
      <Info>
        {Array.from({ length: 3 }).map((item, index) => (
          <InfoRow key={`row_${index}`}>
            <SkeletonLoading />
          </InfoRow>
        ))}
      </Info>
      <HFWrapper>
        <Title>
          <SkeletonLoading style={{ height: '17px' }} />
        </Title>
        <SkeletonLoading style={{ height: '22px' }} />
      </HFWrapper>
    </Wrapper>
  ),
)
