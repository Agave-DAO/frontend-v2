import { Chains } from '@/src/config/web3'
import ERC20 from '@/src/contracts/abis/ERC20.json'
import {
  AaveOracle__factory,
  AaveProtocolDataProvider__factory,
  AgaveLending__factory,
  BaseIncentivesController__factory,
  ERC20__factory,
  StakedToken__factory,
  Swapper_Coordinator__factory,
  Swapper_Helper__factory,
  Swapper_UserProxyImplementation__factory,
  WETHGateway__factory,
} from '@/types/generated/typechain'

export enum MarketVersions {
  main = 'main',
  boosted = 'boosted',
}

const mainContracts = {
  WxDAI: {
    address: {
      [Chains.gnosis]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    },
    abi: ERC20,
  },
  AGVE: {
    address: {
      [Chains.gnosis]: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
    },
    factory: ERC20__factory,
  },
  AaveProtocolDataProvider: {
    address: {
      [Chains.gnosis]: '0xE6729389DEa76D47b5BcB0bA5c080821c3B51329',
    },
    factory: AaveProtocolDataProvider__factory,
  },
  AgaveLendingPool: {
    address: {
      [Chains.gnosis]: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
    },
    factory: AgaveLending__factory,
  },
  BaseIncentivesController: {
    address: {
      [Chains.gnosis]: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
    },
    factory: BaseIncentivesController__factory,
  },
  AaveOracle: {
    address: {
      [Chains.gnosis]: '0x062B9D1D3F5357Ef399948067E93B81F4B85db7a',
    },
    factory: AaveOracle__factory,
  },
  WETHGateway: {
    address: {
      [Chains.gnosis]: '0x36A644cC38Ae257136EEca5919800f364d73FeFC',
    },
    factory: WETHGateway__factory,
  },
  StakedToken: {
    address: {
      [Chains.gnosis]: '0x610525b415c1BFAeAB1a3fc3d85D87b92f048221',
    },
    factory: StakedToken__factory,
  },
  SwapperCoordinator: {
    address: {
      [Chains.gnosis]: '0xdD494510e56347058703c277Ef770D3D9099ca42',
    },
    factory: Swapper_Coordinator__factory,
  },
  SwapperHelper: {
    address: {
      [Chains.gnosis]: '0xb624888498c057b5398eF34898EfC3d0fBF89489',
    },
    factory: Swapper_Helper__factory,
  },
  SwapperUserProxyImplementation: {
    address: {
      [Chains.gnosis]: '0xea45ce264A5b2A2d2CC12Fd5a92D6c8b444d5636',
    },
    factory: Swapper_UserProxyImplementation__factory,
  },
} as const

const boostedContracts = {
  AaveProtocolDataProvider: {
    address: {
      [Chains.gnosis]: '0xE6729389DEa76D47b5BcB0bA5c080821c3B51329',
    },
    factory: AaveProtocolDataProvider__factory,
  },
  AgaveLendingPool: {
    address: {
      [Chains.gnosis]: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
    },
    factory: AgaveLending__factory,
  },
  BaseIncentivesController: {
    address: {
      [Chains.gnosis]: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
    },
    factory: BaseIncentivesController__factory,
  },
} as const

export const contracts = {
  [MarketVersions.main]: mainContracts,
  [MarketVersions.boosted]: {
    ...mainContracts,
    ...boostedContracts,
  },
}

const MAIN_KEYS = Object.keys(contracts[MarketVersions.main]) as Array<
  keyof typeof contracts[MarketVersions.main]
>
const BOOSTED_KEYS = Object.keys(contracts[MarketVersions.boosted]) as Array<
  keyof typeof contracts[MarketVersions.boosted]
>

const KEYS = [...new Set([...MAIN_KEYS, ...BOOSTED_KEYS])] as const

// this is valid as we assume that contracts names/interfaces are the same for all markets
export type ContractsKeys = typeof KEYS[number]

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return KEYS.includes(contractName as ContractsKeys)
}
