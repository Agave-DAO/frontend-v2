import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ThemeProvider } from 'styled-components'

import merge from 'lodash/merge'

import { usePersistedState } from '@/src/hooks/usePersistedState'
import { common } from '@/src/theme/common'
import { dark } from '@/src/theme/dark'
import { GlobalStyles } from '@/src/theme/globalStyles'
import { light } from '@/src/theme/light'
import { ThemeType } from '@/src/theme/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ThemeContext = createContext({} as any)

const ThemeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const DEFAULT_THEME =
    process.env.NEXT_PUBLIC_DEFAULT_THEME === ThemeType.dark ||
    process.env.NEXT_PUBLIC_DEFAULT_THEME === ThemeType.light
      ? process.env.NEXT_PUBLIC_DEFAULT_THEME
      : ThemeType.dark

  const [currentThemeName, setCurrentThemeName] = usePersistedState(
    'stored-theme-name',
    DEFAULT_THEME,
  )

  const isLightTheme = useMemo(() => currentThemeName === ThemeType.light, [currentThemeName])

  const [currentThemeJSON, setCurrentThemeJSON] = useState(
    isLightTheme ? merge({}, common, light) : merge({}, common, dark),
  )

  const switchTheme = useCallback(() => {
    setCurrentThemeName(isLightTheme ? ThemeType.dark : ThemeType.light)
  }, [isLightTheme, setCurrentThemeName])

  useEffect(() => {
    setCurrentThemeJSON(isLightTheme ? merge({}, common, light) : merge({}, common, dark))
  }, [isLightTheme])

  const values = {
    switchTheme,
    currentThemeName,
  }

  return (
    <ThemeContext.Provider value={values}>
      <ThemeProvider theme={currentThemeJSON}>
        <>
          <GlobalStyles />
          {children}
        </>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContextProvider

export function useThemeContext() {
  return useContext(ThemeContext)
}
