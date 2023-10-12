import { useCallback } from 'react'

import { useGetERC4626MaxWithdraw } from '@/src/hooks/queries/useGetERC4626MaxWithdraw'
import { useGetBalance } from '@/src/hooks/queries/useGetSavingsUserData'
import { useGetUserReservesData } from '@/src/hooks/queries/useGetUserReservesData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { addresses } from '@/src/pagePartials/sdai/DepositRedeem'
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
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const adapter = useContractInstance(SavingsXDaiAdapter__factory, 'SavingsXDaiAdapter', true)

  const sendTx = useTransaction()

  const { mutate: refetchUserReservesData } = useGetUserReservesData()

  const { refetch: refetchTargetBalance } = useGetBalance(userAddress, addresses.SDAI)
  const { refetchMaxWithdraw } = useGetERC4626MaxWithdraw(addresses.SDAI)

  const deposit = useCallback(async () => {
    const tx = await sendTx(() => {
      if (tokenInfo.symbol == 'XDAI') {
        return adapter.depositXDAI(userAddress, { value: amount })
      }
      return adapter.deposit(amount, userAddress)
    })
    const receipt = await tx.wait()
    refetchMaxWithdraw()

    refetchTargetBalance()
    refetchUserReservesData()
    return receipt.transactionHash
  }, [
    adapter,
    amount,
    refetchMaxWithdraw,
    refetchTargetBalance,
    refetchUserReservesData,
    sendTx,
    tokenInfo,
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
