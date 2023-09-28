import { useEffect, useState } from 'react'

import { InitialRedeemStep } from '@/src/pagePartials/sdai/redeem/InitialRedeemStep'
import { RedeemStepper } from '@/src/pagePartials/sdai/redeem/RedeemStepper'
import { Token } from '@/types/token'

export const Redeem = ({
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
        <InitialRedeemStep
          amount={amount}
          nextStep={() => setStep('tx')}
          onTokenSelect={onTokenSelect}
          setAmount={setAmount}
          tokenAddress={tokenAddress}
        />
      )}
      {step === 'tx' && (
        <RedeemStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
