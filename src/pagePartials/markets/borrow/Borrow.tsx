import { useState } from 'react'

import { BorrowStepper } from '@/src/pagePartials/markets/borrow/BorrowStepper'
import { InitialBorrowStep } from '@/src/pagePartials/markets/borrow/InitialBorrowStep'

export function Borrow({ tokenAddress }: { tokenAddress: string }) {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  return (
    <>
      {step === 'initial' && (
        <InitialBorrowStep
          amount={amount}
          nextStep={() => setStep('tx')}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <BorrowStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
