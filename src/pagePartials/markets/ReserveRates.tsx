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
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'

const Wrapper = styled(InnerCard)``

export const ReserveRates: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
  ...restProps
}) => {
  const marketData = useMarketsData()

  return (
    <Wrapper {...restProps}>
      <Rows>
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
          variant="dark"
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
        <Row>
          <RowKey>Stable Borrowing APR</RowKey>
          <RowValue>
            <Percentage decimals={25} value={marketData.getBorrowRate(tokenAddress).stable} />
          </RowValue>
        </Row>
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
          variant="dark"
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
      </Rows>
    </Wrapper>
  )
}
