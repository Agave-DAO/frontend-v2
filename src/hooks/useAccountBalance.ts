import { Zero } from '@ethersproject/constants'

import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { ERC20__factory } from '@/types/generated/typechain'

export function useAccountBalance({
  accountAddress,
  tokenAddress,
}: {
  accountAddress: string
  tokenAddress: string
}) {
  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.balanceOf] as const

  const [{ data }] = useContractCall(
    calls,
    [[accountAddress]],
    `balanceOf-${tokenAddress}-${accountAddress}`,
    {
      refreshInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
    },
  )

  return {
    balance: data?.[0] ?? Zero,
  }
}
