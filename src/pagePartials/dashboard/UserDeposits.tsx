import { UserAsset } from '@/src/components/asset/UserAsset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { MoreActionsDropdown } from '@/src/components/dropdown/MoreActionsDropdown'
import { Amount } from '@/src/components/helpers/Amount'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { MyAssetSkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'
import { useTokenActionsModalsContext } from '@/src/providers/tokenActionsModalProvider'

export const UserDeposits: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const userDeposits = useUserDeposits()
    const { openDepositWithdrawModal } = useTokenActionsModalsContext()

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
      <AssetsList {...restProps}>
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
                onClick: () =>
                  openDepositWithdrawModal({ tokenAddress: assetAddress, activeTab: 'withdraw' }),
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
                usdValue={<Amount value={depositedAmountInDAI} />}
                useAsCollateral={asCollateral}
              >
                <ActionsWrapper>
                  <MoreActionsDropdown items={items} size="lg" />
                  <ActionButton
                    onClick={() =>
                      openDepositWithdrawModal({
                        tokenAddress: assetAddress,
                        activeTab: 'deposit',
                      })
                    }
                  >
                    Deposit
                  </ActionButton>
                </ActionsWrapper>
              </UserAsset>
            )
          },
        )}
      </AssetsList>
    )
  },
  ({ ...restProps }) => (
    <AssetsList {...restProps}>
      {Array.from({ length: 4 }).map((item, index) => (
        <MyAssetSkeletonLoading key={`deposit_${index}`} />
      ))}
    </AssetsList>
  ),
)
