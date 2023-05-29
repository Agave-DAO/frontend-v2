import { EmphasizedRowValue, Row, RowKey, Rows } from '@/src/components/common/Rows'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useTokensLists } from '@/src/hooks/useTokensLists'

type TokenAddress = string
type TokenBalance = string

type VaultBalance = {
  [tokenAddress: TokenAddress]: TokenBalance
}

const useBatchTokenBalances = (tokensAddresses: string[], vaultAddress: string): VaultBalance[] => {
  return []
}

const useVaultBalances = (vaultAddress: string) => {
  const { tokensList } = useTokensLists({ includeFrozen: false, types: ['ag'] })

  return useBatchTokenBalances(
    tokensList.map(({ address }) => address),
    vaultAddress,
  )
}

export const VaultInfo: React.FC<{ vaultAddress: string }> = withGenericSuspense(
  ({ vaultAddress, ...restProps }) => {
    const tokenSymbol = 'usdc'
    const tokenIcon = <TokenIcon dimensions={18} symbol={tokenSymbol} />
    const vaultBalances = useVaultBalances(vaultAddress)

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
