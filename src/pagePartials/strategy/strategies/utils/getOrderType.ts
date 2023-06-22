import { hexValue, hexZeroPad } from 'ethers/lib/utils'

/**
 * Maps the order type name to the order type flag and returns it in bytes32 format
 * @param {string} orderType - 'swap' | 'long' | 'short'
 * @returns {string} orderTypeFlag - the order type flag in bytes32 format
 */
export const getOrderType = (orderType: 'swap' | 'long' | 'short') => {
  let orderTypeNumber

  switch (orderType) {
    case 'swap': {
      orderTypeNumber = 0
      break
    }
    case 'long': {
      orderTypeNumber = 1
      break
    }
    case 'short': {
      orderTypeNumber = 2
      break
    }
    default: {
      throw new Error('Invalid order type')
    }
  }

  return hexZeroPad(hexValue(orderTypeNumber), 32) // orderTypeFlag
}
