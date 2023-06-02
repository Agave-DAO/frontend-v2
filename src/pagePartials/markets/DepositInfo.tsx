import { useMemo } from 'react'
import styled from 'styled-components'

import { Ok } from '@/src/components/assets/Ok'
import { AssetInfo } from '@/src/components/common/AssetInfo'
import { HealthFactor } from '@/src/components/common/HealthFactor'
import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserDepositsByToken } from '@/src/hooks/presentation/useUserDepositsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { HealthFactor as HealthFactorTooltip, MaximumLTV } from '@/src/pagePartials/common/tooltips'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { Token } from '@/types/token'

const Wrapper = styled.div`
  width: 100%;
`

export const DepositInfo: React.FC<{ token: Token }> = ({ token, ...restProps }) => {
  const { address: accountAddress, balance: accountBalance = ZERO_BN } = useWeb3ConnectedApp()

  const { balance } = useAccountBalance({
    accountAddress,
    tokenAddress: token.address,
  })

  const [{ data: userData }] = useGetUserAccountData(accountAddress)

  const depositedAmount = useUserDepositsByToken(token.address)?.depositedAmount || ZERO_BN
  const depositedAmountInDAI =
    useUserDepositsByToken(token.address)?.depositedAmountInDAI || ZERO_BN

  const healthFactor = useMemo(() => userData?.[0].healthFactor || ZERO_BN, [userData])

  const { getDepositAPY, getMarket } = useMarketsData()
  const depositAPY = useMemo(() => getDepositAPY(token.address), [getDepositAPY, token.address])
  const marketData = useMemo(() => getMarket(token.address), [getMarket, token.address])

  const maxLTV = useMemo(() => marketData.assetData.ltv || ZERO_BN, [marketData])

  const collateralizable = useMemo(
    () => marketData.assetData.usageAsCollateralEnabled || false,
    [marketData],
  )

  return (
    <Wrapper {...restProps}>
      <AssetInfo
        title="Your assets"
        tokenValue={
          <Amount
            decimals={token.decimals}
            symbol={token.symbol}
            symbolPosition="after"
            value={depositedAmount}
          />
        }
        usdValue={<Amount value={depositedAmountInDAI} />}
      />
      <InnerCardDark>
        <Rows>
          <Row variant="dark">
            <RowKey>Wallet Balance</RowKey>
            <RowValueBig>
              <Amount
                decimals={token.decimals}
                symbol={token.symbol}
                symbolPosition="after"
                value={token.extensions.isNative ? accountBalance : balance}
              />
            </RowValueBig>
          </Row>
          <Row>
            <RowKey>APY</RowKey>
            <RowValueBig>
              <Percentage decimals={25} value={depositAPY} />
            </RowValueBig>
          </Row>
          <Row variant="dark">
            <RowKey>
              Max. LTV <Tooltip content={MaximumLTV} />
            </RowKey>
            <RowValueBig>
              <Percentage decimals={2} value={maxLTV} />
            </RowValueBig>
          </Row>
          <Row>
            <RowKey>Collateralizable</RowKey>
            <RowValueBig>{collateralizable ? <Ok /> : 'No'}</RowValueBig>
          </Row>
          <Row variant="dark">
            <RowKey>
              Health Factor <Tooltip content={HealthFactorTooltip} />
            </RowKey>
            <RowValueBig>
              <HealthFactor badgeVariant="light" size="sm" value={healthFactor} variant="dark" />
            </RowValueBig>
          </Row>
        </Rows>
      </InnerCardDark>
    </Wrapper>
  )
}
