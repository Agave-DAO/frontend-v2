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
    try {
      const coingekoAgavePrice = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=agave-token&vs_currencies=usd',
      )
      const data: CoingekoResponse = await coingekoAgavePrice.json()

      // Returning the price of AGVE in wei
      return toWei(data['agave-token'].usd.toString())
    } catch (error) {
      console.log(error)
      return ZERO_BN
    }
  })

  return data
}
