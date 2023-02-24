import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { BorrowInfo } from '@/src/pagePartials/markets/BorrowInfo'
import { Borrow as BorrowAction } from '@/src/pagePartials/markets/borrow/Borrow'

function BorrowImpl() {
  const tokenInfo = useMarketByURLParam()

  return (
    <>
      <BaseTitle>
        Borrow <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <BorrowAction tokenAddress={tokenInfo.address} />
    </>
  )
}

function Borrow() {
  return (
    <RequiredConnection>
      <>
        <BorrowInfo />
        <BorrowImpl />
      </>
    </RequiredConnection>
  )
}

Borrow.displayName = 'BorrowPage'

export default withGenericSuspense(Borrow)
