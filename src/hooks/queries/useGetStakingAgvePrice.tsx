import useSWR from 'swr'

import { toWei } from '@/src/utils/common'

// Getting the price of AGVE from coingecko API
export const useGetStakingAgvePrice = () => {
  const { data } = useSWR(['getStakingAgvePrice'], async () => {
    return toWei('60')
  })

  return data
}
