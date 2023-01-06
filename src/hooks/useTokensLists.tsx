import { useEffect, useMemo, useState } from 'react'

import { useTokenIcons } from '@/src/providers/tokenIconsProvider'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { Token } from '@/types/token'

export const useTokensLists = (onChange?: (token: Token | null) => void) => {
  const { appChainId } = useWeb3Connection()
  const [token, setToken] = useState<Token | null>(null)
  const { tokensByNetwork } = useTokenIcons()
  const tokens = useMemo(() => tokensByNetwork[appChainId] || [], [appChainId, tokensByNetwork])
  const [tokensList, setTokensList] = useState(tokens)
  const [searchString, setSearchString] = useState('')

  const onSelectToken = (token: Token | null) => {
    setToken(token)

    if (typeof onChange !== 'undefined') {
      onChange(token)
    }
  }

  useEffect(() => {
    if (searchString.length === 0) {
      setTokensList(tokens)
    } else {
      setTokensList(
        tokens.filter(
          (item) => item.symbol.toLowerCase().indexOf(searchString.toLowerCase()) !== -1,
        ),
      )
    }
  }, [tokens, searchString])

  return {
    token,
    tokensList,
    onSelectToken,
    searchString,
    setSearchString,
  }
}
