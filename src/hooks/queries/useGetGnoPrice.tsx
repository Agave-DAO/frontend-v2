import { Zero } from '@ethersproject/constants'

import { agaveTokens } from '@/src/config/agaveTokens'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'

export const useGetGnoPrice = () => {
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
