import { BigNumber } from '@ethersproject/bignumber'

import { agaveTokens } from '@/src/config/agaveTokens'

export const useBorrowStepInitialIndex = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  // check if the token is the native token, then verify the allowance
  if (tokenInfo.symbol === 'XDAI') {
    // TODO: get the allowance. See: `useApproveDelegationMutation` in v1
    const allowance = 0
    // if the allowance is less than the amount, then return 0 (the allowance step)
    if (BigNumber.from(allowance).lt(amount)) {
      return 0
    }
    // if not, skip the mode and allowance steps and return 1 (the borrow step)
    return 1
  }
  // if the token is not the native token, then skip the allowance step and return 1 (the borrow step)
  return 1
}
