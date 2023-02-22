import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import DepositToken from '@/src/components/token/Deposit'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { contracts } from '@/src/contracts/contracts'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { BorrowMode } from '@/src/hooks/presentation/useUserBorrows'
import { useUserBorrowsByToken } from '@/src/hooks/presentation/useUserBorrowsByToken'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { RepayInfo } from '@/src/pagePartials/markets/RepayInfo'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { AgaveLending__factory } from '@/types/generated/typechain'

function RepayImpl() {
  const { query } = useRouter()

  /* Checking if the borrow mode is stable or variable (return Variable as default). */
  const currentBorrowMode = useMemo(
    () =>
      (query?.mode as string) === BorrowMode[BorrowMode.stable]
        ? BorrowMode.stable
        : BorrowMode.variable,
    [query?.mode],
  )

  const tokenInfo = useMarketByURLParam()

  const { address: userAddress, appChainId } = useWeb3ConnectedApp()
  const lendingPoolAddress = contracts['AgaveLendingPool'].address[appChainId]
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  const borrowInfo = useUserBorrowsByToken(tokenInfo.address).borrows.find(
    ({ borrowMode }) => borrowMode === currentBorrowMode,
  )

  // 0.05% extra to ensure sufficient coverage for interest accrued during the time between fetching and repaying
  const maxValue = borrowInfo?.borrowedAmount.mul(10005).div(10000) || ZERO_BN

  return (
    <>
      <BaseTitle>
        Repay <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <BaseCard>
        <DepositToken
          action={(amount) =>
            lendingPool.repay(tokenInfo.address, amount, currentBorrowMode, userAddress)
          }
          label="Repay"
          maxValue={maxValue}
          spenderAddress={lendingPoolAddress}
          tokenAddress={tokenInfo.address}
        />
      </BaseCard>
    </>
  )
}

function Repay() {
  return (
    <RequiredConnection>
      <>
        <RepayInfo />
        <RepayImpl />
      </>
    </RequiredConnection>
  )
}

export default withGenericSuspense(Repay)
