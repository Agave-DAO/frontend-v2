import { useState } from 'react'

import { Button } from '@/src/components/buttons/Button'
import { Amount } from '@/src/components/helpers/Amount'
import { Asset } from '@/src/components/helpers/Asset'
import { Percentage } from '@/src/components/helpers/Percentage'
import { CustomHR, Grid, Rates } from '@/src/components/helpers/Rates'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketDetails } from '@/src/hooks/presentation/useMarketDetails'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { toWei } from '@/src/utils/common'

const chevronDown = '▼'
const chevronUp = '▲'

const CollateralInfo = () => {
  const [showCollaterals, setShowCollaterals] = useState(false)
  const { address } = useWeb3ConnectedApp()
  const depositsAsCollateral = useUserDeposits().filter((deposit) => deposit.asCollateral)

  const totalCollateral = useUserAccountDetails(address)?.userCollateral || ZERO_BN

  return (
    <div style={{ width: 400 }}>
      <CustomHR />
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
    </div>
  )
}

/**
 * Borrow screen information
 */
export const BorrowInfo = () => {
  const tokenInfo = useMarketByURLParam()

  const { address } = useWeb3ConnectedApp()

  const [{ data: userData }] = useGetUserAccountData(address)

  const borrowedAmount = useUserBorrowsByToken(tokenInfo.address)?.borrowedAmount || ZERO_BN
  const borrowedAmountInDAI =
    useUserBorrowsByToken(tokenInfo.address)?.borrowedAmountInDAI || ZERO_BN

  const { agaveMarketsData, getBorrowRate, getIncentiveRate } = useMarketsData([tokenInfo.address])

  const variableAPR = getBorrowRate(tokenInfo.address).variable
  const stableAPR = getBorrowRate(tokenInfo.address).stable
  const incentiveAPR = getIncentiveRate(tokenInfo.address, 'variableDebt')

  const healthFactor = userData?.[0].healthFactor || ZERO_BN

  const availableLiquidity = agaveMarketsData?.[0].reserveData.availableLiquidity || ZERO_BN

  const utilizationRate = useMarketDetails(tokenInfo.address)?.utilizationRate || 0

  return (
    <div style={{ width: 400 }}>
      <CustomHR />
      <Grid>
        <div>Your Borrowed</div>
        <div>
          <Amount
            decimals={tokenInfo.decimals}
            symbol={tokenInfo.symbol}
            symbolPosition="after"
            value={borrowedAmount}
          />
          <br />
          <Amount value={borrowedAmountInDAI} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Available liquidity</div>
        <div>
          <Amount
            decimals={tokenInfo.decimals}
            symbol={tokenInfo.symbol}
            symbolPosition="after"
            value={availableLiquidity}
          />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Utilization rate</div>
        <div>{utilizationRate}%</div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Variable APR</div>
        <div>
          <Rates
            base={variableAPR}
            incentive={incentiveAPR}
            total={variableAPR.sub(incentiveAPR)}
          />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Stable APR</div>
        <div>
          <Percentage decimals={25} value={stableAPR} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Health Factor</div>
        <div>
          <Amount symbol="" value={healthFactor} />
        </div>
      </Grid>
      <CustomHR />
      <CollateralInfo />
      <CustomHR />
    </div>
  )
}
