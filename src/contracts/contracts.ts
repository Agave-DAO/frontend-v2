import { Chains } from '@/src/config/web3'
import AaveOracle from '@/src/contracts/abis/AaveOracle.json'
import AaveProtocolDataProvider from '@/src/contracts/abis/AaveProtocolDataProvider.json'
import AgaveLendingPool from '@/src/contracts/abis/AgaveLending.json'
import BaseIncentivesController from '@/src/contracts/abis/BaseIncentivesController.json'
import ERC20 from '@/src/contracts/abis/ERC20.json'

export const contracts = {
  WxDAI: {
    address: {
      [Chains.gnosis]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
    },
    abi: ERC20,
  },
  USDC: {
    address: {
      [Chains.gnosis]: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    },
    abi: ERC20,
  },
  AGVE: {
    address: {
      [Chains.gnosis]: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
    },
    abi: ERC20,
  },
  AaveProtocolDataProvider: {
    address: {
      [Chains.gnosis]: '0x24dCbd376Db23e4771375092344f5CbEA3541FC0',
    },
    abi: AaveProtocolDataProvider,
  },
  AaveOracle: {
    address: {
      [Chains.gnosis]: '0x64cE22B5bA4175002AC5B6CCE3570432cA363c29',
    },
    abi: AaveOracle,
  },
  AgaveLendingPool: {
    address: {
      [Chains.gnosis]: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
    },
    abi: AgaveLendingPool,
  },
  BaseIncentivesController: {
    address: {
      [Chains.gnosis]: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
    },
    abi: BaseIncentivesController,
  },
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
