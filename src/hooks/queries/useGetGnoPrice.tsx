import { Zero } from '@ethersproject/constants'

import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

export const useGetGnoPrice = () => {
  const agaveTokens = useAgaveTokens()
  const gnoAddress = agaveTokens.getTokenByFieldAndValue({ symbol: 'GNO' })?.address

  if (!gnoAddress) {
    throw new Error('GNO address not found')
  }

  const [{ data }, refreshGnoPrice] = useGetAssetsPriceInDAI([gnoAddress])
  const [gnoPrice] = data?.[0] ?? [Zero]

  return {
    gnoPrice,
    refreshGnoPrice,
  }
}
