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
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { useNewHealthFactorCalculator } from '@/src/hooks/presentation/useNewHealthFactor'
import { useBorrowStepInitial } from '@/src/pagePartials/markets/borrow/hooks/useBorrowStepInitial'
import { Stepper } from '@/src/pagePartials/markets/stepper'

const Column = styled(SimpleGrid)`
  flex-direction: column;
`

interface InitialBorrowStepInfoProps {
  maxToBorrow: BigNumber
  tokenAddress: string
}

function InitialBorrowStepInfo({ maxToBorrow, tokenAddress }: InitialBorrowStepInfoProps) {
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

  return (
    <SimpleGrid>
      <div>Available to borrow</div>
      <div>
        <TokenIcon symbol={tokenInfo.symbol} />
        <Amount
          decimals={tokenInfo.decimals}
          displayDecimals={tokenInfo.decimals}
          symbol=""
          value={maxToBorrow}
        />
      </div>
    </SimpleGrid>
  )
}

interface InitialBorrowStepProps {
  amount: string
  nextStep: () => void
  setAmount: Dispatch<SetStateAction<string>>
  tokenAddress: string
}

export function InitialBorrowStep({
  amount,
  nextStep,
  setAmount,
  tokenAddress,
}: InitialBorrowStepProps) {
  const {
    disableSubmit,
    maxToBorrow,
    setTokenInputStatus,
    setTokenInputStatusText,
    tokenInfo,
    tokenInputStatus,
    tokenInputStatusText,
  } = useBorrowStepInitial({ amount, tokenAddress })

  const stepperProps = {
    info: <InitialBorrowStepInfo maxToBorrow={maxToBorrow} tokenAddress={tokenAddress} />,
    title: 'Amount to borrow',
    titleButton: (
      <ButtonPrimary onClick={() => setAmount(maxToBorrow.toString())}>Use max</ButtonPrimary>
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
              maxValue={maxToBorrow.toString()}
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
          Borrow
        </ButtonPrimary>
      </Column>
    </Stepper>
  )
}
