import { useCallback } from 'react'

import { contracts } from '@/src/contracts/contracts'
import { useGetVariableDebtBorrowAllowance } from '@/src/hooks/queries/useGetVariableDebtBorrowAllowance'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { StepWithActions, useStepStates } from '@/src/pagePartials/markets/stepper'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { VariableDebtToken__factory } from '@/types/generated/typechain'

export const useBorrowStepDelegate = ({
  amount,
  tokenAddress,
}: {
  amount: string
  tokenAddress: string
}) => {
  const { appChainId } = useWeb3ConnectedApp()
  const agaveTokens = useAgaveTokens()
  const wrappedNativeGatewayAddress = contracts['WETHGateway'].address[appChainId]
  const variableDebtTokenAddress = agaveTokens.getProtocolTokenInfo(
    agaveTokens.wrapperToken.address,
    'variableDebt',
  ).address

  const params = {
    amount,
    spender: wrappedNativeGatewayAddress,
    asset: variableDebtTokenAddress,
  }

  const variableDebtToken = useContractInstance(VariableDebtToken__factory, params.asset, true)
  const sendTx = useTransaction()

  const { refetchAllowance } = useGetVariableDebtBorrowAllowance(params.asset, params.spender)

  const approve = useCallback<() => Promise<string>>(async () => {
    const tx = await sendTx(() =>
      variableDebtToken.approveDelegation(params.spender, params.amount),
    )
    const receipt = await tx.wait()

    await refetchAllowance()

    return receipt.transactionHash
  }, [params.amount, params.spender, refetchAllowance, sendTx, variableDebtToken])

  return useStepStates({
    title: 'Delegate',
    description: 'Submit to delegate approval to WXDAIGateway',
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
