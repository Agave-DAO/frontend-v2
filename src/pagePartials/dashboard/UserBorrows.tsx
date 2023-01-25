import Link from 'next/link'
import styled from 'styled-components'

import { BigNumber } from 'ethers'

import { useUserBorrows } from '../../hooks/agave/useUserBorrows'
import { Asset, Rates } from '../markets/MarketList'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

export enum BorrowMode {
  Stable = 'Stable',
  Variable = 'Variable',
}

export type UserBorrow = {
  assetAddress: string
  borrowedAmount: BigNumber
  borrowedAmountInDAI: BigNumber
  borrowRate: {
    base: BigNumber
    incentive: BigNumber
    total: BigNumber
  }
  borrowMode: string
}

const Grid = styled.div`
  align-items: center;
  column-gap: 20px;
  display: flex;
  row-gap: 20px;
  > * {
    flex: 1;
    text-align: center;
  }
`

const CustomHR = styled.hr`
  margin: 15px 0;
`

const UserBorrowsList = withGenericSuspense(
  () => {
    const userBorrows = useUserBorrows()

    return (
      <>
        {userBorrows.map(
          ({ assetAddress, borrowMode, borrowRate, borrowedAmount, borrowedAmountInDAI }) => {
            const { address, decimals, symbol } = agaveTokens.getTokenByAddress(assetAddress)
            return (
              <div key={`${assetAddress}-${borrowMode}`}>
                <Grid>
                  <Asset symbol={symbol} />
                  <div>
                    <Amount
                      decimals={decimals}
                      symbol={symbol}
                      symbolPosition="after"
                      value={borrowedAmount}
                    />
                    <br />
                    <Amount value={borrowedAmountInDAI} />
                  </div>

                  <Rates
                    base={borrowRate.base}
                    incentive={borrowRate.incentive}
                    total={borrowRate.total}
                  />

                  <p>{borrowMode}</p>

                  <Grid>
                    <Link href={`/markets/${address}/repay?mode=${borrowMode}`}>Repay</Link>
                    <Link href={`/markets/${address}/borrow?mode=${borrowMode}`}>Borrow</Link>
                  </Grid>
                </Grid>
                <CustomHR />
              </div>
            )
          },
        )}
        {!userBorrows.length && <p style={{ textAlign: 'center' }}>No borrows in current wallet</p>}
      </>
    )
  },
  () => <Loading text="Fetching user borrows..." />,
)

export const UserBorrows = () => {
  return (
    <div>
      <h2>My Borrows</h2>
      <Grid>
        <strong>Asset</strong>
        <strong>Borrowed</strong>
        <strong>APR</strong>
        <strong>Mode</strong>
        <strong>Actions</strong>
      </Grid>
      <CustomHR />
      <RequiredConnection isNotConnectedText="Connect your wallet to see your borrows">
        <UserBorrowsList />
      </RequiredConnection>
    </div>
  )
}
