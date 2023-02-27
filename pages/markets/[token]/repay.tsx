import { BaseCard } from '@/src/components/common/BaseCard'
import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { RepayInfo } from '@/src/pagePartials/markets/RepayInfo'
import { Repay as RepayAction } from '@/src/pagePartials/markets/repay/Repay'

function RepayImpl() {
  const tokenInfo = useMarketByURLParam()

  return (
    <>
      <BaseTitle>
        Repay <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <BaseCard>
        <RepayAction tokenAddress={tokenInfo.address} />
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
