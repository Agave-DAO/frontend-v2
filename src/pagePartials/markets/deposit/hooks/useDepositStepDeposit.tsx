import { useCallback } from 'react'

import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

export const useDepositStepDeposit = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const sendTx = useTransaction()
  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const [, refetchUserAccountData] = useGetUserAccountData(userAddress)

  const deposit = useCallback(async () => {
    const tx = await sendTx(() => agaveLending.deposit(tokenAddress, amount, userAddress, 0))
    const receipt = await tx.wait()
    refetchUserReservesData()
    refetchUserAccountData()
    return receipt.transactionHash
  }, [
    sendTx,
    refetchUserReservesData,
    refetchUserAccountData,
    agaveLending,
    tokenAddress,
    amount,
    userAddress,
  ])

  return useStepStates({
    title: 'Deposit',
    description: 'Submit to deposit',
    status: 'idle',
    actionText: 'Deposit',
    async mainAction() {
      this.loading()

      try {
        const txHash = await deposit()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
