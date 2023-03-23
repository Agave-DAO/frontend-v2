import { useState } from 'react'

import { InitialWithdrawStep } from '@/src/pagePartials/markets/withdraw/InitialWithdrawStep'
import { WithdrawStepper } from '@/src/pagePartials/markets/withdraw/WithdrawStepper'

export const Withdraw = ({ tokenAddress }: { tokenAddress: string }) => {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  return (
    <>
      {step === 'initial' && (
        <InitialWithdrawStep
          amount={amount}
          nextStep={() => setStep('tx')}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <WithdrawStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
