import { EmphasizedRowValue, Row, RowKey, Rows } from '@/src/components/common/Rows'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokenIcon } from '@/src/components/token/TokenIcon'

export const VaultInfo: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const tokenSymbol = 'usdc'
    const tokenIcon = <TokenIcon dimensions={18} symbol={tokenSymbol} />

    return (
      <Rows {...restProps}>
        <Row variant="dark">
          <RowKey>Your vault balance</RowKey>
          <EmphasizedRowValue>
            {tokenIcon}
            1,000.00
          </EmphasizedRowValue>
        </Row>
        <Row>
          <RowKey>Value locked</RowKey>
          <EmphasizedRowValue>
            {tokenIcon}
            100.00
          </EmphasizedRowValue>
        </Row>
      </Rows>
    )
  },
  ({ ...restProps }) => <div {...restProps}>VaultInfo Loading...</div>,
)
