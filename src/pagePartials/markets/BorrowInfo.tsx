import styled from 'styled-components'

import { AssetInfo } from '@/src/components/common/AssetInfo'
import { HealthFactor } from '@/src/components/common/HealthFactor'
import { InnerCardDark } from '@/src/components/common/InnerCard'
import { RewardPair } from '@/src/components/common/RewardPair'
import {
  CollapsableRow,
  CollapsableRowKey,
  CollapsableRowValue,
  CollapsableRowsHandler,
  Row,
  RowKey,
  RowValueBig,
  Rows,
} from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { Percentage } from '@/src/components/helpers/Percentage'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useMarketDetails } from '@/src/hooks/presentation/useMarketDetails'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { HealthFactor as HealthFactorTooltip } from '@/src/pagePartials/common/tooltips'
import { CollateralInfo } from '@/src/pagePartials/markets/CollateralInfo'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { Token } from '@/types/token'

const Wrapper = styled.div`
  width: 100%;
`

export const BorrowInfo: React.FC<{ token: Token }> = ({ token, ...restProps }) => {
  const { address } = useWeb3ConnectedApp()
  const [{ data: userData }] = useGetUserAccountData(address)
  const { totalBorrowed, totalBorrowedInDAI } = useUserBorrowsByToken(token?.address)
  const { liquidity } = useMarketDetails(token.address)
  const { getBorrowRate, getIncentiveRate } = useMarketsData()
  const variableAPR = getBorrowRate(token.address).variable
  const stableAPR = getBorrowRate(token.address).stable
  const incentiveAPR = getIncentiveRate(token.address, 'variableDebt')
  const healthFactor = userData?.[0].healthFactor || ZERO_BN
  const utilizationRate = useMarketDetails(token.address)?.utilizationRate || 0

  return (
    <Wrapper {...restProps}>
      <AssetInfo
        title="Your borrowed"
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
            <RowKey>Available liquidity</RowKey>
            <RowValueBig>
              <Amount
                decimals={token.decimals}
                symbol={token.symbol}
                symbolPosition="after"
                value={liquidity.wei}
              />
            </RowValueBig>
          </Row>
          <Row>
            <RowKey>Utilization rate</RowKey>
            <RowValueBig>{utilizationRate}%</RowValueBig>
          </Row>
          <CollapsableRowsHandler
            toggle={
              <>
                <RowKey>Variable APR</RowKey>
                <RowValueBig>
                  <Percentage decimals={25} value={variableAPR.sub(incentiveAPR)} />
                </RowValueBig>
              </>
            }
            variant="dark"
          >
            <CollapsableRow>
              <CollapsableRowKey>Base rate</CollapsableRowKey>
              <CollapsableRowValue>
                <Percentage decimals={25} value={variableAPR} />
              </CollapsableRowValue>
            </CollapsableRow>
            <CollapsableRow>
              <CollapsableRowKey>Incentives rate</CollapsableRowKey>
              <CollapsableRowValue>
                <RewardPair size={16} />
                <Percentage decimals={25} value={incentiveAPR} />
              </CollapsableRowValue>
            </CollapsableRow>
          </CollapsableRowsHandler>
          <Row>
            <RowKey>Stable APR</RowKey>
            <RowValueBig>
              <Percentage decimals={25} value={stableAPR} />
            </RowValueBig>
          </Row>
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
