import { useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { One } from '@ethersproject/constants'

import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { fromWei } from '@/src/utils/common'
import { NumberType } from '@/src/utils/format'

export interface Props {
  limit: BigNumber
  priceData: BigNumber
  tokenAddress: string
}

const FiatTokenAmount = styled.span`
  font-size: 1.5rem;
  opacity: 0.5;
`

/**
 * Displays the token cap value in both token and USD.
 * IF limit is 0, then it displays "unlimited"
 * IF limit is 1 wei, then it displays "Zero"
 * ELSE it displays the limit in token and USD
 * @param limit
 * @param priceData
 * @param tokenAddress
 * @constructor
 */
export const TokenCapValue = ({ limit, priceData, tokenAddress }: Props) => {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)

  const { tokenAmount, usdAmount } = useMemo(() => {
    if (limit.eq(One)) {
      return {
        tokenAmount: ZERO_BN,
        usdAmount: ZERO_BN,
      }
    }

    return {
      tokenAmount: fromWei(limit, tokenInfo.decimals),
      usdAmount: fromWei(limit, tokenInfo.decimals).mul(fromWei(priceData)),
    }
  }, [limit, priceData, tokenInfo.decimals])

  return (
    <>
      <TokenIcon dimensions={18} symbol={tokenInfo.symbol} />
      {limit.isZero() ? (
        <i>unlimited</i>
      ) : (
        <>
          <Amount decimals={0} symbol="" value={tokenAmount} />
          <FiatTokenAmount>
            (
            <Amount
              decimals={0}
              numberType={NumberType.FiatTokenPrice}
              symbol=""
              value={usdAmount}
            />
            )
          </FiatTokenAmount>
        </>
      )}
    </>
  )
}
