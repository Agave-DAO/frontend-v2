import { isAddress } from 'ethers/lib/utils'

import { agaveTokens } from '@/src/config/agaveTokens'

/**
 * A helper function that may no last long
 * This function is used to get the token info from the token symbol or the token address
 * If nothing is found, it throws an error
 * @param token
 */
export function getTokenInfo(token: string) {
  if (isAddress(token)) {
    return agaveTokens.getTokenByAddress(token)
  }

  const tokenByFieldAndValue = agaveTokens.getTokenByFieldAndValue({ symbol: token })

  if (!tokenByFieldAndValue) {
    throw Error('There is not token info for the token symbol provided')
  }

  return tokenByFieldAndValue
}
