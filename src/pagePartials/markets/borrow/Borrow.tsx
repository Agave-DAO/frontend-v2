import { useEffect, useState } from 'react'

import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { BorrowStepper } from '@/src/pagePartials/markets/borrow/BorrowStepper'
import { InitialBorrowStep } from '@/src/pagePartials/markets/borrow/InitialBorrowStep'
import { Token } from '@/types/token'

export function Borrow({
  interestRateMode,
  onInterestRateSelect,
  onTokenSelect,
  tokenAddress,
}: {
  interestRateMode: InterestRateMode
  onInterestRateSelect: (mode: InterestRateMode) => void
  onTokenSelect: (token: Token) => void
  tokenAddress: string
}) {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  useEffect(() => {
    setStep('initial')
    setAmount('0')
  }, [tokenAddress])

  return (
    <>
      {step === 'initial' && (
        <InitialBorrowStep
          amount={amount}
          interestRateMode={interestRateMode}
          nextStep={() => setStep('tx')}
          onInterestRateSelect={onInterestRateSelect}
          onTokenSelect={onTokenSelect}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <BorrowStepper
          amount={amount}
          cancel={() => setStep('initial')}
          interestRateMode={interestRateMode}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
