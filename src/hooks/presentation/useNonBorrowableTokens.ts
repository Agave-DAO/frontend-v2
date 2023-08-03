import { useEffect, useState } from 'react'

import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

export const useNonBorrowableTokens = () => {
  const marketData = useMarketsData()
  const agaveTokens = useAgaveTokens()
  const [nonBorrowableAddresses, setNonBorrowableAddresses] = useState<string[]>([])
  const [nonBorrowableSymbols, setNonBorrowableSymbols] = useState<string[]>([])

  useEffect(() => {
    if (marketData.agaveMarketsData !== undefined && agaveTokens !== undefined) {
      const newNonBorrowableAddresses = marketData.agaveMarketsData
        .filter((item) => item.assetData && item.tokenAddress && !item.assetData.borrowingEnabled)
        .map((item) => item.tokenAddress)
      const newNonBorrowableSymbols = newNonBorrowableAddresses.map(
        (address) => agaveTokens.getTokenByAddress(address).symbol,
      )
      setNonBorrowableAddresses(newNonBorrowableAddresses)
      setNonBorrowableSymbols(newNonBorrowableSymbols)
    }
  }, [marketData.agaveMarketsData, agaveTokens])

  return {
    addresses: nonBorrowableAddresses,
    symbols: nonBorrowableSymbols,
  }
}
