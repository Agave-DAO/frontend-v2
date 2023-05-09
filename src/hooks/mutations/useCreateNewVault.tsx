import { useCallback } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import {
  SwapperCoordinator__factory,
  SwapperUserProxyImplementation__factory,
} from '@/types/generated/typechain'

export const useCreateNewVault = () => {
  const SwapperCoordinatorContract = useContractInstance(
    SwapperCoordinator__factory,
    'SwapperCoordinator',
    true,
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

export const useEditVaultName = (vaultAddress: string) => {
  const SwapperProxyImplementationContract = useContractInstance(
    SwapperUserProxyImplementation__factory,
    vaultAddress,
  )

  const sendTx = useTransaction()

  return useCallback(
    async (vaultName: string) => {
      try {
        const tx = await sendTx(() => SwapperProxyImplementationContract.setProxyName(vaultName))
        const receipt = await tx.wait()

        return receipt
      } catch (error) {
        console.error(error)
        return false
      }
    },
    [SwapperProxyImplementationContract, sendTx],
  )
}
