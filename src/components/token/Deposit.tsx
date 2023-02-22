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
  spenderAddress: string
  maxValue?: BigNumber
  action: (value: string) => Promise<ContractTransaction>
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
}

const DepositToken = ({
  action,
  label = 'Deposit',
  maxValue,
  onFail,
  onMined,
  onSend,
  spenderAddress,
  tokenAddress,
}: Props) => {
  const { address: connectedAddress } = useWeb3ConnectedApp()
  const [value, setValue] = useState('0')
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const erc20 = useContractInstance(ERC20__factory, tokenAddress)
  const calls = [erc20.balanceOf, erc20.allowance] as const
  const [{ data }, refetch] = useContractCall(
    calls,
    [[connectedAddress], [connectedAddress, spenderAddress]],
    `TokenDeposit-${tokenAddress}-${connectedAddress}`,
  )

  if (!data) {
    throw Error('There was not possible to fetch token info')
  }

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || BigNumber.from(value || ZERO_BN).eq(ZERO_BN)

  const maxValueOrBalance = maxValue && maxValue.lt(data[0]) ? maxValue : data[0]

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={tokenInfo?.decimals}
            maxValue={maxValueOrBalance.toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            symbol={tokenInfo?.symbol}
            value={value}
          />
        }
        label={label}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      {data[1].lt(value || ZERO_BN) ? (
        <Button
          disabled={disableSubmit}
          onMined={() => refetch()}
          tx={() => erc20.approve(spenderAddress, value)}
        >
          Approve
        </Button>
      ) : (
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
      )}
    </SimpleGrid>
  )
}

export default withGenericSuspense(DepositToken)
