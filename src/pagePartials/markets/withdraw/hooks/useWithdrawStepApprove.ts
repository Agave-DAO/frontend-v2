import { useCallback } from 'react'

import { contracts } from '@/src/contracts/contracts'
import { useGetERC20Allowance } from '@/src/hooks/queries/useGetERC20Allowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { ERC20__factory } from '@/types/generated/typechain'

export const useWithdrawStepApprove = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const agaveTokens = useAgaveTokens()
  const tokenInfo = agaveTokens.getTokenByAddress(tokenAddress)
  const agTokenInfo = agaveTokens.getProtocolTokenInfo(agaveTokens.wrapperToken.address, 'ag')
  const isNativeToken = tokenInfo.extensions.isNative

  const { appChainId } = useWeb3ConnectedApp()
  const agaveLendingAddress = contracts['AgaveLendingPool'].address[appChainId]
  const wrappedNativeGatewayAddress = contracts['WETHGateway'].address[appChainId]

  const params = {
    amount,
    spender: isNativeToken ? wrappedNativeGatewayAddress : agaveLendingAddress,
    asset: isNativeToken ? agTokenInfo.address : tokenAddress,
  }

  const erc20 = useContractInstance(ERC20__factory, params.asset, true)
  const sendTx = useTransaction()

  const { refetchAllowance: refetchTokenAllowance } = useGetERC20Allowance(
    tokenAddress,
    agaveLendingAddress,
  )

  const { refetchAllowance: refetchAGTokenAllowance } = useGetERC20Allowance(
    agTokenInfo.address,
    wrappedNativeGatewayAddress,
  )

  const approve = useCallback<() => Promise<string>>(async () => {
    const tx = await sendTx(() => erc20.approve(params.spender, params.amount))
    const receipt = await tx.wait()

    isNativeToken ? await refetchAGTokenAllowance() : await refetchTokenAllowance()

    return receipt.transactionHash
  }, [
    erc20,
    isNativeToken,
    params.amount,
    params.spender,
    refetchAGTokenAllowance,
    refetchTokenAllowance,
    sendTx,
  ])

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
