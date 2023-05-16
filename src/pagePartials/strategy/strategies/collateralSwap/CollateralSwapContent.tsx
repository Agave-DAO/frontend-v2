import { useCallback } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { hexValue, hexZeroPad } from 'ethers/lib/utils'

import { useCollateralSwap } from './hooks/useCollateralSwap'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { DestinationToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/DestinationToken'
import { OriginToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/OriginToken'
import {
  Swapper_Helper__factory,
  Swapper_UserProxyImplementation__factory,
} from '@/types/generated/typechain'

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

const ADDRESSES = {
  coordinator: '0xdD494510e56347058703c277Ef770D3D9099ca42',
  proxyImplementation: '0xea45ce264A5b2A2d2CC12Fd5a92D6c8b444d5636',
  proxyFactory: '0x19BFAF6c3c091aa145f7df7d7a687b2c1C1Abd10',
  proxyHelper: '0xb624888498c057b5398eF34898EfC3d0fBF89489',
  WagTokenFactory: '0x6C1878a83884B9F14a342C7D96Fc00C9a0D434d2',
  WagTokenImplementation: '0xFC4c44bb2fFf803B16d0B421BB9F08ed65B0D716',
  WagUSDC: '0x300ABE8f7924BEb7115093361C4A78b9d9327Fb0',
  WagWXDAI: '0xFF2A1866ecb13B67388C7a7DC1FdB3a5ff83Fb23',
  WagGNO: '0xb5c3B258e461F17084a70624C2Fb2544710523B9',
  WagBTC: '0x620eEa23606C3B3818419E37Dd6867e5aBF074CC',
  WagETH: '0xf710Ef31830EeF5C25D47ABa5f60A0fCC045bA28',
  WagUSDT: '0x991e64F303F4fFC38ABDc1bC93aB23FCF609c269',
  WagEURe: '0x4f74D565379DFc78F56855E60b40282222f2Ae69',
}

export function CollateralSwapContent() {
  const { dispatch, state } = useCollateralSwapStore()

  function handleSwitchTokens() {
    dispatch({ type: 'SWITCH_TOKENS' })
  }

  return (
    <FormCard>
      <OriginToken />
      <Button disabled={!state.originToken || !state.destinationToken} onClick={handleSwitchTokens}>
        Switch tokens
      </Button>
      <DestinationToken />
      <Buttons>
        <Button onClick={() => console.log('swap')}>Swap</Button>
      </Buttons>
    </FormCard>
  )
}

interface SwapWagTokenInfo {
  userProxy: string
  WagTokenIn: string
  WagTokenOut: string
  amountIn: BigNumber
  amountOut: BigNumber
  validTo: number
}

function useSetAgaveOrder() {
  const {
    data: { vaultAddress },
  } = useCollateralSwap()

  const sendTx = useTransaction()
  const vault = useContractInstance(Swapper_UserProxyImplementation__factory, vaultAddress)
  const swapperHelper = useContractInstance(Swapper_Helper__factory, ADDRESSES.proxyHelper)

  const addOrder = useCallback(
    async (swapWagTokenInfo: SwapWagTokenInfo) => {
      const data = await swapperHelper.swapWagTokenFromUser(swapWagTokenInfo)
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

      return await tx.wait() // receipt
    },
    [sendTx, swapperHelper, vault],
  )

  return { addOrder }
}

function getOrderType(orderType: 'swap' | 'long' | 'short') {
  let orderTypeNumber

  switch (orderType) {
    case 'swap': {
      orderTypeNumber = 0
      break
    }
    case 'long': {
      orderTypeNumber = 1
      break
    }
    case 'short': {
      orderTypeNumber = 2
      break
    }
    default: {
      throw new Error('Invalid order type')
    }
  }

  return hexZeroPad(hexValue(orderTypeNumber), 32) // orderTypeFlag
}
