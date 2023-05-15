/**
 * IMPORTANT: DO NOT DELETE THIS FILE
 * Due to the limitations of static files + IPFS we can't use the usual approach
 * of using the vault address as part of the param in the URL
 * (as they are dynamic).
 */
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
