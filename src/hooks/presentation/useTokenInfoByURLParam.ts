import { useRouter } from 'next/router'

import { getTokenInfo } from '@/src/utils/getTokenInfo'

export const useMarketByURLParam = () => {
  const { query } = useRouter()
  const token = query.token as string
  const tokenInfo = getTokenInfo(token)

  if (!tokenInfo) {
    throw new Error('Invalid token')
  }

  return tokenInfo
}
