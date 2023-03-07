import { useEffect, useRef } from 'react'

/**
 * a hook that executes a callback function every `delay` milliseconds.
 * @param callback - Function - The callback function to be executed every `delay` milliseconds.
 * @param delay - number | null - The delay in milliseconds. If `null` the interval will be cleared.
 * @returns void
 *
 */

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }
    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}
