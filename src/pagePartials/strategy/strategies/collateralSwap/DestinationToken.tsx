import { FC, createElement, useEffect, useState } from 'react'
import styled from 'styled-components'

import { Zero } from '@ethersproject/constants'

import { Rows as BaseRows, Row, RowKey, RowValue } from '@/src/components/card/FormCard'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { MAX_UINT_256 } from '@/src/constants/bigNumber'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

const Rows = styled(BaseRows)`
  margin-bottom: 8px;
`

const PriceObserver = () => {
  const { dispatch, state } = useCollateralSwapStore()
  const [{ data: destinationPriceInDAI }] = useGetAssetsPriceInDAI([
    state.destinationToken!.address,
  ])

  useEffect(() => {
    dispatch({
      type: 'UPDATE_DESTINATION_PRICE_IN_DAI',
      payload: destinationPriceInDAI?.[0][0] ?? Zero,
    })
  }, [dispatch, destinationPriceInDAI])

  return null
}

export const DestinationToken: FC = () => {
  const {
    computed: { destinationSuggestedAmountInWei },
    dispatch,
    state,
  } = useCollateralSwapStore()
  const [status, setStatus] = useState<TextfieldStatus>()
  const [statusText, setStatusText] = useState<string | undefined>()

  const handleSelectDestinationToken = (token: Token | null) =>
    dispatch({
      type: 'SELECT_DESTINATION_TOKEN',
      payload: token,
    })

  const handleUpdateDestinationAmount = (amount: string) =>
    dispatch({
      type: 'UPDATE_DESTINATION_AMOUNT',
      payload: amount,
    })

  return (
    <>
      <Rows>
        {state.destinationToken && (
          <SafeSuspense fallback={createElement(() => null)}>
            <PriceObserver />
          </SafeSuspense>
        )}
        <Row>
          <RowKey>Balance</RowKey>
          <RowValue
            onClick={() =>
              handleUpdateDestinationAmount(destinationSuggestedAmountInWei.toString())
            }
          >
            Estimated amount (
            <Amount
              decimals={state.destinationToken?.decimals}
              numberType={NumberType.SwapTradeAmount}
              symbol=""
              value={destinationSuggestedAmountInWei}
            />
            )
          </RowValue>
        </Row>
      </Rows>
      <TokenInputDropdown
        decimals={state.destinationToken?.decimals ?? 0}
        disabled={!state.destinationToken?.address}
        maxValue={MAX_UINT_256.toString()}
        onDropdownChange={handleSelectDestinationToken}
        selectedToken={state.destinationToken}
        setStatus={setStatus}
        setStatusText={setStatusText}
        setValue={handleUpdateDestinationAmount}
        status={status}
        statusText={statusText}
        usdPrice={state.destinationPriceInDAI}
        value={state.destinationAmount}
      />
    </>
  )
}
