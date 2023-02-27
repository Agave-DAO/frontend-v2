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
import { useRepayStepInitial } from '@/src/pagePartials/markets/repay/hooks/useRepayStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

interface InitialRepayStepInfoProps {
  maxToRepay: BigNumber
  tokenAddress: string
}

function InitialRepayStepInfo({ maxToRepay, tokenAddress }: InitialRepayStepInfoProps) {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  return (
    <SimpleGrid>
      <div>Available to repay</div>
      <div>
        <TokenIcon symbol={tokenInfo.symbol} />
        <Amount
          decimals={tokenInfo.decimals}
          displayDecimals={tokenInfo.decimals}
          symbol=""
          value={maxToRepay}
        />
      </div>
    </SimpleGrid>
  )
}

interface InitialRepayStepProps {
  amount: string
  nextStep: () => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export function InitialRepayStep({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}: InitialRepayStepProps) {
  const {
    disableSubmit,
    maxToRepay,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useRepayStepInitial({ amount, tokenAddress })

  const stepperProps = {
    info: <InitialRepayStepInfo maxToRepay={maxToRepay} tokenAddress={tokenAddress} />,
    title: 'Amount to repay',
    titleButton: (
      <ButtonPrimary onClick={() => setAmount(maxToRepay.toString())}>Use max</ButtonPrimary>
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
              maxValue={maxToRepay.toString()}
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
          Repay
        </ButtonPrimary>
      </Column>
    </Stepper>
  )
}
