import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { Withdraw as WithdrawAction } from '@/src/pagePartials/markets/withdraw/Withdraw'

function WithdrawImpl() {
  const tokenInfo = useMarketByURLParam()

  return (
    <>
      <BaseTitle>
        Withdraw <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <WithdrawAction tokenAddress={tokenInfo.address} />
    </>
  )
}

function Withdraw() {
  return (
    <RequiredConnection>
      <WithdrawImpl />
    </RequiredConnection>
  )
}

export default withGenericSuspense(Withdraw)
