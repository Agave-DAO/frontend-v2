import { useEffect, useState } from 'react'

import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import { InitialRepayStep } from '@/src/pagePartials/markets/repay/InitialRepayStep'
import { RepayStepper } from '@/src/pagePartials/markets/repay/RepayStepper'
import { Token } from '@/types/token'

export function Repay({
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
        <InitialRepayStep
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
        <RepayStepper
          amount={amount}
          cancel={() => setStep('initial')}
          interestRateMode={interestRateMode}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
