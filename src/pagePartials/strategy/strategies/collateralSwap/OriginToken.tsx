import { FC, createElement, useEffect } from 'react'
import styled from 'styled-components'

import { Rows as BaseRows, Row, RowKey, RowValue } from '@/src/components/card/FormCard'
import { TitleWithAction } from '@/src/components/common/TitleWithAction'
import { DropdownDirection } from '@/src/components/dropdown/Dropdown'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInputDropdown } from '@/src/components/token/TokenInputDropdown'
import { ZERO_BN } from '@/src/constants/bigNumber'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import { useAccountBalance } from '@/src/hooks/useAccountBalance'
import { useCollateralSwapStore } from '@/src/pagePartials/strategy/strategies/collateralSwap/CollateralSwapStore'
import { useCollateralSwap } from '@/src/pagePartials/strategy/strategies/collateralSwap/hooks/useCollateralSwap'
import { NumberType } from '@/src/utils/format'
import { Token } from '@/types/token'

const Rows = styled(BaseRows)`
  margin-bottom: 8px;
`

const PriceObserver = () => {
  const { dispatch, state } = useCollateralSwapStore()
  const [{ data: originPriceInDAI }] = useGetAssetsPriceInDAI([state.originToken!.address])

  useEffect(() => {
    dispatch({ type: 'UPDATE_ORIGIN_PRICE_IN_DAI', payload: originPriceInDAI?.[0][0] ?? ZERO_BN })
  }, [dispatch, originPriceInDAI])

  return null
}

const BalanceObserver = () => {
  const { dispatch, state } = useCollateralSwapStore()
  const {
    data: { vaultAddress },
  } = useCollateralSwap()
  const { balance } = useAccountBalance({
    accountAddress: vaultAddress,
    tokenAddress: state.originToken!.extensions.protocolTokens!.ag,
  })

  useEffect(() => {
    dispatch({ type: 'UPDATE_ORIGIN_BALANCE', payload: balance })
  }, [balance, dispatch])

  return null
}

export const OriginToken: FC = () => {
  const { dispatch, state } = useCollateralSwapStore()

  const handleSelectOriginToken = (token: Token | null) =>
    dispatch({ type: 'SELECT_ORIGIN_TOKEN', payload: token })

  const handleUpdateOriginAmount = (amount: string) =>
    dispatch({ type: 'UPDATE_ORIGIN_AMOUNT', payload: amount })

  const handleSetStatus = (status?: TextfieldStatus) =>
    dispatch({ type: 'UPDATE_ORIGIN_STATUS', payload: status })

  const handleSetStatusText = (statusText?: string) =>
    dispatch({ type: 'UPDATE_ORIGIN_STATUS_TEXT', payload: statusText })

  return (
    <>
      {state.originToken && (
        <SafeSuspense fallback={createElement(() => null)}>
          <BalanceObserver />
          <PriceObserver />
        </SafeSuspense>
      )}
      <TitleWithAction
        button={{
          disabled: !state.originToken,
          onClick: () => handleUpdateOriginAmount(state.originBalance.toString() ?? ''),
          text: 'Use max',
        }}
        title="Swap"
      />
      <Rows>
        <Row>
          <RowKey>Balance</RowKey>
          <RowValue>
            {<TokenIcon symbol={state.originToken?.symbol ?? ''} />}
            <Amount
              decimals={state.originToken?.decimals ?? 0}
              numberType={NumberType.NFTCollectionStats}
              symbol=""
              value={state.originBalance}
            />
          </RowValue>
        </Row>
      </Rows>
      <TokenInputDropdown
        decimals={state.originToken?.decimals ?? 0}
        disabled={!state.originToken?.address}
        dropdownDirection={DropdownDirection.downwards}
        maxValue={state.originBalance.toString()}
        onDropdownChange={handleSelectOriginToken}
        selectedToken={state.originToken}
        setStatus={handleSetStatus}
        setStatusText={handleSetStatusText}
        setValue={handleUpdateOriginAmount}
        status={state.originStatus}
        statusText={state.originStatusText}
        usdPrice={state.originPriceInDAI}
        value={state.originAmount}
      />
    </>
  )
}
