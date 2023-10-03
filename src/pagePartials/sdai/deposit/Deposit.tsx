import { useState } from 'react'

import { DepositStepper } from '@/src/pagePartials/sdai/deposit/DepositStepper'
import { InitialDepositStep } from '@/src/pagePartials/sdai/deposit/InitialDepositStep'

export type Token = 'XDAI' | 'WXDAI'

const addresses = {
  // TODO
  WXDAI: '0x18c8a7ec7897177E4529065a7E7B0878358B3BfF',
  XDAI: '0x18c8a7ec7897177E4529065a7E7B0878358B3BfF',
}

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
