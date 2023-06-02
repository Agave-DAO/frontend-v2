import { OrderCreation, UID } from '@/types/generated/cowSwap/order-book'

/**
 * Sets an order on the CowSwap API
 * @param {OrderCreation} params - the payload JSON to send to the CowSwap API
 * @returns {Promise<UID>} orderUid
 */
export const setCowSwapOrder = async (params: OrderCreation): Promise<UID> => {
  const response = await fetch('https://api.cow.fi/xdai/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (response.status !== 200) {
    const error = await response.json()
    throw new Error('Error setting CowSwap order: ' + error.errorType + ' - ' + error.description)
  }

  return response.json()
}
