import { useCallback } from 'react'

import { useGetBalance } from '@/src/hooks/queries/useGetSavingsUserData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { Token, addresses } from '@/src/pagePartials/sdai/DepositRedeem'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDaiAdapter__factory, SavingsXDai__factory } from '@/types/generated/typechain'

export const useRedeemStepRedeem = ({
  amount,
  selectedToken,
  tokenAddress,
}: {
  amount: string
  selectedToken: Token
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const adapter = useContractInstance(SavingsXDaiAdapter__factory, 'SavingsXDaiAdapter', true)
  const sendTx = useTransaction()

  const { refetch: refetchSourceBalance } = useGetBalance(userAddress, tokenAddress)
  const { refetch: refetchTargetBalance } = useGetBalance(userAddress, addresses[selectedToken])

  const redeem = useCallback(async () => {
    const tx = await sendTx(() => {
      if (selectedToken == 'XDAI') {
        return adapter.redeemXDAI(amount, userAddress)
      }
      return adapter.redeem(amount, userAddress)
    })
    const receipt = await tx.wait()
    refetchTargetBalance()
    refetchSourceBalance()
    return receipt.transactionHash
  }, [
    refetchSourceBalance,
    refetchTargetBalance,
    sendTx,
    userAddress,
    amount,
    adapter,
    selectedToken,
  ])

  return useStepStates({
    title: 'Redeem',
    description: 'Submit to redeem',
    status: 'idle',
    actionText: 'Redeem',
    async mainAction() {
      this.loading()

      try {
        const txHash = await redeem()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
