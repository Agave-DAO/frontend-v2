import { useRouter } from 'next/router'

import { BaseCard } from '@/src/components/common/BaseCard'
import { Asset } from '@/src/components/helpers/Asset'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import DepositToken from '@/src/components/token/Deposit'
import { contracts } from '@/src/contracts/contracts'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { getTokenInfo } from '@/src/utils/getTokenInfo'
import { AgaveLending__factory } from '@/types/generated/typechain'

function RepayImpl() {
  const { query } = useRouter()
  const token = query.token as string
  const tokenInfo = getTokenInfo(token)

  const { address: userAddress, appChainId } = useWeb3ConnectedApp()
  const lendingPoolAddress = contracts['AgaveLendingPool'].address[appChainId]
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  return (
    <>
      <BaseTitle>
        Repay <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <BaseCard>
        <DepositToken
          action={(amount) => lendingPool.repay(tokenInfo.address, amount, 2, userAddress)}
          label="Repay"
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
      <RepayImpl />
    </RequiredConnection>
  )
}

export default withGenericSuspense(Repay)
