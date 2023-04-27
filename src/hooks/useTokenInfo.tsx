import { isAddress } from '@ethersproject/address'

import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

/**
 * A helper function that may not last long.
 *
 * This function is used to get the token info from the token symbol or the token address.
 *
 * If nothing is found, it throws an error.
 * @param token
 */
export function useTokenInfo(token?: string) {
  const agaveTokens = useAgaveTokens()

  if (!token) {
    return
  }

  if (isAddress(token)) {
    return agaveTokens.getTokenByAddress(token)
  }

  const tokenByFieldAndValue = agaveTokens.getTokenByFieldAndValue({ symbol: token })

  if (!tokenByFieldAndValue) {
    throw Error('There is not token info for the token symbol provided')
  }

  return tokenByFieldAndValue
}
