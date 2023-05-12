import { useCallback } from 'react'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { Swapper_UserProxyImplementation__factory } from '@/types/generated/typechain'

export const useEditVaultName = (vaultAddress: string) => {
  const SwapperProxyImplementationContract = useContractInstance(
    Swapper_UserProxyImplementation__factory,
    vaultAddress,
    { useSigner: true },
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
