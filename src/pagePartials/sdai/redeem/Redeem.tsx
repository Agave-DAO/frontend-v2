import { useState } from 'react'

import { Token, addresses } from '@/src/pagePartials/sdai/DepositRedeem'
import { InitialRedeemStep } from '@/src/pagePartials/sdai/redeem/InitialRedeemStep'
import { RedeemStepper } from '@/src/pagePartials/sdai/redeem/RedeemStepper'

export const Redeem = () => {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')
  const [selectedToken, setSelectedToken] = useState<Token>('WXDAI')
  const tokenAddress = addresses.SDAI

  const onTokenSelect = (symbol: Token) => {
    setSelectedToken(symbol)
  }

  const resetView = () => {
    setStep('initial')
    setAmount('0')
  }

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
          cancel={resetView}
          selectedToken={selectedToken}
          tokenAddress={tokenAddress}
        />
      )}
    </>
  )
}
