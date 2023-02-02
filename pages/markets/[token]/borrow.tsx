import { useRouter } from 'next/router'

import { BigNumber } from 'ethers'

import { Asset } from '@/src/components/helpers/Asset'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import BorrowToken from '@/src/components/token/Borrow'
import { ZERO_BN } from '@/src/constants/bigNumber'
import useGetAssetsPriceInDAI from '@/src/hooks/queries/useGetAssetsPriceInDAI'
import useGetUserAccountData from '@/src/hooks/queries/useGetUserAccountData'
import { useContractInstance } from '@/src/hooks/useContractInstance'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { getTokenInfo } from '@/src/utils/getTokenInfo'
import { AgaveLending__factory } from '@/types/generated/typechain'

function BorrowImpl() {
  const { query } = useRouter()
  const token = query.token as string
  const tokenInfo = getTokenInfo(token)

  const { address: userAddress } = useWeb3ConnectedApp()
  const lendingPool = useContractInstance(AgaveLending__factory, 'AgaveLendingPool')

  const [{ data: userAccountData }] = useGetUserAccountData(userAddress)
  const [{ data: assetPricesInDAI }] = useGetAssetsPriceInDAI([
    '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
  ])

  const availableToBorrowDAI = userAccountData?.[0].availableBorrowsETH // 0.0001 eth
  const tokenPrice = assetPricesInDAI?.[0]?.[0] // 1330 usd
  const maxBorrow =
    availableToBorrowDAI?.mul(BigNumber.from(10).pow(18)).div(tokenPrice || BigNumber.from(1)) ||
    ZERO_BN

  return (
    <>
      <BaseTitle>
        Borrow <Asset symbol={tokenInfo.symbol} />
      </BaseTitle>
      <BorrowToken
        action={(amount) => lendingPool.borrow(tokenInfo.address, amount, 2, 0, userAddress)}
        maxValue={
          tokenInfo.decimals < 18
            ? maxBorrow.div(BigNumber.from(10).pow(18 - tokenInfo.decimals))
            : maxBorrow
        }
        tokenAddress={tokenInfo.address}
      />
    </>
  )
}

function Borrow() {
  return (
    <RequiredConnection>
      <BorrowImpl />
    </RequiredConnection>
  )
}

export default withGenericSuspense(Borrow)
