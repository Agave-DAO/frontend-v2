import { useState } from 'react'

import { InitialRepayStep } from '@/src/pagePartials/markets/repay/InitialRepayStep'
import { RepayStepper } from '@/src/pagePartials/markets/repay/RepayStepper'
import { Token } from '@/types/token'

export function Repay({
  onTokenSelect,
  tokenAddress,
}: {
  onTokenSelect: (token: Token) => void
  tokenAddress: string
}) {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  return (
    <>
      {step === 'initial' && (
        <InitialRepayStep
          amount={amount}
          nextStep={() => setStep('tx')}
          onTokenSelect={onTokenSelect}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <RepayStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
