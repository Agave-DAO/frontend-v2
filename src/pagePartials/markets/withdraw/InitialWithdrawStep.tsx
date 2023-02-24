import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { Formfield } from '@/src/components/form/Formfield'
import { Amount } from '@/src/components/helpers/Amount'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { agaveTokens } from '@/src/config/agaveTokens'
import { Stepper } from '@/src/pagePartials/markets/stepper'
import { useWithdrawStepInitial } from '@/src/pagePartials/markets/withdraw/hooks/useWithdrawStepInitial'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

interface InitialWithdrawStepInfoProps {
  maxToWithdraw: BigNumber
  tokenAddress: string
}

function InitialWithdrawStepInfo({ maxToWithdraw, tokenAddress }: InitialWithdrawStepInfoProps) {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  return (
    <SimpleGrid>
      <div>Available to withdraw</div>
      <div>
        <TokenIcon symbol={tokenInfo.symbol} />
        <Amount
          decimals={tokenInfo.decimals}
          displayDecimals={tokenInfo.decimals}
          symbol=""
          value={maxToWithdraw}
        />
      </div>
    </SimpleGrid>
  )
}

interface InitialWithdrawStepProps {
  amount: string
  nextStep: () => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export function InitialWithdrawStep({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}: InitialWithdrawStepProps) {
  const {
    disableSubmit,
    maxToWithdraw,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useWithdrawStepInitial({ amount, tokenAddress })

  const stepperProps = {
    info: <InitialWithdrawStepInfo maxToWithdraw={maxToWithdraw} tokenAddress={tokenAddress} />,
    title: 'Amount to withdraw',
    titleButton: (
      <ButtonPrimary onClick={() => setAmount(maxToWithdraw.toString())}>Use max</ButtonPrimary>
    ),
  }

  return (
    <Stepper {...stepperProps}>
      <Column data-id="action">
        <Formfield
          formControl={
            <TokenInput
              balancePosition="none"
              decimals={tokenInfo.decimals}
              displayMaxButton={false}
              maxValue={maxToWithdraw.toString()}
              setStatus={setTokenInputStatus}
              setStatusText={setTokenInputStatusText}
              setValue={setAmount}
              symbol={tokenInfo.symbol}
              value={amount}
            />
          }
          status={tokenInputStatus}
          statusText={tokenInputStatusText}
        />
        <ButtonPrimary disabled={disableSubmit} onClick={nextStep}>
          Withdraw
        </ButtonPrimary>
      </Column>
    </Stepper>
  )
}
