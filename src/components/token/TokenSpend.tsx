import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { ContractTransaction } from 'ethers'

import TxButton from '@/src/components/buttons/txButton'
import { Formfield } from '@/src/components/form/Formfield'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory } from '@/types/generated/typechain'

const CSSMaxWidth = css`
  min-width: 300px;
  max-width: 100%;
`

const TokenInput = styled(BaseTokenInput)`
  ${CSSMaxWidth}
`

const Button = styled(TxButton)`
  margin-top: 22px;
`

type Props = {
  label: string
  erc20Address: string // ERC20 address
  spender: string // Spender address
  spendAction: () => Promise<ContractTransaction> // action like deposit, withdraw, borrow, etc
  erc20Info?: {
    symbol: string
    decimals: number
  }
}

const TokenSpend = ({ erc20Address, erc20Info, label, spendAction, spender }: Props) => {
  const { address } = useWeb3ConnectedApp()
  const [value, setValue] = useState('0')

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const erc20 = useContractInstance(ERC20__factory, erc20Address)

  const calls = [erc20.decimals, erc20.symbol, erc20.balanceOf, erc20.allowance] as const
  const [{ data }, refetch] = useContractCall(
    calls,
    [[], [], [address], [address, spender]],
    erc20Info ? null : `erc20Spend-token-data-${address}`,
  )

  if (!data?.length && !erc20Info) {
    throw Error('Impossible to get token data')
  }

  const [decimals, symbol, balance, allowance] = data || [
    erc20Info!.decimals,
    erc20Info!.symbol,
    ZERO_BN,
    ZERO_BN,
  ]

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || BigNumber.from(value || ZERO_BN).eq(ZERO_BN)

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={decimals}
            maxValue={balance.toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            symbol={symbol}
            value={value}
          />
        }
        label={label}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      {allowance.lt(value || ZERO_BN) ? (
        <Button
          disabled={disableSubmit}
          onMined={() => refetch()}
          tx={() => erc20.approve(spender, value)}
        >
          Approve
        </Button>
      ) : (
        <Button
          disabled={disableSubmit}
          onMined={() => refetch()}
          onSend={(tx) => tx && setValue('0')}
          tx={() => spendAction()}
        >
          {label}
        </Button>
      )}
    </SimpleGrid>
  )
}

export default withGenericSuspense(TokenSpend)
