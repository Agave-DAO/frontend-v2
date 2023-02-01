import { useRouter } from 'next/router'

import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { MarketInformation } from '@/src/pagePartials/markets/MarketInformation'
import { ReserveRates } from '@/src/pagePartials/markets/ReserveRates'
import { ReserveStatus } from '@/src/pagePartials/markets/ReserveStatus'
import { UserInformation } from '@/src/pagePartials/markets/UserInformation'
import { getTokenInfo } from '@/src/utils/getTokenInfo'

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
  const { query } = useRouter()
  const token = query.token as string
  const tokenInfo = getTokenInfo(token)

  return <MarketDetailsImpl tokenAddress={tokenInfo.address} />
}

export default withGenericSuspense(MarketDetails)
