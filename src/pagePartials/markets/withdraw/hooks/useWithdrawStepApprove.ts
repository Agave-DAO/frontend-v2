import { useCallback, useEffect, useRef } from 'react'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory } from '@/types/generated/typechain'

export const useWithdrawStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { unlimitedApproval } = useUserActionsContext()
  const unlimitedApprovalRef = useRef(unlimitedApproval)

  useEffect(() => {
    unlimitedApprovalRef.current = unlimitedApproval
  }, [unlimitedApproval])

  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const agTokenInfo = agaveTokens.getProtocolTokenInfo(agaveTokens.wrapperToken.address, 'ag')
  const isNativeToken = tokenInfo.extensions.isNative

  const { appChainId } = useWeb3ConnectedApp()
  const agaveLendingAddress = contracts['AgaveLendingPool'].address[appChainId]
  const wrappedNativeGatewayAddress = contracts['WETHGateway'].address[appChainId]

  const params = {
    spender: isNativeToken ? wrappedNativeGatewayAddress : agaveLendingAddress,
    asset: isNativeToken ? agTokenInfo.address : tokenAddress,
  }

  const erc20 = useContractInstance(ERC20__factory, params.asset, true)
  const sendTx = useTransaction()

  const { refetchAllowance: refetchTokenAllowance } = useGetERC20Allowance(
    params.asset,
    agaveLendingAddress,
  )

  const approve = useCallback<() => Promise<string>>(async () => {
    const approvalAmount = unlimitedApprovalRef.current
      ? '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
      : amount

    const tx = await sendTx(() => erc20.approve(params.spender, approvalAmount))
    const receipt = await tx.wait()

    await refetchTokenAllowance()

    return receipt.transactionHash
  }, [amount, erc20, params.spender, refetchTokenAllowance, sendTx])

  return useStepStates({
    title: 'Approve',
    description: 'Submit to approve',
    status: 'idle',
    actionText: 'Approve',
    async mainAction() {
      this.loading()

      try {
        const txHash = await approve()
        this.nextStep(txHash)
      } catch (e) {
        this.failed(e?.toString() ?? 'unknown error')
      }
    },
  } as StepWithActions)
}
