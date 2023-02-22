import { useState } from 'react'

import { Button } from '@/src/components/buttons/Button'
import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'
import { CustomHR, Grid } from '@/src/components/helpers/Rates'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { toWei } from '@/src/utils/common'

const chevronDown = '▼'
const chevronUp = '▲'
export const CollateralInfo = () => {
  const [showCollaterals, setShowCollaterals] = useState(false)
  const { address } = useWeb3ConnectedApp()
  const depositsAsCollateral = useUserDeposits().filter((deposit) => deposit.asCollateral)

  const totalCollateral = useUserAccountDetails(address)?.userCollateral || ZERO_BN

  return (
    <>
      <Grid>
        <div>Your collateral</div>
        <div>
          <Amount value={totalCollateral} />
        </div>
        <Button onClick={() => setShowCollaterals(!showCollaterals)}>
          {showCollaterals ? chevronUp : chevronDown}
        </Button>
      </Grid>
      {showCollaterals &&
        depositsAsCollateral.map((deposit) => {
          const token = agaveTokens.getTokenByAddress(deposit.assetAddress)
          const percentageOfTotal = deposit.depositedAmountInDAI
            .mul(toWei('100'))
            .div(totalCollateral)

          return (
            <Grid key={deposit.assetAddress}>
              <Grid>
                <Asset symbol={token.symbol} />{' '}
                <Amount decimals={token.decimals} value={deposit.depositedAmount} />
                <Percentage decimals={18} value={percentageOfTotal} />
              </Grid>
            </Grid>
          )
        })}
    </>
  )
}
