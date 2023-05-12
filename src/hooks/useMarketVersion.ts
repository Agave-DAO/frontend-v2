import { useRouter } from 'next/router'

import { useEffectOnce } from 'usehooks-ts'

import { MarketVersions } from '@/src/contracts/contracts'
import { usePersistedState } from '@/src/hooks/usePersistedState'

export const useMarketVersion = () => {
  const { query } = useRouter()
  const marketVersionFromQuery = query.marketVersion as MarketVersions

  const [marketVersion, setMarketVersion] = usePersistedState<MarketVersions>(
    'marketVersion',
    // initialize with the market version from the query or default to v1
    MarketVersions[marketVersionFromQuery] || MarketVersions.main,
  )

  useEffectOnce(() => {
    if (marketVersionFromQuery && marketVersionFromQuery !== marketVersion) {
      setMarketVersion(marketVersionFromQuery)
    }
  })

  return [marketVersion, setMarketVersion] as const
}
