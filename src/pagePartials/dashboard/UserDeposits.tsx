import { useRouter } from 'next/router'

import { ActionsWrapper } from '@/src/components/asset/ActionsWrapper'
import { UserAsset } from '@/src/components/asset/UserAsset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { MoreActionsDropdown } from '@/src/components/common/MoreActionsDropdown'
import { Amount } from '@/src/components/helpers/Amount'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { Loading } from '@/src/components/loading/Loading'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useUserDeposits } from '@/src/hooks/presentation/useUserDeposits'

const UserDepositsList = withGenericSuspense(
  () => {
    const userDeposits = useUserDeposits()
    const router = useRouter()

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
                onClick: () => router.push(`/markets/${symbol}/withdraw`),
              },
              // {
              //   text: 'Swap',
              //   onClick: () => console.log('nothing yet'),
              // },
              // {
              //   text: 'Strategies',
              //   onClick: () => console.log('nothing yet'),
              // },
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
                    displayDecimals={3}
                    symbol={symbol}
                    symbolPosition="after"
                    value={depositedAmount}
                  />
                }
                totalAPY={depositRate.add(incentiveRate)}
                usdValue={<Amount displayDecimals={3} value={depositedAmountInDAI} />}
                useAsCollateral={asCollateral}
              >
                <ActionsWrapper>
                  <MoreActionsDropdown items={items} />
                  <ActionButton onClick={() => router.push(`/markets/${symbol}/deposit`)}>
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
