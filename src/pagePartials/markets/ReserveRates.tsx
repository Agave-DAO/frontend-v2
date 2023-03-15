import styled from 'styled-components'

import { InnerCard } from '@/src/components/common/InnerCard'
import { RewardPair } from '@/src/components/common/RewardPair'
import {
  CollapsableRow,
  CollapsableRowKey,
  CollapsableRowValue,
  CollapsableRowsHandler,
  Row,
  RowKey,
  RowValue,
  Rows,
} from '@/src/components/common/Rows'
import { Percentage } from '@/src/components/helpers/Percentage'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'

const Wrapper = styled(InnerCard)``

export const ReserveRates: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
  ...restProps
}) => {
  const marketData = useMarketsData([tokenAddress])

  return (
    <Wrapper {...restProps}>
      <Rows>
        <Row variant="dark">
          <CollapsableRowsHandler
            toggle={
              <>
                <RowKey>Deposit APY</RowKey>
                <RowValue>
                  <Percentage
                    decimals={25}
                    value={marketData
                      .getDepositAPY(tokenAddress)
                      .add(marketData.getIncentiveRate(tokenAddress, 'ag'))}
                  />
                </RowValue>
              </>
            }
          >
            <CollapsableRow>
              <CollapsableRowKey>Base rate</CollapsableRowKey>
              <CollapsableRowValue>
                <Percentage decimals={25} value={marketData.getDepositAPY(tokenAddress)} />
              </CollapsableRowValue>
            </CollapsableRow>
            <CollapsableRow>
              <CollapsableRowKey>Incentives rate</CollapsableRowKey>
              <CollapsableRowValue>
                <RewardPair size={16} />
                <Percentage decimals={25} value={marketData.getIncentiveRate(tokenAddress, 'ag')} />
              </CollapsableRowValue>
            </CollapsableRow>
          </CollapsableRowsHandler>
        </Row>
        <Row>
          <RowKey>Stable Borrowing APR</RowKey>
          <RowValue>
            <Percentage decimals={25} value={marketData.getBorrowRate(tokenAddress).stable} />
          </RowValue>
        </Row>
        <Row variant="dark">
          <CollapsableRowsHandler
            toggle={
              <>
                <RowKey>Variable Borrowing APR</RowKey>
                <RowValue>
                  <Percentage
                    decimals={25}
                    value={marketData
                      .getBorrowRate(tokenAddress)
                      .variable.sub(marketData.getIncentiveRate(tokenAddress, 'variableDebt'))}
                  />
                </RowValue>
              </>
            }
          >
            <CollapsableRow>
              <CollapsableRowKey>Base rate</CollapsableRowKey>
              <CollapsableRowValue>
                <Percentage decimals={25} value={marketData.getBorrowRate(tokenAddress).variable} />
              </CollapsableRowValue>
            </CollapsableRow>
            <CollapsableRow>
              <CollapsableRowKey>Incentives rate</CollapsableRowKey>
              <CollapsableRowValue>
                <RewardPair size={16} />
                <Percentage
                  decimals={25}
                  value={marketData.getIncentiveRate(tokenAddress, 'variableDebt')}
                />
              </CollapsableRowValue>
            </CollapsableRow>
          </CollapsableRowsHandler>
        </Row>
      </Rows>
    </Wrapper>
  )
}
