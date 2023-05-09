import { useCollateralSwap } from './hooks/useCollateralSwap'
import { BaseTitle } from '@/src/components/text/BaseTitle'

export const CollateralSwapContent = () => {
  const {
    data: { name, vaultAddress },
  } = useCollateralSwap()

  return (
    <div>
      <BaseTitle>{name}</BaseTitle>
      <p>Vault Address: {vaultAddress}</p>
    </div>
  )
}
