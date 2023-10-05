import { useState } from 'react'

import { Token, addresses } from '@/src/pagePartials/sdai/DepositRedeem'
import { DepositStepper } from '@/src/pagePartials/sdai/deposit/DepositStepper'
import { InitialDepositStep } from '@/src/pagePartials/sdai/deposit/InitialDepositStep'

export const Deposit = () => {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')
  const [tokenAddress, setTokenAddress] = useState(addresses.WXDAI)

  const onTokenSelect = (symbol: Token) => {
    setTokenAddress(addresses[symbol])
  }

  const resetView = () => {
    setStep('initial')
    setAmount('0')
  }

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
        <DepositStepper amount={amount} cancel={resetView} tokenAddress={tokenAddress} />
      )}
    </>
  )
}
