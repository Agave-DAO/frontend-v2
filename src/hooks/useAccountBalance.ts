import { Zero } from '@ethersproject/constants'

import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { ERC20__factory } from '@/types/generated/typechain'

export function useAccountBalance({
  accountAddress,
  tokenAddress,
}: {
  accountAddress: string
  tokenAddress: string
}) {
  const tokenInfo = useAgaveTokens().getTokenByAddress(tokenAddress)
  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.balanceOf] as const

  const [{ data }] = useContractCall(
    calls,
    [[accountAddress]],
    `balanceOf-${tokenAddress}-${accountAddress}`,
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
      // when the tokenAddress is not a valid ERC20 contract, the balanceOf call will fail
      fallbackData: tokenInfo.extensions.isNative ? [Zero] : undefined,
    },
  )

  return {
    balance: data?.[0] ?? Zero,
  }
}
