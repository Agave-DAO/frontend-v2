import { useCallback } from 'react'

import { InterestRateMode } from '@/src/hooks/presentation/useUserBorrows'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory, WETHGateway__factory } from '@/types/generated/typechain'

export const useRepayStepRepay = ({
  amount,
  interestRateMode,
  tokenAddress,
}: {
  amount: string
  interestRateMode: InterestRateMode
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const nativeGateway = useContractInstance(WETHGateway__factory, 'WETHGateway', true)
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool', true)
  const sendTx = useTransaction()
  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const [, refetchUserAccountData] = useGetUserAccountData(userAddress)
  const agaveTokens = useAgaveTokens()

  const repay = useCallback(async () => {
    let tx

    if (agaveTokens.getTokenByAddress(tokenAddress).extensions.isNative) {
      tx = await sendTx(() =>
        nativeGateway.repayETH(amount, interestRateMode, userAddress, { value: amount }),
      )
    } else {
      tx = await sendTx(() =>
        agaveLending.repay(tokenAddress, amount, interestRateMode, userAddress),
      )
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
    amount,
    interestRateMode,
    userAddress,
    agaveLending,
  ])

  return useStepStates({
    title: 'Repay',
    description: 'Submit to repay',
    status: 'idle',
    actionText: 'Repay',
    async mainAction() {
      this.loading()

      try {
        const txHash = await repay()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
