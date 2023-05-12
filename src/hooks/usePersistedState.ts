import { useLocalStorage } from 'usehooks-ts'

import { appName } from '@/src/constants/common'
import isServer from '@/src/utils/isServer'

export const recoverLocalStorageKey = <T>(name: string, initialState: T): T => {
  const key = `${appName}_${name}`
  const item = window.localStorage.getItem(key)
  try {
    return item ? JSON.parse(`${item}`) : initialState
  } catch {
    return initialState
  }
}

export const setLocalStorageKey = <T>(name: string, value: T) => {
  const key = `${appName}_${name}`
  if (typeof value === 'string') {
    window.localStorage.setItem(key, value)
  } else {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (e) {
      console.error(e)
    }
  }
}

export const removeLocalStorageKey = (name: string) => {
  if (!isServer()) {
    const key = `${appName}_${name}`
    window.localStorage.removeItem(key)
  }
}

export const usePersistedState = <T>(key: string, initialState: T) => {
  key = `${appName}_${key}`

  return useLocalStorage(key, initialState)
}
