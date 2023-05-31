import { OrderCreation, UID } from '@/types/generated/cowSwap/order-book'

/**
 * Sets an order on the CowSwap API
 * @param {OrderCreation} params - the payload JSON to send to the CowSwap API
 * @returns {Promise<UID>} orderUid
 */
export const setCowSwapOrder = (params: OrderCreation): Promise<UID> =>
  fetch('https://api.cow.fi/xdai/api/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  }).then((res) => res.json())
