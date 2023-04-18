import { FC, PropsWithChildren, createContext, useContext } from 'react'

import isEmpty from 'lodash/isEmpty'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokenWithType, agaveTokens } from '@/src/config/agaveTokens'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenIconsContext = createContext<TokenWithType[]>([] as any)

export const TokenIconsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const tokens = agaveTokens.allTokens

  if (!tokens) {
    return null
  }

  return <TokenIconsContext.Provider value={tokens}>{children}</TokenIconsContext.Provider>
}

export default withGenericSuspense(TokenIconsContextProvider)

export function useTokenIcons(): TokenWithType[] {
  const context = useContext(TokenIconsContext)
  if (context === undefined || isEmpty(context)) {
    throw new Error('useWeb3Connection must be used within a Web3ConnectionProvider')
  }
  return useContext<TokenWithType[]>(TokenIconsContext)
}
