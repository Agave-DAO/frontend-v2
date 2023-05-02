import { Fragment } from 'react'

import { LegendColor } from '@/src/components/common/LegendColor'
import { MiniChart } from '@/src/components/common/MiniChart'
import {
  CollapsableRow,
  CollapsableRowValue,
  CollapsableRowsHandler,
  CollapsableRowsInner,
  RowKey,
  RowValueBig,
  RowVariant,
} from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { chartColors } from '@/src/constants/common'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { toNumber } from '@/src/utils/common'

export const CollateralInfo: React.FC<{ variant?: RowVariant }> = ({ variant, ...restProps }) => {
  const { address } = useWeb3ConnectedApp()
  const depositsAsCollateral = useUserDeposits().filter((deposit) => deposit.asCollateral)
  const totalCollateral = useUserAccountDetails(address)?.userCollateral || ZERO_BN
  const agaveTokens = useAgaveTokens()

  return (
    <CollapsableRowsHandler
      toggle={
        <>
          <RowKey>Your collateral</RowKey>
          <RowValueBig>
            <Amount value={totalCollateral} />
          </RowValueBig>
        </>
      }
      variant={variant}
      {...restProps}
    >
      <CollapsableRow>
        <MiniChart
          data={depositsAsCollateral.map((deposit) => ({
            value: toNumber(deposit.depositedAmountInDAI, 18),
          }))}
        />
        <CollapsableRowsInner>
          {depositsAsCollateral.map((deposit, index) => {
            const token = agaveTokens.getTokenByAddress(deposit.assetAddress)

            return (
              <Fragment key={deposit.assetAddress}>
                <CollapsableRow style={{ columnGap: '30px' }}>
                  <CollapsableRowValue style={{ marginLeft: 0 }}>
                    <LegendColor color={chartColors[index % chartColors.length]} />
                    <span>{token.symbol}</span>
                  </CollapsableRowValue>
                  <CollapsableRowValue style={{ marginLeft: 0 }}>
                    <Amount decimals={token.decimals} symbol="" value={deposit.depositedAmount} />
                    &nbsp; (<Amount value={deposit.depositedAmountInDAI} />)
                    <TokenIcon dimensions={18} symbol={token.symbol} />
                  </CollapsableRowValue>
                </CollapsableRow>
              </Fragment>
            )
          })}
        </CollapsableRowsInner>
      </CollapsableRow>
    </CollapsableRowsHandler>
  )
}
