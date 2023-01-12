import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import { Contract } from '@ethersproject/contracts'
import { KeyedMutator } from 'swr'

import { ChainsValues } from '@/types/chains'

export type ObjectValues<T> = T[keyof T]

export type Extends<T, U extends T> = U
export type Maybe<T> = T | null
export type RequiredNonNull<T> = { [P in keyof T]-?: NonNullable<T[P]> }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SwrResponse<T> = { data: T[]; loading: boolean; error: any }
export type MySWRResponse<T> = [
  { data: Awaited<T>; error: null } | { data: null; error: Error },
  KeyedMutator<T>,
]
export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapReturnType<T> = T extends (...args: any) => any ? Awaited<ReturnType<T>> : never

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnwrapParametersType<T> = T extends (...args: any) => any ? Parameters<T> : never

export type TupleReturnType<MyContract extends Contract, Tuple extends unknown[]> = Tuple extends [
  infer Head,
  ...infer Tail,
]
  ? [UnwrapReturnType<Head>, ...TupleReturnType<MyContract, Tail>]
  : []

export type TupleParametersType<
  MyContract extends Contract,
  Tuple extends unknown[],
> = Tuple extends [infer Head, ...infer Tail]
  ? [UnwrapParametersType<Head>, ...TupleParametersType<MyContract, Tail>]
  : []

export enum RPCProviders {
  infura = 'infura',
  alchemy = 'alchemy',
}

export const RPCProvidersENV: Record<RPCProviders, any> = {
  [RPCProviders.infura]: process.env.NEXT_PUBLIC_INFURA_TOKEN,
  [RPCProviders.alchemy]: process.env.NEXT_PUBLIC_ALCHEMY_TOKEN,
}

export type ProviderChains = { [key in RPCProviders]: { [key in ChainsValues]: string } }

type BaseAppContractInfo = {
  abi: any[]
  decimals?: number
  icon?: JSX.Element
  symbol?: string
  priceTokenId?: string
}

export type ChainAppContractInfo = BaseAppContractInfo & {
  address: string
}

export type AppContractInfo = BaseAppContractInfo & {
  address: { [key in ChainsValues]: string }
}

export type IntrinsicElements<H extends HTMLElement = HTMLElement> = DetailedHTMLProps<
  HTMLAttributes<H>,
  H
>

export const isFulfilled = <T>(
  input: PromiseSettledResult<T>,
): input is PromiseFulfilledResult<T> => input.status === 'fulfilled'

export type RequiredFieldsOnly<T> = {
  [K in keyof T as T[K] extends Required<T>[K] ? K : never]: T[K]
}

export type IStringIndex = Record<string, any>
