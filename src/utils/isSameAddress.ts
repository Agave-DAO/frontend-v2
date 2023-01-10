import { isAddress } from '@ethersproject/address'

export const isSameAddress = (a: string, b: string) => {
  if (!a || !b) {
    return false
  }

  if (!isAddress(a) || !isAddress(b)) {
    return false
  }

  return a.toLowerCase() === b.toLowerCase()
}
