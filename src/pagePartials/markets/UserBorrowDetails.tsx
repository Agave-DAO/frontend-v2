import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { Loading } from '@/src/components/loading/Loading'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserBorrowsInformationByToken } from '@/src/hooks/agave/useUserBorrowsInformationByToken'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

export const Grid = styled(SimpleGrid)`
  justify-content: center;
`
export const Column = styled(SimpleGrid)`
  flex-direction: column;
`
export const TokenWithSymbol = styled(SimpleGrid)`
  column-gap: 8px;
`

function UserBorrowsImp({
  tokenAddress,
  userAddress,
}: {
  tokenAddress: string
  userAddress: string
}) {
  const { borrowedAmount, healthFactor, ltv, maxBorrow, userHasBorrows } =
    useUserBorrowsInformationByToken({
      tokenAddress,
      userAddress,
    })
  const { decimals, symbol } = agaveTokens.getTokenByAddress(tokenAddress)

  if (!userHasBorrows) {
    return <div>No borrows</div>
  }

  return (
    <Column>
      <Grid>
        <div>Borrowed</div>
        <TokenWithSymbol>
          <TokenIcon symbol={symbol} />
          <Amount decimals={decimals} symbol="" value={borrowedAmount} />
        </TokenWithSymbol>
      </Grid>
      <Grid>
        <div>Health factor</div>
        <div>{healthFactor}</div>
      </Grid>
      <Grid>
        <div>Loan to Value</div>
        <Percentage decimals={2} value={ltv} />
      </Grid>
      <Grid>
        <div>You can borrow</div>
        <TokenWithSymbol>
          <TokenIcon symbol={symbol} />
          <div>{maxBorrow}</div>
        </TokenWithSymbol>
      </Grid>
    </Column>
  )
}

export const UserBorrowDetails = withGenericSuspense(
  function UserBorrows({ tokenAddress }: { tokenAddress: string }) {
    const { address: userAddress } = useWeb3ConnectedApp()
    return (
      <BaseCard>
        <BaseTitle>Borrows</BaseTitle>
        <UserBorrowsImp tokenAddress={tokenAddress} userAddress={userAddress} />
      </BaseCard>
    )
  },
  () => <Loading text="Fetching user borrows..." />,
)
