import { useEffect, useState } from 'react'

import { DepositStepper } from '@/src/pagePartials/markets/deposit/DepositStepper'
import { InitialDepositStep } from '@/src/pagePartials/markets/deposit/InitialDepositStep'
import { Token } from '@/types/token'

export const Deposit = ({
  onTokenSelect,
  tokenAddress,
}: {
  onTokenSelect: (token: Token) => void
  tokenAddress: string
}) => {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')

  useEffect(() => {
    setStep('initial')
    setAmount('0')
  }, [tokenAddress])

  return (
    <>
      {step === 'initial' && (
        <InitialDepositStep
          amount={amount}
          nextStep={() => setStep('tx')}
          onTokenSelect={onTokenSelect}
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
