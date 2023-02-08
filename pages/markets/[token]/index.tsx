import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { useMarketByURLParam } from '@/src/hooks/presentation/useTokenInfoByURLParam'
import { MarketInformation } from '@/src/pagePartials/markets/MarketInformation'
import { ReserveRates } from '@/src/pagePartials/markets/ReserveRates'
import { ReserveStatus } from '@/src/pagePartials/markets/ReserveStatus'
import { UserInformation } from '@/src/pagePartials/markets/UserInformation'

function MarketDetailsImpl({ tokenAddress }: { tokenAddress: string }) {
  return (
    <div>
      <ReserveStatus tokenAddress={tokenAddress} />
      <ReserveRates tokenAddress={tokenAddress} />
      <MarketInformation tokenAddress={tokenAddress} />
      <UserInformation tokenAddress={tokenAddress} />
    </div>
  )
}

function MarketDetails() {
  const tokenInfo = useMarketByURLParam()

  return <MarketDetailsImpl tokenAddress={tokenInfo.address} />
}

export default withGenericSuspense(MarketDetails)
