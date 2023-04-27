import { useCallback } from 'react'

import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory, WETHGateway__factory } from '@/types/generated/typechain'

export const useWithdrawStepWithdraw = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { address: userAddress } = useWeb3ConnectedApp()
  const agaveTokens = useAgaveTokens()
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool', true)
  const WXDAIGateway = useContractInstance(WETHGateway__factory, 'WETHGateway', true)
  const sendTx = useTransaction()
  const { mutate: refetchUserReservesData } = useGetUserReservesData()
  const [, refetchUserAccountData] = useGetUserAccountData(userAddress)

  const withdraw = useCallback(async () => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    const tx = await sendTx(() => {
      if (tokenInfo.symbol === 'XDAI') {
        return WXDAIGateway.withdrawETH(amount, userAddress)
      }
      return agaveLending.withdraw(tokenAddress, amount, userAddress)
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
    agaveLending,
    amount,
    userAddress,
    WXDAIGateway,
  ])

  return useStepStates({
    title: 'Withdraw',
    description: 'Submit to withdraw',
    status: 'idle',
    actionText: 'Withdraw',
    async mainAction() {
      this.loading()

      try {
        const txHash = await withdraw()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
