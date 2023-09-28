import { useCallback } from 'react'

import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDaiAdapter__factory } from '@/types/generated/typechain'

export const useRedeemStepRedeem = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const agaveTokens = useAgaveTokens()
  const SavingsXDaiAdapter = useContractInstance(
    SavingsXDaiAdapter__factory,
    'SavingsXDaiAdapter',
    true,
  )
  const sendTx = useTransaction()
  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const [, refetchUserAccountData] = useGetUserAccountData(userAddress)

  const redeem = useCallback(async () => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    const tx = await sendTx(() => {
      if (tokenInfo.extensions.isNative) {
        return SavingsXDaiAdapter.redeemXDAI(amount, userAddress)
      }
      return SavingsXDaiAdapter.redeem(amount, userAddress)
    })
    const receipt = await tx.wait()
    refetchUserReservesData()
    refetchUserAccountData()
    return receipt.transactionHash
  }, [
    agaveTokens,
    tokenAddress,
    sendTx,
    refetchUserReservesData,
    refetchUserAccountData,
    SavingsXDaiAdapter,
    amount,
    userAddress,
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
