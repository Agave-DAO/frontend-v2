import { FC, PropsWithChildren, createContext, useContext } from 'react'

import isEmpty from 'lodash/isEmpty'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { IDAgaveTokens, agaveTokens } from '@/src/config/agaveTokens'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenIconsContext = createContext<IDAgaveTokens>([] as any)

export const TokensContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const tokens = agaveTokens

  if (!tokens) {
    return null
  }

  return <TokenIconsContext.Provider value={tokens}>{children}</TokenIconsContext.Provider>
}

export default withGenericSuspense(TokensContextProvider)

export function useAgaveTokens(): IDAgaveTokens {
  const context = useContext(TokenIconsContext)
  if (context === undefined || isEmpty(context)) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return useContext<IDAgaveTokens>(TokenIconsContext)
}
