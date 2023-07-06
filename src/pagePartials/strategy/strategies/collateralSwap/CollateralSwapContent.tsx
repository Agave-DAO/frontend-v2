import { FC, FormEvent } from 'react'
import styled from 'styled-components'

import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { hexZeroPad } from 'ethers/lib/utils'

import { useCollateralSwap } from './hooks/useCollateralSwap'
import { Swap } from '@/src/components/assets/Swap'
import { Button, ButtonWrapper, FormCard } from '@/src/components/card/FormCard'
import { FormStatus as BaseFormStatus } from '@/src/components/form/FormStatus'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { Spinner } from '@/src/components/loading/Spinner'
import { ONE_BN, ZERO_BN } from '@/src/constants/bigNumber'
import { Details } from '@/src/pagePartials/strategy/common/Details'
import { SwapButton } from '@/src/pagePartials/strategy/common/SwapButton'
import { StrategyContainer } from '@/src/pagePartials/strategy/strategies/StrategyContainer'
import {
  State,
  useCollateralSwapStore,
} from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { DestinationToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/DestinationToken'
import { OriginToken } from '@/src/pagePartials/strategy/strategies/collateralSwap/OriginToken'
import { PriceImpact } from '@/src/pagePartials/strategy/strategies/collateralSwap/PriceImpact'
import { setCowSwapOrder } from '@/src/pagePartials/strategy/strategies/collateralSwap/utils/setCowSwapOrder'
import { formatAmount, toWei } from '@/src/utils/common'
import { NumberType } from '@/src/utils/format'
import {
  BuyTokenDestination,
  OrderCreation,
  OrderKind,
  SellTokenSource,
  SigningScheme,
} from '@/types/generated/cowSwap/order-book'

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

function calculatePrice(state: State) {
  let price: BigNumber = ZERO_BN

  if (
    state.originToken &&
    state.destinationToken &&
    state.originAmount &&
    state.destinationAmount
  ) {
    const originAmount = FixedNumber.from(
      formatAmount(
        BigNumber.from(state.originAmount),
        state.originToken.decimals,
        '',
        'after',
        NumberType.SwapTradeAmount,
      ),
    )

    const destinationAmount = FixedNumber.from(
      formatAmount(
        BigNumber.from(state.destinationAmount),
        state.destinationToken.decimals,
        '',
        'after',
        NumberType.SwapTradeAmount,
      ),
    )

    if (!originAmount.isZero()) {
      price = BigNumber.from(
        toWei(
          destinationAmount
            .divUnsafe(originAmount)
            .round(state.destinationToken.decimals)
            .toString(),
          state.destinationToken.decimals,
        ),
      )
    }
  }

  return price
}

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
        localStorage.removeItem('orderUid')
        dispatch({ type: 'UPDATE_SUBMIT_STATUS', payload: { status: 'success' } })
      } catch (error: any) {
        dispatch({
          type: 'UPDATE_SUBMIT_STATUS',
          payload: { message: error?.message ?? 'Unknown', status: 'error' },
        })
        console.error('failed to add order', error)
      }
    }
  }

  const destinationPriceInWei = calculatePrice(state)

  const canSubmit =
    state.submit.status !== 'pending' ||
    state.originStatus === TextfieldStatus.error ||
    state.destinationStatus === TextfieldStatus.error ||
    state.originAmount === '0' ||
    state.destinationAmount === '0'

  return (
    <StrategyContainer strategy="collateral-swap">
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
                      <span
                        title={formatAmount(
                          destinationPriceInWei,
                          state.destinationToken.decimals,
                          state.destinationToken.symbol,
                          'after',
                          NumberType.SwapTradeAmount,
                        )}
                      >
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
                value: <PriceImpact />,
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
    </StrategyContainer>
  )
}
