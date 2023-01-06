import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

import { appName } from '@/src/constants/common'
import isServer from '@/src/utils/isServer'
import { Maybe } from '@/types/utils'

export const useBroadcastedState = <T>(
  key: string,
  initialState: Maybe<T> = null,
): [Maybe<T>, (s: T) => void, () => void] => {
  const [state, setState] = useState<Maybe<T>>(initialState)
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)

  const closeChannel = useCallback(() => {
    if (channel) channel.close()
  }, [channel])

  useEffect(() => {
    if (isServer() || window.BroadcastChannel === undefined) return
    if (!channel) setChannel(new BroadcastChannel(`${appName}_${key}`))

    if (channel) {
      channel.onmessage = ({ data }) => {
        setState(data)
      }
    }

    return closeChannel
  }, [channel, closeChannel, key])

  const broadcastState = useCallback(
    (newState: T) => {
      if (channel) {
        setState(newState)
        channel.postMessage(newState)
      }
    },
    [channel],
  )

  return [state, broadcastState, closeChannel]
}

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

type SetValue<T> = Dispatch<SetStateAction<T>>

export const useLocalStorage = <T>(name: string, initialState: T): [T, SetValue<T>, () => void] => {
  const key = `${appName}_${name}`

  const [storedValue, setStoredValue] = useState(() => {
    if (isServer() || window.localStorage === undefined) {
      return initialState
    }
    try {
      return recoverLocalStorageKey(key, initialState)
    } catch (error) {
      console.log(error)
      return initialState
    }
  })

  // From https://usehooks.com/useLocalStorage/
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Save state
      setStoredValue(valueToStore)

      if (!isServer()) {
        setLocalStorageKey(key, valueToStore)
      }
    },
    [key, storedValue],
  )

  const clearValue = useCallback(() => {
    if (!isServer()) {
      removeLocalStorageKey(key)
    }
  }, [key])

  return [storedValue, setValue, clearValue]
}

export const usePersistedState = <T>(
  key: string,
  initialState: T,
): [Maybe<T>, (s: T) => void, () => void] => {
  const [lsState, setLsState, clearLs] = useLocalStorage<T>(key, initialState)

  // If nothing is found in localStorage, `useLocalStorage` defaults to `initialState`
  const [bcState, setBcState, clearBc] = useBroadcastedState<T>(key, lsState as T)

  // initialize with local storage version
  const [state, setState] = useState<Maybe<T>>(bcState)

  const setPersistedState = useCallback(
    (value: T) => {
      setLsState(value) // save new version on local storage
      setBcState(value) // broadcast to listeners
      setState(value) // maintain state updated locally
    },
    [setBcState, setLsState],
  )

  useEffect(() => {
    if (!bcState) {
      return
    }
    // listen to broadcasted changes
    setState(bcState)
  }, [bcState])

  const clearState = useCallback(() => {
    clearLs()
    clearBc()
  }, [clearBc, clearLs])

  return [state, setPersistedState, clearState]
}
