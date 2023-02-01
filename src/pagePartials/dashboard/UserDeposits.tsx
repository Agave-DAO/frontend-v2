import Link from 'next/link'
import { useState } from 'react'

import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'
import { CustomHR, Grid } from '@/src/components/helpers/Rates'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ToggleSwitch } from '@/src/components/helpers/ToggleSwitch'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useSetReserveAsCollateral } from '@/src/hooks/agave/useSetReserveAsCollatoral'
import { useUserDeposits } from '@/src/hooks/agave/useUserDeposits'
import { RequiredConnection } from '@/src/hooks/requiredConnection'

const AsCollateral = ({
  assetAddress,
  currentValue,
}: {
  currentValue: boolean
  assetAddress: string
}) => {
  const [checked, setChecked] = useState(currentValue)
  const [loading, setLoading] = useState(false)
  const setReserveAsCollateral = useSetReserveAsCollateral()

  // Checking if the asset is WXDAI. If it is, then it's always collateral and the user can't change it.
  const isAlwaysCollateral = agaveTokens.getTokenByAddress(assetAddress).symbol === 'WXDAI'

  const toggleSwitchHandler = async () => {
    setChecked(!checked)
    setLoading(true)
    try {
      const tx = await setReserveAsCollateral(assetAddress, !checked)
      await tx.wait()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setChecked(checked)
      setLoading(false)
    }
  }

  return (
    <Grid>
      <ToggleSwitch
        checked={checked}
        disabled={isAlwaysCollateral || loading}
        id={`asCollateral-${assetAddress}`}
        onChange={toggleSwitchHandler}
      />
      <p>{checked ? 'YES' : 'NO'}</p>
    </Grid>
  )
}

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

                  <AsCollateral assetAddress={assetAddress} currentValue={asCollateral} />

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
      <RequiredConnection isNotConnectedText="Connect your wallet to see your deposits">
        <UserDepositsList />
      </RequiredConnection>
    </div>
  )
}
