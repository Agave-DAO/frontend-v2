/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState } from 'react'
import styled, { css } from 'styled-components'

import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'

import TxButton from '@/src/components/buttons/txButton'
import { Formfield } from '@/src/components/form/Formfield'
import { Textfield as BaseTextfield, TextfieldStatus } from '@/src/components/form/Textfield'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput as BaseTokenInput } from '@/src/components/token/TokenInput'
import { ZERO_ADDRESS, ZERO_BN } from '@/src/constants/bigNumber'
import { useContractCall } from '@/src/hooks/useContractCall'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { ERC20, ERC20__factory } from '@/types/generated/typechain'

const CSSMaxWidth = css`
  min-width: 300px;
  max-width: 100%;
`

const TokenInput = styled(BaseTokenInput)`
  ${CSSMaxWidth}
`

const Textfield = styled(BaseTextfield)`
  ${CSSMaxWidth}
`

const Button = styled(TxButton)`
  margin-top: 22px;
`

const SendUSDCForm = () => {
  const { address } = useWeb3Connection()
  const [valueToSend, setValueToSend] = useState('0')
  const [addressToSend, setAddressToSend] = useState('')
  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()

  const erc20 = useContractInstance(ERC20__factory, 'USDC')

  const calls = [erc20.balanceOf, erc20.decimals] as const
  const [{ data }, refetch] = useContractCall<ERC20, typeof calls>(
    calls,
    [[address || ZERO_ADDRESS], []],
    'usdc-token-data',
  )

  const [usdcBalance, usdcDecimals] = data || [ZERO_BN, 18]

  const clearForm = () => {
    setValueToSend('')
    setAddressToSend('')
  }

  const invalidAddress = addressToSend && !isAddress(addressToSend)
  const disableSubmit =
    !addressToSend ||
    invalidAddress ||
    tokenInputStatus === TextfieldStatus.error ||
    BigNumber.from(valueToSend || ZERO_BN).eq(ZERO_BN)

  return (
    <SimpleGrid alignItems="flex-start">
      <Formfield
        formControl={
          <TokenInput
            balancePosition="topRight"
            decimals={usdcDecimals}
            maxValue={usdcBalance.toString()}
            setStatus={(status: TextfieldStatus | undefined) => setTokenInputStatus(status)}
            setStatusText={(statusText: string | undefined) => setTokenInputStatusText(statusText)}
            setValue={setValueToSend}
            symbol="USDC"
            value={valueToSend}
          />
        }
        label={'Send'}
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      <Formfield
        formControl={
          <Textfield
            onChange={(e) => setAddressToSend(e.target.value)}
            placeholder="ETH address..."
            value={addressToSend}
          />
        }
        label={'to'}
        status={invalidAddress ? TextfieldStatus.error : undefined}
        statusText={invalidAddress ? 'Invalid address' : undefined}
      />
      <Button
        disabled={disableSubmit}
        onMined={() => refetch()}
        onSend={(tx) => tx && clearForm()}
        tx={() => erc20.transfer(addressToSend, valueToSend)}
      >
        Send
      </Button>
    </SimpleGrid>
  )
}

export default withGenericSuspense(SendUSDCForm)
