import styled from 'styled-components'

import { EmphasizedRowValue, Row, RowKey, Rows } from '@/src/components/common/Rows'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { InnerTitle } from '@/src/components/text/InnerTitle'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useGetUserVaultBalances } from '@/src/hooks/queries/useGetUserVaultBalances'
import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Title = styled(InnerTitle)`
  margin-bottom: 12px;
`

export const VaultInfo: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { vaultAddress } = useVaultModalContext()
    const { vaultBalances } = useGetUserVaultBalances(vaultAddress)

    return (
      <Rows {...restProps}>
        <Title>Vault balance</Title>
        {vaultBalances?.length ? (
          vaultBalances.map(({ agToken, balanceInDai, balanceRaw, token }, index) => {
            // if index is multiple of 2, then it's a dark row
            const variant = index % 2 === 0 ? 'dark' : undefined

            return (
              <Row key={agToken.address} variant={variant}>
                <RowKey>
                  <TokenIcon dimensions={18} symbol={agToken.symbol} />
                  {agToken.symbol}
                </RowKey>
                <EmphasizedRowValue>
                  <Amount decimals={token.decimals} symbol="" value={balanceRaw} />
                </EmphasizedRowValue>
                &nbsp; (<Amount value={balanceInDai} />)
              </Row>
            )
          })
        ) : (
          <Row>
            <RowKey>No balances in this vault. Deposit some tokens to see the balance here.</RowKey>
          </Row>
        )}
      </Rows>
    )
  },
  ({ ...restProps }) => <div {...restProps}>VaultInfo Loading...</div>,
)
