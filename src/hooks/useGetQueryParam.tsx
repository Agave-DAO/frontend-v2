import { useSearchParams } from 'next/navigation'

export const useGetQueryParam = (key: string) => {
  const searchParams = useSearchParams()
  return searchParams.get(key)
}
