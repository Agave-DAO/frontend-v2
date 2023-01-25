import Link from 'next/link'
import styled from 'styled-components'

import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'
import { CustomHR, Grid } from '@/src/components/helpers/Rates'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDeposits } from '@/src/hooks/agave/useUserDeposits'

const UserDepositsList = withGenericSuspense(
  () => {
    const userDeposits = useUserDeposits()

    return (
      <>
        {userDeposits.map(
          ({ asCollateral, assetAddress, depositRate, depositedAmount, depositedAmountInDAI }) => {
            const { address, decimals, symbol } = agaveTokens.getTokenByAddress(assetAddress)
            return (
              <div key={`${assetAddress}-deposit`}>
                <Grid>
                  <Asset symbol={symbol} />
                  <div>
                    <Amount
                      decimals={decimals}
                      symbol={symbol}
                      symbolPosition="after"
                      value={depositedAmount}
                    />
                    <br />
                    <Amount value={depositedAmountInDAI} />
                  </div>

                  <Percentage decimals={25} value={depositRate} />

                  <p>{asCollateral ? 'YES' : 'NO'}</p>

                  <Grid>
                    <Link href={`/markets/${address}/deposit`}>Deposit</Link>
                    <Link href={`/markets/${address}/withdraw`}>Withdraw</Link>
                  </Grid>
                </Grid>
                <CustomHR />
              </div>
            )
          },
        )}
        {!userDeposits.length && (
          <p style={{ textAlign: 'center' }}>No deposits in current wallet</p>
        )}
      </>
    )
  },
  () => <Loading text="Fetching user deposits..." />,
)

export const UserDeposits = () => {
  return (
    <div>
      <h2>My Deposits</h2>
      <Grid>
        <strong>Asset</strong>
        <strong>Deposited</strong>
        <strong>APY</strong>
        <strong>Collateral</strong>
        <strong>Actions</strong>
      </Grid>
      <CustomHR />
      <UserDepositsList />
    </div>
  )
}
