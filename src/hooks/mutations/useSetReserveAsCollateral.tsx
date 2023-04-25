import { useCallback } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { AgaveLending__factory } from '@/types/generated/typechain'

export const useSetReserveAsCollateral = () => {
  const contract = useContractInstance(AgaveLending__factory, 'AgaveLendingPool', true)
  const txSender = useTransaction()

  return useCallback(
    (tokenAddress: string, value: boolean) =>
      txSender(() => contract.setUserUseReserveAsCollateral(tokenAddress, value)),
    [contract, txSender],
  )
}
