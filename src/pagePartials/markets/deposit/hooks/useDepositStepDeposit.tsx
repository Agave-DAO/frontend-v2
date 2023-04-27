import { useCallback } from 'react'

import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory, WETHGateway__factory } from '@/types/generated/typechain'

export const useDepositStepDeposit = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const nativeGateway = useContractInstance(WETHGateway__factory, 'WETHGateway', true)
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool', true)
  const agaveTokens = useAgaveTokens()
  const sendTx = useTransaction()
  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const [, refetchUserAccountData] = useGetUserAccountData(userAddress)

  const deposit = useCallback(async () => {
    let tx

    if (agaveTokens.getTokenByAddress(tokenAddress).extensions.isNative) {
      tx = await sendTx(() => nativeGateway.depositETH(userAddress, 0, { value: amount }))
    } else {
      tx = await sendTx(() => agaveLending.deposit(tokenAddress, amount, userAddress, 0))
    }

    const receipt = await tx.wait()
    await refetchUserReservesData()
    await refetchUserAccountData()
    return receipt.transactionHash
  }, [
    agaveTokens,
    tokenAddress,
    refetchUserReservesData,
    refetchUserAccountData,
    sendTx,
    nativeGateway,
    userAddress,
    amount,
    agaveLending,
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
