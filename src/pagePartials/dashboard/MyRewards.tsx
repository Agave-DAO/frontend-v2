import styled from 'styled-components'

import { AGAVEMini } from '@/src/components/assets/AGAVEMini'
import { GNOMini } from '@/src/components/assets/GNOMini'
import { ActionButton, ButtonCSS } from '@/src/components/buttons/ActionButton'
import { ButtonDark as BaseButtonDark } from '@/src/components/buttons/Button'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { useClaimRewards } from '@/src/hooks/mutations/useClaimRewards'
import { useUserRewards } from '@/src/hooks/presentation/useUserRewards'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'

const Wrapper = styled.div`
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.mainDark1};
  border-radius: 16px;
  column-gap: 16px;
  display: flex;
  justify-content: space-between;
  padding: 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    padding: 24px;
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto 0;
`

const Label = styled.h2`
  color: ${({ theme: { colors } }) => colors.textColor60};
  font-size: 1.2rem;
  font-weight: 400;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }
`

const Buttons = styled.div`
  align-items: center;
  column-gap: 4px;
  display: flex;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    column-gap: 8px;
  }
`

const Reward = styled.div`
  align-items: center;
  column-gap: 8px;
  display: flex;
`

const RewardValue = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.8rem;
  }
`

const Percentage = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 4px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }
`

const RewardUSD = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor60};
  font-size: 1.4rem;
  font-weight: 400;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    font-size: 1.6rem;
  }
`

const ButtonDark = styled(BaseButtonDark)`
  ${ButtonCSS}
`

export const MyRewards: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address: userAddress } = useWeb3ConnectedApp()
    const { rewardsBalance, totalValue, unclaimedRewardsFormatted } = useUserRewards(userAddress)

    const noRewards = rewardsBalance.isZero()
    const claimRewards = useClaimRewards(userAddress)

    return (
      <Wrapper {...restProps}>
        <Info>
          <Label>Rewards</Label>
          <Reward>
            <RewardValue>{noRewards ? '0.00' : unclaimedRewardsFormatted}</RewardValue>
            <Percentage>
              50%
              <AGAVEMini size={18} />
            </Percentage>
            <Percentage>
              50%
              <GNOMini size={18} />
            </Percentage>
          </Reward>
          <RewardUSD>{noRewards ? '$0.00' : <Amount value={fromWei(totalValue)} />}</RewardUSD>
        </Info>
        <Buttons>
          <ButtonDark
            as="a"
            href="https://app.balancer.fi/#/gnosis-chain/pool/0x388cae2f7d3704c937313d990298ba67d70a3709000200000000000000000026"
            target="_blank"
          >
            Info
          </ButtonDark>
          <ActionButton disabled={noRewards} onClick={claimRewards} variant="light">
            Claim
          </ActionButton>
        </Buttons>
      </Wrapper>
    )
  },
  () => <SkeletonLoading style={{ height: '118px' }} />,
)
