import { Amount } from '@/src/components/helpers/Amount'
import { CustomHR, Grid } from '@/src/components/helpers/Rates'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { CollateralInfo } from '@/src/pagePartials/markets/CollateralInfo'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

/**
 * Repay screen information
 */
export const RepayInfo = () => {
  const tokenInfo = useMarketByURLParam()

  const { address } = useWeb3ConnectedApp()

  const [{ data: userData }] = useGetUserAccountData(address)

  const { borrows, totalBorrowed, totalBorrowedInDAI } = useUserBorrowsByToken(tokenInfo.address)

  const healthFactor = userData?.[0].healthFactor || ZERO_BN

  const { balance } = useAccountBalance({
    accountAddress: address,
    tokenAddress: tokenInfo.address,
  })

  return (
    <div style={{ width: 400 }}>
      <CustomHR />
      <Grid>
        <div>Your Borrowed</div>
        <div>
          <Amount
            decimals={tokenInfo.decimals}
            displayDecimals={4}
            symbol={tokenInfo.symbol}
            symbolPosition="after"
            value={totalBorrowed}
          />
          <br />
          <Amount displayDecimals={4} value={totalBorrowedInDAI} />
        </div>
      </Grid>
      <CustomHR />
      <Grid>
        <div>Wallet balance</div>
        <div>
          <Amount decimals={tokenInfo.decimals} symbol="" value={balance} />
        </div>
      </Grid>
      {borrows.map(({ assetAddress, borrowMode, borrowedAmount, borrowedAmountInDAI }) => (
        <>
          <CustomHR />
          <Grid key={`${assetAddress}_${borrowMode}`}>
            <div style={{ textTransform: 'capitalize' }}>
              {InterestRateMode[borrowMode]} Borrowed
            </div>
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
        </>
      ))}
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
