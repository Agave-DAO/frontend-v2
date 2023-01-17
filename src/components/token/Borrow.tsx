import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ContractReceipt, ContractTransaction } from 'ethers'

import TxButton from '@/src/components/buttons/txButton'
import { Formfield } from '@/src/components/form/Formfield'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { agaveTokens } from '@/src/config/agaveTokens'
import { ZERO_BN } from '@/src/constants/bigNumber'

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
  maxValue: BigNumberish
  tokenAddress: string
  action: (value: string) => Promise<ContractTransaction>
  onMined?: (r: ContractReceipt) => void
  onSend?: (t: ContractTransaction) => void
  onFail?: (error: unknown) => void
}

const BorrowToken = ({
  action,
  label = 'Borrow',
  maxValue,
  onFail,
  onMined,
  onSend,
  tokenAddress,
}: Props) => {
  const [value, setValue] = useState('0')
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || BigNumber.from(value || ZERO_BN).eq(ZERO_BN)

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={tokenInfo.decimals}
            maxValue={maxValue.toString()}
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
      <Button
        disabled={disableSubmit}
        onFail={(e) => onFail && onFail(e)}
        onMined={(r) => onMined && onMined(r)}
        onSend={(tx) => {
          tx && setValue('0')
          onSend && onSend(tx)
        }}
        tx={() => action(value)}
      >
        {label}
      </Button>
    </SimpleGrid>
  )
}

export default withGenericSuspense(BorrowToken)
