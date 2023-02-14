import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { DepositInfo } from '@/src/pagePartials/markets/DepositInfo'
import { Deposit as DepositAction } from '@/src/pagePartials/markets/deposit/Deposit'

function DepositImpl() {
  const tokenInfo = useMarketByURLParam()

  return (
    <>
      <BaseTitle>
        Deposit <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <DepositAction tokenAddress={tokenInfo.address} />
    </>
  )
}

function Deposit() {
  return (
    <RequiredConnection>
      <>
        <DepositInfo />
        <DepositImpl />
      </>
    </RequiredConnection>
  )
}

Deposit.displayName = 'DepositPage'

export default withGenericSuspense(Deposit)
