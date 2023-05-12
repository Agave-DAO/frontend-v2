import styled from 'styled-components'

import { RewardPair } from '@/src/components/common/RewardPair'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import { useUserRewards } from '@/src/hooks/presentation/useUserRewards'
import { ApproximateBalance, Rewards as RewardsTooltip } from '@/src/pagePartials/common/tooltips'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'

const TooltipIcon: React.FC = ({ ...restProps }) => (
  <svg
    fill="none"
    height="25"
    viewBox="0 0 24 25"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <rect fill="#40B390" height="24" rx="12" width="24" y="0.5" />
    <path
      d="M12.008 7.40778C10.6471 7.40778 9.76563 7.96536 9.0736 8.95975C8.94806 9.14014 8.98677 9.38746 9.16188 9.52025L9.89738 10.0779C10.0742 10.212 10.3259 10.1807 10.4643 10.0072C10.8914 9.47216 11.2082 9.16411 11.8753 9.16411C12.3998 9.16411 13.0486 9.50168 13.0486 10.0103C13.0486 10.3948 12.7312 10.5923 12.2133 10.8826C11.6093 11.2213 10.8101 11.6427 10.8101 12.6968V12.8637C10.8101 13.0897 10.9933 13.2729 11.2193 13.2729H12.4549C12.6809 13.2729 12.8641 13.0897 12.8641 12.8637V12.7653C12.8641 12.0345 14.9999 12.0041 14.9999 10.0266C14.9999 8.53743 13.4552 7.40778 12.008 7.40778ZM11.8371 15.2301C11.1859 15.2301 10.6561 15.76 10.6561 16.4112C10.6561 17.0624 11.1859 17.5922 11.8371 17.5922C12.4884 17.5922 13.0182 17.0624 13.0182 16.4112C13.0182 15.7599 12.4884 15.2301 11.8371 15.2301Z"
      fill="white"
    />
  </svg>
)

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background-image: ${({ theme: { colors } }) => colors.greenGradientLight};
    box-shadow: 0 100px 80px rgba(0, 0, 0, 0.15), 0 38.5185px 25.4815px rgba(0, 0, 0, 0.0911111),
      0 8.14815px 6.51852px rgba(0, 0, 0, 0.0588889);
    padding: 40px 20px;
    border-radius: 24px;
    min-width: 0;
  }
`

const Row = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    align-items: flex-start;
    font-size: 1.6rem;
  }
`

const Text = styled.span`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 6px;
  display: inline-flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

const AccountBalance = styled.div`
  align-items: center;
  background: #fff;
  border-radius: 60px;
  column-gap: 8px;
  display: flex;
  height: 60px;
  justify-content: space-between;
  min-width: 160px;
  padding: 0 20px;
  max-width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 75px;
    width: 100%;
  }
`

const Balance = styled.div`
  color: ${({ theme: { colors } }) => colors.mainDark3};
  font-size: 3.2rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 3.8rem;
  }
`

const Rewards = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.mainDark3};
  border-radius: 40px;
  column-gap: 10px;
  display: flex;
  height: 40px;
  justify-content: space-between;
  padding: 0 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    height: 50px;
  }
`

const RewardsBalance = styled.div`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.4rem;
  }
`

export const UserBalanceSummary: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address: userAddress } = useWeb3ConnectedApp()
    const { userDeposits } = useUserAccountDetails(userAddress)
    const { totalValue } = useUserRewards(userAddress)
    const noRewards = totalValue.isZero()
    const noDeposits = userDeposits.isZero()

    return (
      <Wrapper {...restProps}>
        <Row>
          <Text>Approximate balance</Text>
          <AccountBalance>
            <Balance>{noDeposits ? '$0.00' : <Amount value={userDeposits} />}</Balance>
            <Tooltip content={ApproximateBalance}>
              <TooltipIcon />
            </Tooltip>
          </AccountBalance>
        </Row>
        <Row>
          <Text>
            Rewards <Tooltip content={RewardsTooltip} />
          </Text>
          <Rewards>
            <RewardsBalance>
              {noRewards ? '$0.00' : <Amount value={fromWei(totalValue)} />}
            </RewardsBalance>
            <RewardPair size={18} />
          </Rewards>
        </Row>
      </Wrapper>
    )
  },
  ({ ...restProps }) => (
    <Wrapper {...restProps}>
      <Row>
        <Text>
          <SkeletonLoading style={{ height: '17px' }} />
        </Text>
        <SkeletonLoading style={{ borderRadius: '60px', height: '60px', width: '190px' }} />
      </Row>
      <Row>
        <Text>
          <SkeletonLoading style={{ height: '17px' }} />
        </Text>
        <SkeletonLoading style={{ borderRadius: '40px', height: '40px', width: '150px' }} />
      </Row>
    </Wrapper>
  ),
)

export default UserBalanceSummary
