import { UserAsset } from '@/src/components/asset/UserAsset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { MoreActionsDropdown } from '@/src/components/common/MoreActionsDropdown'
import { Amount } from '@/src/components/helpers/Amount'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useActionsContext } from '@/src/providers/actionsProvider'

const UserDepositsList = withGenericSuspense(
  () => {
    const userDeposits = useUserDeposits()
    const { openDepositWithdrawModal } = useActionsContext()

    return !userDeposits.length ? (
      <EmptyContent
        link={{
          text: 'All markets',
          href: '/',
        }}
        text="Your account is empty. Move cryptocurrency from your wallet and start earning interest."
        title="Nothing deposited yet"
      />
    ) : (
      <>
        {userDeposits.map(
          ({
            asCollateral,
            assetAddress,
            depositRate,
            depositedAmount,
            depositedAmountInDAI,
            incentiveRate,
          }) => {
            const { decimals, symbol } = agaveTokens.getTokenByAddress(assetAddress)
            const items = [
              {
                text: 'Withdraw',
                onClick: () => openDepositWithdrawModal(assetAddress, 'withdraw'),
              },
            ]

            return (
              <UserAsset
                baseRate={depositRate}
                incentivesRate={incentiveRate}
                key={`${assetAddress}-deposit`}
                tokenAddress={assetAddress}
                tokenValue={
                  <Amount
                    decimals={decimals}
                    symbol={symbol}
                    symbolPosition="after"
                    value={depositedAmount}
                  />
                }
                totalAP={depositRate.add(incentiveRate)}
                usdValue={<Amount displayDecimals={3} value={depositedAmountInDAI} />}
                useAsCollateral={asCollateral}
              >
                <ActionsWrapper>
                  <MoreActionsDropdown items={items} size="lg" />
                  <ActionButton onClick={() => openDepositWithdrawModal(assetAddress, 'deposit')}>
                    Deposit
                  </ActionButton>
                </ActionsWrapper>
              </UserAsset>
            )
          },
        )}
      </>
    )
  },
  () => <Loading text="Fetching user deposits..." />,
)

export const UserDeposits = () => {
  return (
    <AssetsList>
      <UserDepositsList />
    </AssetsList>
  )
}
