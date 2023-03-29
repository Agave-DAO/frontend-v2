import memoizee from 'memoizee'

/**
 * Memoize a function or getter
 */
export const memoize = () => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if ('value' in descriptor) {
      const func = descriptor.value
      descriptor.value = memoizee(func)
    } else if ('get' in descriptor && descriptor.get) {
      const func = descriptor.get
      descriptor.get = memoizee(func)
    }

    return descriptor
  }
}
