import { FC, PropsWithChildren, createContext, useContext } from 'react'

import useSWR from 'swr'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokensLists } from '@/src/config/web3'
import {
  Token,
  TokenListResponse,
  TokensByAddress,
  TokensByNetwork,
  TokensBySymbol,
} from '@/types/token'
import { isFulfilled } from '@/types/utils'

type TokenListQueryReturn = {
  tokens: Token[]
  tokensByAddress: TokensByAddress
  tokensBySymbol: TokensBySymbol
  tokensByNetwork: TokensByNetwork
}

const useTokenListQuery = () => {
  return useSWR(['token-list'], async () => {
    const tokenListPromises = Object.values(TokensLists).map(async (url) => fetch(url))

    const fulfilledResults = await Promise.allSettled(tokenListPromises).then((results) =>
      results.filter(isFulfilled),
    )
    const tokenLists: TokenListResponse[] = await Promise.all(
      fulfilledResults.map((fulfilledResult) => {
        if (!fulfilledResult.value.ok) {
          return Promise.resolve({ tokens: [] })
        }
        return fulfilledResult.value.json()
      }),
    )
    const tokenList = tokenLists.flatMap((tokenList) => tokenList.tokens)

    const { tokens, tokensByAddress, tokensByNetwork, tokensBySymbol } = tokenList.reduce(
      (acc: TokenListQueryReturn, token) => {
        const address = token.address.toLowerCase()

        if (acc.tokensByAddress[address]) {
          return acc
        }

        acc.tokens.push(token)
        acc.tokensByAddress[address] = token
        acc.tokensBySymbol[token.symbol.toLowerCase()] = token

        if (!acc.tokensByNetwork[token.chainId]) {
          acc.tokensByNetwork[token.chainId] = [token]
        } else {
          acc.tokensByNetwork[token.chainId].push(token)
        }

        return acc
      },
      {
        tokens: [],
        tokensByAddress: {},
        tokensBySymbol: {},
        tokensByNetwork: {},
      },
    )
    return {
      tokens: tokens.sort((a, b) => a.symbol.localeCompare(b.symbol)),
      tokensByAddress,
      tokensBySymbol,
      tokensByNetwork,
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TokenIconsContext = createContext<TokenListQueryReturn>({} as any)

export const TokenIconsContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data } = useTokenListQuery()

  if (!data) {
    return null
  }

  return <TokenIconsContext.Provider value={data}>{children}</TokenIconsContext.Provider>
}

export default withGenericSuspense(TokenIconsContextProvider)

export function useTokenIcons(): TokenListQueryReturn {
  return useContext<TokenListQueryReturn>(TokenIconsContext)
}
