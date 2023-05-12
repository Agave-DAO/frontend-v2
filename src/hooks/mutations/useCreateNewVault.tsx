import { useCallback } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { Swapper_Coordinator__factory } from '@/types/generated/typechain'

export const useCreateNewVault = () => {
  const SwapperCoordinatorContract = useContractInstance(
    Swapper_Coordinator__factory,
    'SwapperCoordinator',
    { useSigner: true },
  )

  const sendTx = useTransaction()

  return useCallback(
    async (vaultName: string) => {
      try {
        const tx = await sendTx(() => SwapperCoordinatorContract.generateUserProxy(vaultName))
        const receipt = await tx.wait()

        return receipt
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [SwapperCoordinatorContract, sendTx],
  )
}
