import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { Loading } from '@/src/components/loading/Loading'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDepositsInformationByToken } from '@/src/hooks/presentation/useUserDepositsInformationByToken'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Grid = styled(SimpleGrid)`
  justify-content: center;
`
const Column = styled(SimpleGrid)`
  flex-direction: column;
`
const TokenWithSymbol = styled(SimpleGrid)`
  column-gap: 8px;
`

function UserDepositsImp({
  tokenAddress,
  userAddress,
}: {
  tokenAddress: string
  userAddress: string
}) {
  const { balance, depositedAmount, userHasDeposits } = useUserDepositsInformationByToken({
    tokenAddress,
    userAddress,
  })
  const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

  if (!userHasDeposits) {
    return <div>No deposits</div>
  }

  return (
    <Column>
      <Grid>
        <div>Your wallet balance</div>
        <TokenWithSymbol>
          <TokenIcon symbol={symbol} />
          <Amount decimals={decimals} symbol="" value={balance} />
        </TokenWithSymbol>
      </Grid>
      <Grid>
        <div>You already deposited</div>
        <TokenWithSymbol>
          <TokenIcon symbol={symbol} />
          <Amount decimals={decimals} symbol="" value={depositedAmount} />
        </TokenWithSymbol>
      </Grid>
    </Column>
  )
}

export const UserDepositDetails = withGenericSuspense(
  function UserDeposits({ tokenAddress }: { tokenAddress: string }) {
    const { address: userAddress } = useWeb3ConnectedApp()
    return (
      <BaseCard>
        <BaseTitle>Deposits</BaseTitle>
        <UserDepositsImp tokenAddress={tokenAddress} userAddress={userAddress} />
      </BaseCard>
    )
  },
  () => <Loading text="Fetching user deposits..." />,
)
