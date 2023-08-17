import { useEffect, useState } from 'react'

import { InitialWithdrawStep } from '@/src/pagePartials/markets/withdraw/InitialWithdrawStep'
import { WithdrawStepper } from '@/src/pagePartials/markets/withdraw/WithdrawStepper'
import { Token } from '@/types/token'

export const Withdraw = ({
  onTokenSelect,
  tokenAddress,
}: {
  onTokenSelect: (token: Token) => void
  tokenAddress: string
}) => {
  const [amount, setAmount] = useState('0')
  const [step, setStep] = useState<'initial' | 'tx'>('initial')
  const [unlimitedApproval, setUnlimitedApproval] = useState(false)

  useEffect(() => {
    setStep('initial')
    setAmount('0')
  }, [tokenAddress])

  return (
    <>
      {step === 'initial' && (
        <InitialWithdrawStep
          amount={amount}
          nextStep={() => setStep('tx')}
          onTokenSelect={onTokenSelect}
          setAmount={setAmount}
          setUnlimitedApproval={setUnlimitedApproval}
          tokenAddress={tokenAddress}
          unlimitedApproval={unlimitedApproval}
        />
      )}
      {step === 'tx' && (
        <WithdrawStepper
          amount={amount}
          cancel={() => setStep('initial')}
          tokenAddress={tokenAddress}
          unlimitedApproval={unlimitedApproval}
        />
      )}
    </>
  )
}
