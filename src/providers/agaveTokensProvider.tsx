import { useRouter } from 'next/router'
import { FC, PropsWithChildren, createContext, useContext, useEffect, useMemo } from 'react'

import isEmpty from 'lodash/isEmpty'
import { useEffectOnce } from 'usehooks-ts'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { IDAgaveTokens, agaveTokensBoosted, agaveTokensMain } from '@/src/config/agaveTokens'
import { MarketVersions } from '@/src/contracts/contracts'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenIconsContext = createContext<IDAgaveTokens>([] as any)

export const TokensContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { appChainId } = useWeb3Connection()
  const [marketVersion] = useMarketVersion()

  // Return the tokens based on the market version
  const tokens = useMemo(() => {
    if (marketVersion && window !== undefined) {
      switch (marketVersion) {
        case MarketVersions.boosted:
          agaveTokensBoosted.chainId = appChainId
          return agaveTokensBoosted
        default:
          agaveTokensMain.chainId = appChainId
          return agaveTokensMain
      }
    }
  }, [appChainId, marketVersion])

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
