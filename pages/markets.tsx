import { NextPage } from 'next'
import styled from 'styled-components'

import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import TokenIconsProvider from '@/src/providers/tokenIconsProvider'
import {
  AaveProtocolDataProvider,
  AaveProtocolDataProvider__factory,
} from '@/types/generated/typechain'

const Card = styled(BaseCard)`
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
`

const ReserveData = ({ tokenAddress }: { tokenAddress: string }) => {
  const aaveProtocolDataProvider = useContractInstance(
    AaveProtocolDataProvider__factory,
    'AaveProtocolDataProvider',
  )

  const calls = [aaveProtocolDataProvider.getReserveData] as const
  const [{ data }] = useContractCall<AaveProtocolDataProvider, typeof calls>(
    calls,
    [[tokenAddress]],
    'reserve-data',
  )

  if (!data) return <div>'loading...'</div>

  return (
    <ul>
      <li>Available liquidity: {data[0].availableLiquidity.toString()}</li>
      <li>Total stable debt: {data[0].totalStableDebt.toString()}</li>
      <li>Total variable debt: {data[0].totalVariableDebt.toString()}</li>
      <li>Liquidity rate: {data[0].liquidityRate.toString()}</li>
      <li>Variable borrow rate: {data[0].variableBorrowRate.toString()}</li>
      <li>Stable borrow rate: {data[0].stableBorrowRate.toString()}</li>
      <li>Average stable borrow rate: {data[0].averageStableBorrowRate.toString()}</li>
      <li>Liquidity index: {data[0].liquidityIndex.toString()}</li>
      <li>Variable borrow index: {data[0].variableBorrowIndex.toString()}</li>
      <li>Last update timestamp: {data[0].lastUpdateTimestamp.toString()}</li>
    </ul>
  )
}
const Markets: NextPage = () => {
  const aaveProtocolDataProvider = useContractInstance(
    AaveProtocolDataProvider__factory,
    'AaveProtocolDataProvider',
  )
  const calls = [aaveProtocolDataProvider.getAllReservesTokens] as const
  const [{ data }] = useContractCall<AaveProtocolDataProvider, typeof calls>(
    calls,
    [[]],
    'protocol-reserves-tokens',
  )

  if (!data) return <div>Markets</div>

  return (
    <TokenIconsProvider>
      <BaseTitle>Markets</BaseTitle>
      <Card>
        {data[0].map(({ symbol, tokenAddress }) => (
          <div key={tokenAddress}>
            <strong>
              {tokenAddress} - {symbol}
            </strong>{' '}
            - <TokenIcon symbol={symbol} />
            <ReserveData tokenAddress={tokenAddress} />
          </div>
        ))}
      </Card>
    </TokenIconsProvider>
  )
}

export default Markets
