import { useRouter } from 'next/router'

import { useTokenInfo } from '@/src/hooks/useTokenInfo'
import { Token } from '@/types/token'

export const useMarketByURLParam = () => {
  const { query } = useRouter()
  const token = query.token as string

  return useTokenInfo(token) as Token
}
