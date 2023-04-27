import { useCallback, useMemo, useState } from 'react'

import { AgaveProtocolTokenType, TokenWithType } from '@/src/config/agaveTokens'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { Token } from '@/types/token'

export const useTokensLists = (
  types?: AgaveProtocolTokenType[], // combine multiple token types to filter the list.
  onChange?: (token: Token | null) => void,
) => {
  const [token, setToken] = useState<Token | null>()
  const tokens = useAgaveTokens().allTokens

  const [searchString, setSearchString] = useState<string>('')

  const filteredTokensByType = useMemo(
    () => (types ? tokens.filter(({ type }) => types.includes(type)) : tokens),
    [tokens, types],
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
