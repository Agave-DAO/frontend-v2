import { useRouter } from 'next/router'

import { getTokenInfo } from '@/src/utils/getTokenInfo'

export const useMarketByURLParam = () => {
  const { query } = useRouter()
  const token = query.token as string

  return getTokenInfo(token)
}
