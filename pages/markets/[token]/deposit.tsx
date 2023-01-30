import { useRouter } from 'next/router'

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

function DepositImpl() {
  const { query } = useRouter()
  const { address: userAddress, appChainId } = useWeb3ConnectedApp()
  const token = query.token as string
  const tokenInfo = getTokenInfo(token)

  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')
  const lendingPoolAddress = contracts['AgaveLendingPool'].address[appChainId]

  return (
    <>
      <BaseTitle>
        Deposit <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <DepositToken
        action={(amount) => lendingPool.deposit(tokenInfo.address, amount, userAddress, 0)}
        spenderAddress={lendingPoolAddress}
        tokenAddress={tokenInfo.address}
      />
    </>
  )
}

function Deposit() {
  return (
    <RequiredConnection>
      <DepositImpl />
    </RequiredConnection>
  )
}

export default withGenericSuspense(Deposit)
