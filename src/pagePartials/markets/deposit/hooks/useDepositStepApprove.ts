import { useCallback } from 'react'

import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { AgaveLending__factory, ERC20__factory } from '@/types/generated/typechain'

export const useDepositStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const agaveLending = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const isNativeToken = tokenInfo.extensions.isNative
  const asset = isNativeToken ? agaveTokens.wrapperToken.address : tokenAddress
  const erc20 = useContractInstance(ERC20__factory, asset, true)
  const sendTx = useTransaction()
  const { refetchAllowance } = useGetERC20Allowance(asset, agaveLending.address)

  const approve = useCallback(async () => {
    const tx = await sendTx(() => erc20.approve(agaveLending.address, amount))
    const receipt = await tx.wait()
    await refetchAllowance()
    return receipt.transactionHash
  }, [sendTx, refetchAllowance, erc20, agaveLending.address, amount])

  return useStepStates({
    title: 'Approve',
    description: 'Approve to delegate',
    status: 'active',
    actionText: 'Approve',
    async mainAction() {
      this.loading()
      try {
        const txHash = await approve()
        this.nextStep(txHash)
      } catch (e) {
        this.failed()
      }
    },
  } as StepWithActions)
}
