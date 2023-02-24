import { useRouter } from 'next/router'
import { useMemo } from 'react'

// TODO: replace this with `useSearchParams` when it's available in Next.js
//  https://beta.nextjs.org/docs/api-reference/use-search-params
export const useGetQueryParam = (key: string) => {
  const { query } = useRouter()

  return useMemo(() => query?.[key] ?? null, [key, query])
}
