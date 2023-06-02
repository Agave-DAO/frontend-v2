import { FC, FormEvent } from 'react'
import styled from 'styled-components'

import { FixedNumber } from '@ethersproject/bignumber'
import { hexZeroPad } from 'ethers/lib/utils'

import { useCollateralSwap } from './hooks/useCollateralSwap'
import { Swap } from '@/src/components/assets/Swap'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { FormStatus as BaseFormStatus } from '@/src/components/form/FormStatus'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { Spinner } from '@/src/components/loading/Spinner'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { ONE_BN } from '@/src/constants/bigNumber'
import { Details } from '@/src/pagePartials/strategy/common/Details'
import { StrategiesDropdown } from '@/src/pagePartials/strategy/common/StrategiesDropdown'
import { SwapButton } from '@/src/pagePartials/strategy/common/SwapButton'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { DestinationToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/DestinationToken'
import { OriginToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/OriginToken'
import { setCowSwapOrder } from '@/src/pagePartials/strategy/strategies/collateralSwap/utils/setCowSwapOrder'
import { toWei } from '@/src/utils/common'
import {
  BuyTokenDestination,
  OrderCreation,
  OrderKind,
  SellTokenSource,
  SigningScheme,
} from '@/types/generated/cowSwap/order-book'

const Title = styled(BaseTitle)`
  margin: 0 0 40px;
  text-transform: capitalize;
`

const Buttons = styled(ButtonWrapper)`
  padding-top: 8px;
`

const SwapSVG = styled(Swap)`
  path {
    fill: ${({ theme: { colors } }) => colors.darkerGray};
  }
`

const FormStatus = styled(BaseFormStatus)`
  margin: var(--padding-md);
  white-space: break-spaces;
  font-size: var(--font-size-lg);
`

type OrderCreationFixedValues = Pick<
  OrderCreation,
  | 'appData'
  | 'feeAmount'
  | 'kind'
  | 'partiallyFillable'
  | 'sellTokenBalance'
  | 'buyTokenBalance'
  | 'signingScheme'
  | 'signature'
>

const orderCreationFixedValues: OrderCreationFixedValues = {
  appData: hexZeroPad('0x0', 32),
  feeAmount: '0',
  kind: OrderKind.SELL,
  partiallyFillable: false,
  sellTokenBalance: SellTokenSource.ERC20,
  buyTokenBalance: BuyTokenDestination.ERC20,
  signingScheme: SigningScheme.PRESIGN,
  signature: '0x',
} as const

export const CollateralSwapContent: FC = ({ ...restProps }) => {
  const { dispatch, state } = useCollateralSwapStore()
  const {
    addOrder,
    data: { vaultAddress },
  } = useCollateralSwap()

  const handleSwitchTokens = () => dispatch({ type: 'SWITCH_TOKENS' })

  const handleSwapRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    dispatch({ type: 'UPDATE_SUBMIT_STATUS', payload: { status: 'pending' } })

    if (
      state.originToken &&
      state.destinationToken &&
      state.originAmount &&
      state.destinationAmount
    ) {
      const wagTokenIn = state.originToken.extensions.protocolTokens?.wag
      const wagTokenOut = state.destinationToken.extensions.protocolTokens?.wag

      if (!wagTokenIn || !wagTokenOut) {
        dispatch({
          type: 'UPDATE_SUBMIT_STATUS',
          payload: {
            message: 'WAG token not found',
            status: 'error',
          },
        })
        throw new Error('WAG token not found')
      }

      // hardcoded to 7 days from the moment of creation
      const validTo = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7

      const params: OrderCreation = {
        sellToken: wagTokenIn,
        buyToken: wagTokenOut,
        receiver: vaultAddress,
        sellAmount: state.originAmount,
        buyAmount: state.destinationAmount,
        validTo,
        ...orderCreationFixedValues,
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

      try {
        const orderUid = await setCowSwapOrder(params)
        // TODO: use it to recover from a potential failure
        localStorage.setItem('orderUid', orderUid)

        await addOrder(swapWagTokenInfo, orderUid)
      } catch (error: any) {
        dispatch({
          type: 'UPDATE_SUBMIT_STATUS',
          payload: { message: error?.message ?? 'Unknown', status: 'error' },
        })
        console.error('failed to add order', error)
      }
    }
  }

  const destinationPrice = FixedNumber.fromValue(state.originPriceInDAI)
    .divUnsafe(
      FixedNumber.fromValue(
        state.destinationPriceInDAI.isZero() ? ONE_BN : state.destinationPriceInDAI,
      ),
    )
    .round(state.destinationToken?.decimals || 0)
    .toString()

  const destinationPriceInWei = toWei(destinationPrice, state.destinationToken?.decimals ?? 0)

  const canSubmit =
    state.submit.status === 'pending' ||
    state.originStatus === TextfieldStatus.error ||
    state.destinationStatus === TextfieldStatus.error ||
    state.originAmount === '0' ||
    state.destinationAmount === '0'

  return (
    <>
      <Title>Strategies</Title>
      <StrategiesDropdown
        onChange={console.log.bind(console, 'Strategy changed:')}
        strategy={'collateralSwap'}
      />
      <form onSubmit={handleSwapRequest}>
        <FormCard {...restProps}>
          <OriginToken />
          <SwapButton
            disabled={!state.originToken || !state.destinationToken}
            onClick={handleSwitchTokens}
          />
          <DestinationToken />
          <Details
            data={[
              {
                key: 'Ref. price',
                value: (
                  <>
                    {state.originToken ? (
                      <Amount
                        decimals={0}
                        symbol={state.originToken.symbol}
                        symbolPosition="after"
                        value={ONE_BN}
                      />
                    ) : (
                      0
                    )}{' '}
                    ={' '}
                    {state.destinationToken ? (
                      <span title={`${destinationPrice} ${state.destinationToken.symbol}`}>
                        <Amount
                          decimals={state.destinationToken.decimals}
                          symbol={state.destinationToken.symbol}
                          symbolPosition="after"
                          value={destinationPriceInWei}
                        />
                      </span>
                    ) : (
                      0
                    )}{' '}
                    <SwapSVG />
                  </>
                ),
              },
              {
                key: 'Price Impact',
                value: '-1.23%',
              },
              {
                key: 'Network Fee',
                value: '0.30%',
              },
            ]}
          />
          <Buttons>
            <Button disabled={!canSubmit} type="submit">
              {state.submit.status === 'pending' ? <Spinner /> : 'Swap'}
            </Button>
          </Buttons>
          {state.submit.status === 'error' && (
            <FormStatus status={TextfieldStatus.error}>{state.submit.message}</FormStatus>
          )}
        </FormCard>
      </form>
    </>
  )
}
