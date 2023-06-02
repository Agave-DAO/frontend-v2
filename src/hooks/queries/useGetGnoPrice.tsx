import { ZERO_BN } from '@/src/constants/bigNumber'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

export const useGetGnoPrice = () => {
  const agaveTokens = useAgaveTokens()
  const gnoAddress = agaveTokens.getTokenByFieldAndValue({ symbol: 'GNO' })?.address

  if (!gnoAddress) {
    throw new Error('GNO address not found')
  }

  const [{ data }, refreshGnoPrice] = useGetAssetsPriceInDAI([gnoAddress])
  const [gnoPrice] = data?.[0] ?? [ZERO_BN]

  return {
    gnoPrice,
    refreshGnoPrice,
  }
}
