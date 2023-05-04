import styled from 'styled-components'

import { AssetInfo } from '@/src/components/common/AssetInfo'
import { HealthFactor } from '@/src/components/common/HealthFactor'
import { InnerCardDark } from '@/src/components/common/InnerCard'
import { Row, RowKey, RowValueBig, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { HealthFactor as HealthFactorTooltip } from '@/src/pagePartials/common/tooltips'
import { CollateralInfo } from '@/src/pagePartials/markets/CollateralInfo'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { Token } from '@/types/token'

const Wrapper = styled.div`
  width: 100%;
`

export const RepayInfo: React.FC<{ token: Token }> = ({ token, ...restProps }) => {
  const { address } = useWeb3ConnectedApp()
  const [{ data: userData }] = useGetUserAccountData(address)
  const { borrows, totalBorrowed, totalBorrowedInDAI } = useUserBorrowsByToken(token.address)
  const healthFactor = userData?.[0].healthFactor || ZERO_BN
  const { balance } = useAccountBalance({
    accountAddress: address,
    tokenAddress: token.address,
  })

  return (
    <Wrapper {...restProps}>
      <AssetInfo
        title="Your Borrowed"
        tokenValue={
          <Amount
            decimals={token.decimals}
            symbol={token.symbol}
            symbolPosition="after"
            value={totalBorrowed}
          />
        }
        usdValue={<Amount value={totalBorrowedInDAI} />}
      />
      <InnerCardDark>
        <Rows>
          <Row variant="dark">
            <RowKey>Wallet balance</RowKey>
            <RowValueBig>
              <Amount decimals={token.decimals} symbol="" value={balance} />
            </RowValueBig>
          </Row>
          {borrows.map(({ assetAddress, borrowMode, borrowedAmount }) => (
            <Row key={`${assetAddress}_${borrowMode}`}>
              <RowKey>
                <span style={{ textTransform: 'capitalize' }}>{InterestRateMode[borrowMode]}</span>{' '}
                borrowed
              </RowKey>
              <RowValueBig>
                <Amount
                  decimals={token.decimals}
                  symbol={token.symbol}
                  symbolPosition="after"
                  value={borrowedAmount}
                />
              </RowValueBig>
            </Row>
          ))}
          <Row variant="dark">
            <RowKey>
              Health Factor <Tooltip content={HealthFactorTooltip} />
            </RowKey>
            <RowValueBig>
              <HealthFactor badgeVariant="light" size="sm" value={healthFactor} variant="dark" />
            </RowValueBig>
          </Row>
          <CollateralInfo />
        </Rows>
      </InnerCardDark>
    </Wrapper>
  )
}
