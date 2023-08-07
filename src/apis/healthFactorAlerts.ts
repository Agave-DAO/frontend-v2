import { UserHealthFactorAlerts } from '@/types/user'

export const getUserHealthFactorAlerts = async (
  address: string,
  signature: string,
  message: string,
): Promise<UserHealthFactorAlerts> => {
  const response = await fetch('https://hfalerts.aghfalerts.workers.dev/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, signature, message }),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API ERROR ${response.status}: ${errorText}`)
    throw new Error('Failed to fetch user health factor alerts')
  }
  const data = await response.json()
  return data
}

export const updateUserHealthFactorAlerts = async (
  address: string,
  signature: string,
  message: string,
  threshold: number,
  email: string,
  state: boolean,
): Promise<UserHealthFactorAlerts> => {
  const response = await fetch('https://hfalerts.aghfalerts.workers.dev/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address, signature, message, threshold, email, state }),
  })
  if (!response.ok) {
    const errorText = await response.text()
    console.error(`API ERROR ${response.status}: ${errorText}`)
    throw new Error('Failed to fetch user health factor alerts')
  }
  const data = await response.json()
  return data
}
