import { JsonRpcSigner } from '@ethersproject/providers'
import nullthrows from 'nullthrows'

import { ContractsKeys, contracts } from '@/src/contracts/contracts'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import * as typechainImports from '@/types/generated/typechain'
import { ObjectValues } from '@/types/utils'

type GetFactories<T> = T extends { connect: (...args: never) => unknown } ? T : never

type AppFactories = GetFactories<ObjectValues<typeof typechainImports>>

export const useContractInstance = <F extends AppFactories, RT extends ReturnType<F['connect']>>(
  contractFactory: F,
  contractKey: ContractsKeys,
) => {
  const { appChainId, readOnlyAppProvider, web3Provider } = useWeb3Connection()
  const address = contracts[contractKey]['address'][appChainId]
  const signer = web3Provider?.getSigner() || readOnlyAppProvider
  nullthrows(signer, 'There is not signer to execute a tx.')

  return contractFactory.connect(address, signer as JsonRpcSigner) as RT
}
