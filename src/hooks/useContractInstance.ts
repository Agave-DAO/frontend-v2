import { isAddress } from '@ethersproject/address'
import { JsonRpcBatchProvider, JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import nullthrows from 'nullthrows'

import {
  ContractsKeys,
  MarketVersions,
  contracts,
  isKnownContract,
} from '@/src/contracts/contracts'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import * as typechainImports from '@/types/generated/typechain'
import { ObjectValues } from '@/types/utils'

type GetFactories<T> = T extends { connect: (...args: never) => unknown } ? T : never

type AppFactories = GetFactories<ObjectValues<typeof typechainImports>>

export const useContractInstance = <F extends AppFactories, RT extends ReturnType<F['connect']>>(
  contractFactory: F,
  contractKey: ContractsKeys | string,
  options: Partial<{ useSigner: boolean; batch: boolean }> = {},
) => {
  const { batch = false, useSigner = false } = options

  const { appChainId, batchProvider, readOnlyAppProvider, web3Provider } = useWeb3Connection()
  let [marketVersion] = useMarketVersion()

  /* Checking if the `marketVersion` variable is a valid key in the `MarketVersions`
  object. If it is not a valid key, then it sets the `marketVersion` variable to the value of the
  `main` key in the `MarketVersions` object. This ensures that the `marketVersion` variable always
  has a valid value. */
  if (!marketVersion || !MarketVersions[marketVersion]) {
    marketVersion = MarketVersions.main
  }

  let provider: JsonRpcSigner | JsonRpcBatchProvider | JsonRpcProvider = batch
    ? batchProvider
    : readOnlyAppProvider

  if (useSigner && web3Provider) {
    provider = web3Provider.getSigner()
  }

  let address: string
  if (isKnownContract(contractKey)) {
    address = contracts[marketVersion][contractKey].address[appChainId]
  } else if (isAddress(contractKey)) {
    address = contractKey
  } else {
    throw new Error(`Expected a valid address or contractKey, current value: ${contractKey}`)
  }

  nullthrows(provider, 'There is not signer to execute a tx.')

  return contractFactory.connect(address, provider) as RT
}
