import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Amount } from '@/src/components/helpers/Amount'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useGetMarketDetails } from '@/src/hooks/agave/useGetMarketDetails'

const Grid = styled(SimpleGrid)`
  justify-content: center;
`

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

const TokenWithSymbol = styled(SimpleGrid)`
  column-gap: 8px;
`

export function ReserveStatus({ tokenAddress }: { tokenAddress: string }) {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const { borrowed, liquidity, reserveSize, utilizationRate } = useGetMarketDetails(tokenAddress)

  return (
    <BaseCard>
      <BaseTitle>Reserve Status</BaseTitle>
      <AGorgeousChart borrowedPercentage={borrowed.percentage} />
      <Grid>
        <Column>
          <div>Available Liquidity</div>
          <strong>
            <Amount decimals={18} value={liquidity.price} />
          </strong>
          <TokenWithSymbol>
            <TokenIcon symbol={tokenInfo.symbol} />
            <Amount decimals={tokenInfo.decimals} symbol="" value={liquidity.wei} />
          </TokenWithSymbol>
        </Column>
        <Column>
          <div>Total Borrowed</div>
          <strong>
            <Amount value={borrowed.price} />
          </strong>
          <TokenWithSymbol>
            <TokenIcon symbol={tokenInfo.symbol} />
            <Amount decimals={tokenInfo.decimals} symbol="" value={borrowed.wei} />
          </TokenWithSymbol>
        </Column>
      </Grid>
      <Column>
        <Grid>
          <div>Reserve Size</div>
          <Amount value={reserveSize.price} />
        </Grid>
        <Grid>
          <div>Utilization Rate</div>
          <div>{utilizationRate}%</div>
        </Grid>
      </Column>
    </BaseCard>
  )
}

function AGorgeousChart({ borrowedPercentage }: { borrowedPercentage: number }) {
  return (
    <Grid>
      <div>
        <div
          style={{
            width: '100px',
            background: 'lightblue',
            height: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              width: `${borrowedPercentage}px`,
              background: 'green',
              height: '10px',
            }}
          />
        </div>
      </div>
    </Grid>
  )
}
