import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { ContractReceipt, ContractTransaction } from 'ethers'

import TxButton from '@/src/components/buttons/txButton'
import { Formfield } from '@/src/components/form/Formfield'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { agaveTokens } from '@/src/config/agaveTokens'
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
  label?: string
  tokenAddress: string
  action: (value: string) => Promise<ContractTransaction>
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
}

const WithdrawToken = ({
  action,
  label = 'Withdraw',
  onFail,
  onMined,
  onSend,
  tokenAddress,
}: Props) => {
  const { address: connectedAddress } = useWeb3ConnectedApp()
  const [value, setValue] = useState('0')

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.decimals, erc20.symbol, erc20.balanceOf] as const
  const [{ data }, refetch] = useContractCall(
    calls,
    [[], [], [connectedAddress]],
    `TokenWithdraw-${tokenAddress}-${connectedAddress}`,
  )

  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  if (!data) {
    throw Error('There was not possible to fetch token info')
  }

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || BigNumber.from(value || ZERO_BN).eq(ZERO_BN)

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={tokenInfo?.decimals ?? data[0]}
            maxValue={data[2].toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            symbol={tokenInfo?.symbol ?? data[1]}
            value={value}
          />
        }
        label={label}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      <Button
        disabled={disableSubmit}
        onFail={(e) => onFail && onFail(e)}
        onMined={(r) => {
          refetch()
          if (onMined) {
            onMined(r)
          }
        }}
        onSend={(tx) => {
          setValue('0')
          if (tx && onSend) {
            onSend(tx)
          }
        }}
        tx={() => action(value)}
      >
        {label}
      </Button>
    </SimpleGrid>
  )
}

export default withGenericSuspense(WithdrawToken)
