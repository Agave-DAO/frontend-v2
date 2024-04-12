import useSWR from 'swr'

import { ZERO_BN } from '@/src/constants/bigNumber'
import { toWei } from '@/src/utils/common'

type CoingekoResponse = {
  'agave-token': {
    usd: number
  }
}

// Getting the price of AGVE from coingecko API
export const useGetStakingAgvePrice = () => {
  const { data } = useSWR(['getStakingAgvePrice'], async () => {
    return toWei('60')
  })

  return data
}
