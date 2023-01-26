import { NextPage } from 'next'
import styled from 'styled-components'

import TxButton from '@/src/components/buttons/txButton'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { useCalculateUserRewards } from '@/src/hooks/agave/useCalculateUserRewards'
import { useClaimRewards } from '@/src/hooks/agave/useClaimRewards'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'

const Grid = styled(SimpleGrid)`
  align-items: center;
`

const UserRewardsContent = () => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const { rewardsBalance, totalValue } = useCalculateUserRewards(userAddress)
  const claimRewards = useClaimRewards(userAddress)
  const disableSubmit = rewardsBalance.isZero()

  return (
    <Grid alignItems="start">
      <div>
        <div>Rewards:</div>
        <div>
          <Amount symbol="" value={rewardsBalance} /> <span>40% AGVE - 60% GNO</span>
        </div>
        <div>
          <Amount value={fromWei(totalValue)} />
        </div>
      </div>
      <div>
        <TxButton disabled={disableSubmit} tx={claimRewards}>
          Claim {`>`}
        </TxButton>
      </div>
    </Grid>
  )
}

const UserRewards: NextPage = () => {
  return (
    <RequiredConnection isNotConnectedText={'Connect your wallet to see your rewards'}>
      <UserRewardsContent />
    </RequiredConnection>
  )
}

export default withGenericSuspense(UserRewards)
