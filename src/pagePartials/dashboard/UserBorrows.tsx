import Link from 'next/link'

import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { CustomHR, Grid, Rates } from '@/src/components/helpers/Rates'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { BorrowMode, useUserBorrows } from '@/src/hooks/presentation/useUserBorrows'

const UserBorrowsList = withGenericSuspense(
  () => {
    const userBorrows = useUserBorrows()

    return (
      <>
        {userBorrows.map(
          ({ assetAddress, borrowMode, borrowRate, borrowedAmount, borrowedAmountInDAI }) => {
            const { decimals, symbol } = agaveTokens.getTokenByAddress(assetAddress)
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

                  <p style={{ textTransform: 'capitalize' }}>{BorrowMode[borrowMode]}</p>

                  <Grid>
                    <Link href={`/markets/${symbol}/repay?mode=${BorrowMode[borrowMode]}`}>
                      Repay
                    </Link>
                    <Link href={`/markets/${symbol}/borrow?mode=${BorrowMode[borrowMode]}`}>
                      Borrow
                    </Link>
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
