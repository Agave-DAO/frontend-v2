import { FormEvent, useCallback } from 'react'
import styled from 'styled-components'

import { hexValue, hexZeroPad } from 'ethers/lib/utils'

import { useCollateralSwap } from './hooks/useCollateralSwap'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import useTransaction from '@/src/hooks/useTransaction'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { DestinationToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/DestinationToken'
import { OriginToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/OriginToken'
import {
  BuyTokenDestination,
  OrderCreation,
  OrderKind,
  SellTokenSource,
  SigningScheme,
  UID,
} from '@/types/generated/cowSwap/order-book'
import {
  Swapper_Helper,
  Swapper_Helper__factory,
  Swapper_UserProxyImplementation__factory,
} from '@/types/generated/typechain'

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

export function CollateralSwapContent() {
  const { dispatch, state } = useCollateralSwapStore()
  const { addOrder } = useSetAgaveOrder()
  const {
    data: { vaultAddress },
  } = useCollateralSwap()

  function handleSwitchTokens() {
    dispatch({ type: 'SWITCH_TOKENS' })
  }

  async function handleSwapRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (
      state.originToken &&
      state.destinationToken &&
      state.originAmount &&
      state.destinationAmount
    ) {
      const wagTokenIn = state.originToken.extensions.protocolTokens?.wag
      const wagTokenOut = state.destinationToken.extensions.protocolTokens?.wag

      if (!wagTokenIn || !wagTokenOut) {
        throw new Error('WAG token not found')
      }

      const validTo = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7

      const params: OrderCreation = {
        sellToken: wagTokenIn,
        buyToken: wagTokenOut,
        receiver: vaultAddress,
        sellAmount: state.originAmount,
        buyAmount: state.destinationAmount,
        validTo,
        appData: hexZeroPad('0x0', 32),
        feeAmount: '0',
        kind: OrderKind.SELL,
        partiallyFillable: false,
        sellTokenBalance: SellTokenSource.ERC20,
        buyTokenBalance: BuyTokenDestination.ERC20,
        signingScheme: SigningScheme.PRESIGN,
        signature: '0x',
        from: vaultAddress,
      }

      const swapWagTokenInfo = {
        userProxy: vaultAddress,
        WagTokenIn: wagTokenIn,
        WagTokenOut: wagTokenOut,
        amountIn: state.originAmount,
        amountOut: state.destinationAmount,
        validTo,
      }

      const orderUid = await setCowSwapOrder(params)
      localStorage.setItem('orderUid', orderUid)

      // TODO: remove before commit
      {
        console.log('params', params)
        console.log('swapWagTokenInfo', swapWagTokenInfo)
        console.log('orderUid', orderUid)
      }

      try {
        const receipt = await addOrder(swapWagTokenInfo, orderUid)
        console.log('receipt', receipt)
      } catch (error) {
        console.log('failed to add order', error)
      }
    }
  }

  return (
    <form onSubmit={handleSwapRequest}>
      <FormCard>
        <OriginToken />
        <Buttons>
          <Button
            disabled={!state.originToken || !state.destinationToken}
            onClick={handleSwitchTokens}
          >
            Switch tokens
          </Button>
        </Buttons>
        <DestinationToken />
        <Buttons>
          <Button type="submit">Swap</Button>
        </Buttons>
      </FormCard>
    </form>
  )
}

/**
 * This function will:
 * 1. POST the payload JSON `params` to https://api.cow.fi/xdai/api/v1/orders
 * 2. The response will be a string with the orderUid
 * 3. Store the orderUid in localStorage
 * 4. Return the orderUid
 * @param params - the payload JSON to send to the CowSwap API
 * @returns the orderUid
 */
function setCowSwapOrder(params: OrderCreation): Promise<UID> {
  return fetch('https://api.cow.fi/xdai/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then((res) => res.json())
}

function useSetAgaveOrder() {
  const {
    data: { vaultAddress },
  } = useCollateralSwap()

  const sendTx = useTransaction()
  const vault = useContractInstance(Swapper_UserProxyImplementation__factory, vaultAddress)
  const swapperHelper = useContractInstance(Swapper_Helper__factory, 'SwapperHelper')

  const addOrder = useCallback(
    async (swapWagTokenInfo: Swapper_Helper.SwapWagTokenInfoStruct, orderUid: UID) => {
      const data = await swapperHelper.swapWagTokenFromProxy(swapWagTokenInfo)

      // TODO: remove before push
      {
        console.log('data', data)
        return
      }

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
