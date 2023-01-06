import { Chains } from '@/src/config/web3'
import ERC_20_abi from '@/src/contracts/abis/ERC20.json'

export const contracts = {
  DAI: {
    address: {
      // [Chains.mainnet]: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      [Chains.goerli]: '0x5c221e77624690fff6dd741493d735a17716c26b',
    },
    abi: ERC_20_abi,
  },
  USDC: {
    address: {
      // [Chains.mainnet]: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      [Chains.goerli]: '0x78dEca24CBa286C0f8d56370f5406B48cFCE2f86',
    },
    abi: ERC_20_abi,
  },
} as const

export type ContractsKeys = keyof typeof contracts
