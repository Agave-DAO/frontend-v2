import { isAddress } from '@ethersproject/address'

import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'

function isValidVault(vaultAddress: string) {
  return true
}

export const useCollateralSwap = () => {
  const vaultAddress = useGetQueryParam('vault')

  if (!vaultAddress || !isAddress(vaultAddress) || !isValidVault(vaultAddress)) {
    throw new Error('No valid vault address provided')
  }

  return {
    data: {
      name: 'Collateral Swap',
      vaultAddress,
    },
  }
}
