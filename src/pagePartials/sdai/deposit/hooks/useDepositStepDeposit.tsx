import { useCallback } from 'react'

import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { SavingsXDaiAdapter__factory } from '@/types/generated/typechain'

export const useDepositStepDeposit = ({
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

  const deposit = useCallback(async () => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
    const tx = await sendTx(() => {
      if (tokenInfo.extensions.isNative) {
        return SavingsXDaiAdapter.depositXDAI(userAddress, { value: amount })
      }
      return SavingsXDaiAdapter.deposit(amount, userAddress)
    })
    const receipt = await tx.wait()
    refetchUserReservesData()
    refetchUserAccountData()
    return receipt.transactionHash
  }, [
    agaveTokens,
    tokenAddress,
    refetchUserReservesData,
    refetchUserAccountData,
    sendTx,
    userAddress,
    amount,
    SavingsXDaiAdapter,
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
