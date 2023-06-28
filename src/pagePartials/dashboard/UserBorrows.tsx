import { useCallback, useMemo, useState } from 'react'

import { UserAsset } from '@/src/components/asset/UserAsset'
import { ActionButton } from '@/src/components/buttons/ActionButton'
import { Amount } from '@/src/components/helpers/Amount'
import { EmptyContent } from '@/src/components/helpers/EmptyContent'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { ActionsWrapper } from '@/src/components/layout/ActionsWrapper'
import { AssetsList } from '@/src/components/layout/AssetsList'
import { MyAssetSkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { useMarketsData } from '@/src/hooks/presentation/useMarketsData'
import { InterestRateMode, useUserBorrows } from '@/src/hooks/presentation/useUserBorrows'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'
import { useModalsContext } from '@/src/providers/modalsProvider'

export const UserBorrows: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const userBorrows = useUserBorrows()
    const { openBorrowRepayModal } = useModalsContext()
    const agaveTokens = useAgaveTokens()

    const enabledMarketsAddresses = useMarketsData()
      .agaveMarketsData?.filter((market) => {
        if (market.assetData.isFrozen === false && market.assetData.borrowingEnabled === true)
          return true
        return false
      })
      ?.map((market) => market.tokenAddress)

    return !userBorrows.length ? (
      <EmptyContent
        link={{
          text: 'All markets',
          href: '/',
        }}
        text="In order to borrow you need to deposit any asset to be used as collateral."
        title="Nothing borrowed yet"
      />
    ) : (
      <AssetsList {...restProps}>
        {userBorrows.map(
          ({ assetAddress, borrowMode, borrowRate, borrowedAmount, borrowedAmountInDAI }) => {
            const { decimals, symbol } = agaveTokens.getTokenByAddress(assetAddress)

            const isActive = enabledMarketsAddresses?.includes(assetAddress)
            return (
              <UserAsset
                badge={InterestRateMode[borrowMode]}
                baseRate={borrowRate.base}
                incentivesRate={borrowRate.incentive}
                isBorrow
                key={`${assetAddress}-${borrowMode}`}
                tokenAddress={assetAddress}
                tokenValue={
                  <Amount
                    decimals={decimals}
                    symbol={symbol}
                    symbolPosition="after"
                    value={borrowedAmount}
                  />
                }
                totalAP={borrowRate.total}
                usdValue={<Amount value={borrowedAmountInDAI} />}
              >
                <ActionsWrapper>
                  <ActionButton
                    onClick={() =>
                      openBorrowRepayModal({
                        activeTab: 'repay',
                        mode: borrowMode,
                        tokenAddress: assetAddress,
                      })
                    }
                    variant="dark"
                  >
                    Repay
                  </ActionButton>
                  {isActive ? (
                    <ActionButton
                      onClick={() =>
                        openBorrowRepayModal({
                          activeTab: 'borrow',
                          mode: borrowMode,
                          tokenAddress: assetAddress,
                        })
                      }
                    >
                      Borrow
                    </ActionButton>
                  ) : null}
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
        <MyAssetSkeletonLoading key={`borrow_${index}`} />
      ))}
    </AssetsList>
  ),
)
