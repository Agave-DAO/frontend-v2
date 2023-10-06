import { Chains } from '@/src/config/web3'
import AaveOracle from '@/src/contracts/abis/AaveOracle.json'
import AaveProtocolDataProvider from '@/src/contracts/abis/AaveProtocolDataProvider.json'
import AgaveLendingPool from '@/src/contracts/abis/AgaveLending.json'
import BaseIncentivesController from '@/src/contracts/abis/BaseIncentivesController.json'
import ERC20 from '@/src/contracts/abis/ERC20.json'
import SavingsXDai from '@/src/contracts/abis/SavingsXDai.json'
import SavingsXDaiAdapter from '@/src/contracts/abis/SavingsXDaiAdapter.json'
import StakedToken from '@/src/contracts/abis/StakedToken.json'
import WETHGateway from '@/src/contracts/abis/WETHGateway.json'

export const contracts = {
  xDAI: {
    address: {
      [Chains.gnosis]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      //   [Chains.chiado]: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    },
    abi: ERC20,
  },
  WxDAI: {
    address: {
      [Chains.gnosis]: '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
      //    [Chains.chiado]: '0x18c8a7ec7897177E4529065a7E7B0878358B3BfF',
    },
    abi: ERC20,
  },
  USDC: {
    address: {
      [Chains.gnosis]: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
      //    [Chains.chiado]: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    },
    abi: ERC20,
  },
  AGVE: {
    address: {
      [Chains.gnosis]: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
      //    [Chains.chiado]: '0x3a97704a1b25F08aa230ae53B352e2e72ef52843',
    },
    abi: ERC20,
  },
  AaveProtocolDataProvider: {
    address: {
      [Chains.gnosis]: '0xE6729389DEa76D47b5BcB0bA5c080821c3B51329',
      //    [Chains.chiado]: '0xE6729389DEa76D47b5BcB0bA5c080821c3B51329',
    },
    abi: AaveProtocolDataProvider,
  },
  AaveOracle: {
    address: {
      [Chains.gnosis]: '0x062B9D1D3F5357Ef399948067E93B81F4B85db7a',
      //    [Chains.chiado]: '0x062B9D1D3F5357Ef399948067E93B81F4B85db7a',
    },
    abi: AaveOracle,
  },
  AgaveLendingPool: {
    address: {
      [Chains.gnosis]: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
      //     [Chains.chiado]: '0x5E15d5E33d318dCEd84Bfe3F4EACe07909bE6d9c',
    },
    abi: AgaveLendingPool,
  },
  BaseIncentivesController: {
    address: {
      [Chains.gnosis]: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
      //     [Chains.chiado]: '0xfa255f5104f129B78f477e9a6D050a02f31A5D86',
    },
    abi: BaseIncentivesController,
  },
  WETHGateway: {
    address: {
      [Chains.gnosis]: '0x36A644cC38Ae257136EEca5919800f364d73FeFC',
      //      [Chains.chiado]: '0x36A644cC38Ae257136EEca5919800f364d73FeFC',
    },
    abi: WETHGateway,
  },
  StakedToken: {
    address: {
      [Chains.gnosis]: '0x610525b415c1BFAeAB1a3fc3d85D87b92f048221',
      //      [Chains.chiado]: '0x610525b415c1BFAeAB1a3fc3d85D87b92f048221',
    },
    abi: StakedToken,
  },
  SavingsXDaiAdapter: {
    address: {
      [Chains.gnosis]: '0xD499b51fcFc66bd31248ef4b28d656d67E591A94',
      //     [Chains.chiado]: '0x0EA5928162b0F74BAEf31c00A04A4cEC5Fe9f4b2',
    },
    abi: SavingsXDaiAdapter,
  },
  SavingsXDai: {
    address: {
      [Chains.gnosis]: '0xaf204776c7245bF4147c2612BF6e5972Ee483701',
      //     [Chains.chiado]: '0x20e5eB701E8d711D419D444814308f8c2243461F',
    },
    abi: SavingsXDai,
  },
} as const

export type ContractsKeys = keyof typeof contracts

export const isKnownContract = (
  contractName: ContractsKeys | string,
): contractName is ContractsKeys => {
  return contracts[contractName as ContractsKeys] !== undefined
}
