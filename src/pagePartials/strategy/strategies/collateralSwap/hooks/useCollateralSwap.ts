import { useCallback } from 'react'

import { isAddress } from '@ethersproject/address'

import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useGetQueryParam } from '@/src/hooks/useGetQueryParam'
import useTransaction from '@/src/hooks/useTransaction'
import { getOrderType } from '@/src/pagePartials/strategy/strategies/utils/getOrderType'
import { UID } from '@/types/generated/cowSwap/order-book'
import {
  Swapper_Helper,
  Swapper_Helper__factory,
  Swapper_UserProxyImplementation__factory,
} from '@/types/generated/typechain'

const useSetAgaveOrder = ({ vaultAddress }: { vaultAddress: string }) => {
  const sendTx = useTransaction()
  const vault = useContractInstance(Swapper_UserProxyImplementation__factory, vaultAddress, {
    useSigner: true,
  })
  const swapperHelper = useContractInstance(Swapper_Helper__factory, 'SwapperHelper')

  const addOrder = useCallback(
    async (swapWagTokenInfo: Swapper_Helper.SwapWagTokenInfoStruct, orderUid: UID) => {
      const data = await swapperHelper.swapWagTokenFromProxy(swapWagTokenInfo)

      if (data.orderUid !== orderUid) {
        throw new Error('Order UIDs do not match')
      }

      const tx = await sendTx(() =>
        vault.addOrder(
          data.order,
          data.orderUid,
          data.beforeTo,
          data.beforeData,
          data.afterTo,
          data.afterData,
          getOrderType('swap'),
        ),
      )

      return tx.wait() // receipt
    },
    [sendTx, swapperHelper, vault],
  )

  return { addOrder }
}

export const useCollateralSwap = () => {
  const vaultAddress = useGetQueryParam('vault')

  if (!vaultAddress || !isAddress(vaultAddress)) {
    throw new Error('No valid vault address provided')
  }

  const { addOrder } = useSetAgaveOrder({ vaultAddress })

  return {
    addOrder,
    data: {
      name: 'Collateral Swap',
      vaultAddress,
    },
  }
}
