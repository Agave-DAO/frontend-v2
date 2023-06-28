import { useEffect, useState } from 'react'

import { getUserHealthFactorAlerts } from '@/src/apis/healthFactorAlerts'

interface Data {
  email: string
  threshold: number
  isReminderEnabled: boolean
  isAgentListed: boolean
  id: number
}

interface Error {
  message: string
}

export const useUserHealthFactorAlerts = (userAddress: string) => {
  const [data, setData] = useState<Data | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserHealthFactorAlerts(userAddress)
        setData(response)
      } catch (e) {
        setError(e as Error | null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [userAddress])

  return { data, isLoading, error }
}
