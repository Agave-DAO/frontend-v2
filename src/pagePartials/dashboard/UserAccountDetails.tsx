import styled from 'styled-components'

import { Amount } from '@/src/components/helpers/Amount'
import { Grid } from '@/src/components/helpers/Rates'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { useUserAccountDetails } from '@/src/hooks/agave/useUserAccountDetails'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  span {
    font-size: 1.7rem;
  }
`

const UserAccountDetailsImpl = withGenericSuspense(
  () => {
    const { address } = useWeb3ConnectedApp()
    const {
      currentLTV,
      currentLiquidationThreshold,
      healthFactor,
      maxLtv,
      userBorrows,
      userCollateral,
      userDeposits,
      userRewards,
    } = useUserAccountDetails(address)

    return (
      <Grid>
        <div>
          <h3>Deposits</h3>
          <Amount value={userDeposits} />
        </div>
        <div>
          <h3>Borrows</h3>
          <Amount value={userBorrows} />
        </div>
        <div>
          <h3>Rewards</h3>
          <Amount displayDecimals={6} value={userRewards} />
        </div>
        <div>
          <h3>Collateral</h3>
          <Amount value={userCollateral} />
        </div>
        <div>
          <h3>Health factor</h3>
          <Amount symbol={''} value={healthFactor} />
        </div>
        <div>
          <h3>Current LTV</h3>
          <Amount symbol={''} value={currentLTV} />
        </div>
        <div>
          <h3>Maximum LTV</h3>
          <Amount symbol={''} value={maxLtv} />
        </div>
        <div>
          <h3>Liquidation threshold</h3>
          <Amount symbol={''} value={currentLiquidationThreshold} />
        </div>
      </Grid>
    )
  },
  () => <Loading text="Fetching user account details..." />,
)

export const UserAccountDetails = () => {
  return (
    <RequiredConnection isNotConnectedText="Connect your wallet to see your account details">
      <Wrapper>
        <h2>My Account</h2>
        <UserAccountDetailsImpl />
      </Wrapper>
    </RequiredConnection>
  )
}
