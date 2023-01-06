import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import styled from 'styled-components'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { NavLink } from '@/src/components/navigation/NavLink'
import {
  cookiesWarningEnabled as cookiesWarningEnabledConfig,
  gaMeasurementId,
} from '@/src/constants/common'
import { recoverLocalStorageKey, setLocalStorageKey } from '@/src/hooks/usePersistedState'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.componentBackgroundColor};
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  min-height: 160px;
  padding: 20px;
  position: fixed;
  width: 100%;
  z-index: 123;
`

const Content = styled.div`
  max-width: 100%;
  position: relative;
  width: ${({ theme }) => theme.layout.maxWidth};
`

const Text = styled.p`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.4rem;
  font-weight: normal;
  line-height: 1.4;
  margin: 0 auto 20px;
  max-width: 100%;
  padding: 0 20px;
  position: relative;
  text-align: center;
  width: 840px;
  z-index: 1;
`

const Link = styled(NavLink)`
  color: ${({ theme }) => theme.colors.textColor};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

const ButtonContainer = styled.div`
  column-gap: 20px;
  display: flex;
  position: relative;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    align-items: center;
    display: flex;
    justify-content: center;
  }
`

const Button = styled(ButtonPrimary)`
  font-size: 18px;
  height: 36px;
  width: 100%;

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    max-width: 170px;
  }
`

const CookiesWarning: React.FC<{
  hideCookiesWarning: () => void
}> = ({ hideCookiesWarning }) => {
  return (
    <Wrapper>
      <Content>
        <Text>
          We use cookies to give you the best experience and to help improve our website. Please
          read our <Link href={'/cookie-policy'}>Cookie Policy</Link> for more information. By
          clicking <strong>&quot;Accept&quot;</strong>, you agree to the storing of cookies on your
          device to enhance site navigation, analyze site usage and provide customer support.
        </Text>
        <ButtonContainer>
          <Button onClick={hideCookiesWarning}>Accept</Button>
        </ButtonContainer>
      </Content>
    </Wrapper>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CookiesWarningContext = createContext({} as any)

export const CookiesWarningContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const visibleCookiesWarningCookie = `show-cookies-warning`
  /* Note: I assume we should show the cookies warning when using
     Google Analytics, even if the cookies warning is disabled. */
  const cookiesWarningEnabled = cookiesWarningEnabledConfig || gaMeasurementId

  const isCookiesWarningVisible = recoverLocalStorageKey(visibleCookiesWarningCookie, false)

  const [cookiesWarningVisible, setCookiesWarningVisible] = useState(isCookiesWarningVisible)

  const showCookiesWarning = useCallback(() => {
    setCookiesWarningVisible(true)
    setLocalStorageKey(visibleCookiesWarningCookie, true)
  }, [visibleCookiesWarningCookie])

  const hideCookiesWarning = useCallback(() => {
    setCookiesWarningVisible(false)
    setLocalStorageKey(visibleCookiesWarningCookie, false)
  }, [visibleCookiesWarningCookie])

  useEffect(() => {
    if (cookiesWarningVisible) {
      showCookiesWarning()
    }
  }, [cookiesWarningVisible, showCookiesWarning])

  const values = { showCookiesWarning, hideCookiesWarning, cookiesWarningEnabled }

  return (
    <CookiesWarningContext.Provider value={values}>
      {children}
      {cookiesWarningVisible && cookiesWarningEnabled && (
        <CookiesWarning hideCookiesWarning={hideCookiesWarning} />
      )}
    </CookiesWarningContext.Provider>
  )
}

export default CookiesWarningContextProvider

export function useCookiesWarningContext() {
  return useContext(CookiesWarningContext)
}
