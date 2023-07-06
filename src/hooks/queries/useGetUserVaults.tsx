import useSWR from 'swr'

import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import {
  Swapper_Coordinator,
  Swapper_Coordinator__factory,
  Swapper_UserProxyImplementation__factory,
} from '@/types/generated/typechain'

export type VaultData = {
  name: string
  vaultAddress: string
}

export const useGetUserVaults = () => {
  const { address, batchProvider } = useWeb3ConnectedApp()
  const SwapperCoordinatorContract = useContractInstance(
    Swapper_Coordinator__factory,
    'SwapperCoordinator',
  )

  const calls = [SwapperCoordinatorContract.userProxyAddress] as const

  // get user vault addresses
  const [{ data: vaultAddresses }, refetchUserVaultAddresses] = useContractCall<
    Swapper_Coordinator,
    typeof calls
  >(calls, [[address]], `vaultList-${address}`)

  // get user vault names in a batch request (need to call ProxyName method on each vault address)
  const { data: vaultList, mutate: refetchUserVaults } = useSWR(
    vaultAddresses?.[0].length
      ? { key: `vaultList-names-${address}`, vaultAddresses: vaultAddresses[0] }
      : null,
    async ({ vaultAddresses }) => {
      const results: VaultData[] = await Promise.all(
        vaultAddresses.map(async (vaultAddress) => {
          const contract = Swapper_UserProxyImplementation__factory.connect(
            vaultAddress,
            batchProvider,
          )
          const name = await contract.proxyName()
          return { vaultAddress, name }
        }),
      )

      // reverse the results so that the newest vaults are at the top
      return results.reverse()
    },
    {
      revalidateOnMount: true,
    },
  )

  const refetchAll = async () => {
    await refetchUserVaultAddresses()
    await refetchUserVaults()
  }

  return { vaultList, refetchUserVaults: refetchAll }
}
