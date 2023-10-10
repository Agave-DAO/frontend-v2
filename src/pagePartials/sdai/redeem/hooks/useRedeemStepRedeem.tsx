import { useCallback } from 'react'

import { useGetERC4626MaxWithdraw } from '@/src/hooks/queries/useGetERC4626MaxWithdraw'
import { useGetBalance } from '@/src/hooks/queries/useGetSavingsUserData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { Token, addresses } from '@/src/pagePartials/sdai/DepositRedeem'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDaiAdapter__factory } from '@/types/generated/typechain'

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

  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const { refetch: refetchTargetBalance } = useGetBalance(userAddress, tokenAddress)
  const { refetchMaxWithdraw } = useGetERC4626MaxWithdraw(addresses.SDAI)
  const redeem = useCallback(
    async (selectedToken: Token) => {
      const tx = await sendTx(() => {
        if (selectedToken === 'XDAI') {
          return adapter.redeemXDAI(amount, userAddress)
        }
        return adapter.redeem(amount, userAddress)
      })
      const receipt = await tx.wait()
      refetchTargetBalance()
      refetchUserReservesData()
      refetchMaxWithdraw()
      return receipt.transactionHash
    },
    [
      adapter,
      amount,
      refetchUserReservesData,
      refetchTargetBalance,
      refetchMaxWithdraw,
      sendTx,
      userAddress,
    ],
  )

  return useStepStates({
    title: 'Redeem',
    description: 'Submit to redeem',
    status: 'idle',
    actionText: 'Redeem',
    async mainAction() {
      this.loading()

      try {
        const txHash = await redeem(selectedToken)
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
