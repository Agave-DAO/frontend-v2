import { useCallback } from 'react'

import { agaveTokens } from '@/src/config/agaveTokens'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
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
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const WXDAIGateway = useContractInstance(WETHGateway__factory, 'WETHGateway')
  const sendTx = useTransaction()

  const withdraw = useCallback(async () => {
    const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)

    const tx = await sendTx(() => {
      if (tokenInfo.symbol === 'XDAI') {
        return WXDAIGateway.withdrawETH(amount, userAddress)
      }
      return agaveLending.withdraw(tokenAddress, amount, userAddress)
    })
    const receipt = await tx.wait()

    return receipt.transactionHash
  }, [tokenAddress, sendTx, agaveLending, amount, userAddress, WXDAIGateway])

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
