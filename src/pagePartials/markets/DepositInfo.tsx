import { useMemo } from 'react'

import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { CustomHR, Grid } from '@/src/components/helpers/Rates'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { useUserDepositsByToken } from '@/src/hooks/presentation/useUserDepositsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

/**
 * Deposit screen information
 */
export const DepositInfo = () => {
  const tokenInfo = useMarketByURLParam()

  const { address } = useWeb3ConnectedApp()

  const { balance: walletBalance } = useAccountBalance({
    accountAddress: address,
    tokenAddress: tokenInfo.address,
  })

  const [{ data: userData }] = useGetUserAccountData(address)

  const depositedAmount = useUserDepositsByToken(tokenInfo.address)?.depositedAmount || ZERO_BN
  const depositedAmountInDAI =
    useUserDepositsByToken(tokenInfo.address)?.depositedAmountInDAI || ZERO_BN

  const { agaveMarketsData, getDepositAPY } = useMarketsData([tokenInfo.address])

  const depositAPY = getDepositAPY(tokenInfo.address)

  const healthFactor = userData?.[0].healthFactor || ZERO_BN

  const maxLTV = useMemo(() => agaveMarketsData?.[0].assetData.ltv || ZERO_BN, [agaveMarketsData])

  const collateralizable = useMemo(
    () => agaveMarketsData?.[0].assetData.usageAsCollateralEnabled || false,
    [agaveMarketsData],
  )

  // return the data
  return (
    <div style={{ width: 400 }}>
      <CustomHR />
      <Grid>
        <div>Your assets</div>
        <div>
          <Amount
            decimals={tokenInfo.decimals}
            symbol={tokenInfo.symbol}
            symbolPosition="after"
            value={depositedAmount}
          />
          <br />
          <Amount value={depositedAmountInDAI} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Wallet Balance</div>
        <div>
          <Amount
            decimals={tokenInfo.decimals}
            symbol={tokenInfo.symbol}
            symbolPosition="after"
            value={walletBalance}
          />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Deposit APY</div>
        <div>
          <Percentage decimals={25} value={depositAPY} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Max. LTV</div>
        <div>
          <Percentage decimals={2} value={maxLTV} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Collateralizable</div>
        <div>{collateralizable ? 'Yes' : 'No'}</div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Health Factor</div>
        <div>
          <Amount symbol="" value={healthFactor} />
        </div>
      </Grid>
      <CustomHR />
    </div>
  )
}
