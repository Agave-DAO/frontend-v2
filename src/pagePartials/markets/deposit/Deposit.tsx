import { useState } from 'react'

import { DepositStepper } from '@/src/pagePartials/markets/deposit/DepositStepper'
import { InitialDepositStep } from '@/src/pagePartials/markets/deposit/InitialDepositStep'

export function Deposit({ tokenAddress }: { tokenAddress: string }) {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  return (
    <>
      {step === 'initial' && (
        <InitialDepositStep
          amount={amount}
          nextStep={() => setStep('tx')}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <DepositStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
