import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'

export const useCollateralSwap = () => {
  const vaultAddress = useGetQueryParam('vault')

  console.log('hook: useCollateralSwap')
  console.log('vaultAddress', vaultAddress)

  return {
    data: {
      name: 'Collateral Swap',
      vaultAddress,
    },
  }
}
