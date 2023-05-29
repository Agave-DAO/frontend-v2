import { useCallback, useMemo, useState } from 'react'

import { AgaveProtocolTokenType, TokenWithType } from '@/src/config/agaveTokens'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { isSameAddress } from '@/src/utils/isSameAddress'
import { Token } from '@/types/token'

const byTypes =
  (types?: string[]) =>
  ({ type }: Token) => {
    if (types) {
      return types.includes(type)
    }

    return true
  }

const byFrozenStatus =
  ({
    enabledMarketsAddresses,
    includeFrozen,
  }: {
    enabledMarketsAddresses?: string[]
    includeFrozen?: boolean
  }) =>
  ({ address }: Token) => {
    if (!includeFrozen) {
      return enabledMarketsAddresses?.some((enabledMarketAddress) =>
        isSameAddress(enabledMarketAddress, address),
      )
    }

    return true
  }

interface TokenListProps {
  includeFrozen?: boolean
  onChange?: (token: Token | null) => void
  types?: AgaveProtocolTokenType[] // combine multiple token types to filter the list.
}

export const useTokensLists = ({ includeFrozen = true, onChange, types }: TokenListProps) => {
  const [token, setToken] = useState<Token | null>()
  const agaveTokens = useAgaveTokens()

  const enabledMarketsAddresses = useMarketsData()
    .agaveMarketsData?.filter((market) => !market.assetData.isFrozen)
    ?.map(({ tokenAddress }) => tokenAddress)

  const [searchString, setSearchString] = useState<string>('')

  const filteredTokensByType = useMemo(
    () =>
      agaveTokens.allTokens.filter(byTypes(types)).filter(
        byFrozenStatus({
          enabledMarketsAddresses,
          includeFrozen,
        }),
      ),
    [agaveTokens.allTokens, enabledMarketsAddresses, includeFrozen, types],
  )

  const [tokensList, setTokensList] = useState(filteredTokensByType)

  const onSelectToken = (token: TokenWithType | null) => {
    setToken(token)
    onChange?.(token)
  }

  const onSearch = useCallback(
    (searchString: string) => {
      setSearchString(searchString)
      if (searchString.length === 0) {
        setTokensList(filteredTokensByType)
      } else {
        setTokensList(
          filteredTokensByType.filter(
            (item) => item.symbol.toLowerCase().indexOf(searchString.toLowerCase()) !== -1,
          ),
        )
      }
    },
    [filteredTokensByType],
  )

  return {
    token,
    tokensList,
    onSelectToken,
    onSearch,
    searchString,
  }
}
