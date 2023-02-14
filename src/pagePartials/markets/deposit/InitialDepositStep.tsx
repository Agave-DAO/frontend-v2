import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { Formfield } from '@/src/components/form/Formfield'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenInput } from '@/src/components/token/TokenInput'
import { useDepositStepInitial } from '@/src/pagePartials/markets/deposit/hooks/useDepositStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

const InitialDepositStepInfo = () => {
  return (
    <div data-id="summary">
      <i>Need to bridge assets to gnosis from other chains? Please visit </i>
      <a href="https://li.fi">li.fi</a>
    </div>
  )
}

interface InitialDepositStepProps {
  nextStep: () => void
  tokenAddress: string
  amount: string
  setAmount: Dispatch<SetStateAction<string>>
}

export function InitialDepositStep({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}: InitialDepositStepProps) {
  const {
    balance,
    disableSubmit,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useDepositStepInitial({ amount, tokenAddress })

  const wizardProps = {
    info: <InitialDepositStepInfo />,
    title: 'Amount to deposit',
    titleButton: (
      <ButtonPrimary onClick={() => setAmount(balance.toString())}>Use max</ButtonPrimary>
    ),
  }

  return (
    <Stepper {...wizardProps}>
      <Column data-id="action">
        <Formfield
          formControl={
            <TokenInput
              balancePosition="none"
              decimals={tokenInfo.decimals}
              displayMaxButton={false}
              maxValue={balance.toString()}
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
          Deposit
        </ButtonPrimary>
      </Column>
    </Stepper>
  )
}
