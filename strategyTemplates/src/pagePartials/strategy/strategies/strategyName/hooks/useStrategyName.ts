import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'

export const useStrategyName = () => {
  const vaultAddress = useGetQueryParam('vault')

  console.log('hook: useStrategyName')
  console.log('vaultAddress', vaultAddress)

  return {
    data: {
      name: 'Strategy Name',
      vaultAddress,
    },
  }
}
