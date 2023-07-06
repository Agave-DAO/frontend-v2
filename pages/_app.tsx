import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { GoogleAnalytics } from 'nextjs-google-analytics'
import { SWRConfig } from 'swr'

import { Footer } from '@/src/components/footer/Footer'
import { Header } from '@/src/components/header/Header'
import { InnerContainer } from '@/src/components/helpers/InnerContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import Toast from '@/src/components/toast/Toast'
import TooltipConfig from '@/src/components/tooltip/TooltipConfig'
import { TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL } from '@/src/constants/common'
import { Head } from '@/src/pagePartials/index/Head'
import { TransactionNotificationProvider } from '@/src/providers/TransactionNotificationProvider'
import CookiesWarningProvider from '@/src/providers/cookiesWarningProvider'
import MinHealthConfigurationModalProvider from '@/src/providers/minHealthConfigurationModalProvider'
import ThemeProvider from '@/src/providers/themeProvider'
import TokenActionsModalProvider from '@/src/providers/tokenActionsModalProvider'

import 'sanitize.css'
import 'react-tooltip/dist/react-tooltip.css'

const Scroll = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: calc(100vh - var(--header-full-height));
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  top: var(--header-full-height);
  width: 100vw;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    height: auto;
    position: relative;
    top: auto;
    width: auto;
    z-index: 5;
  }
`

const Container = styled(InnerContainer)`
  flex-grow: 1;
  overflow: hidden;
  padding-top: 25px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.desktopStart}) {
    padding-bottom: 65px;
    padding-top: 120px;
  }
`

const MobileScrollTo = styled.div`
  height: 0;
  line-height: 0;
  width: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    display: none;
  }
`

const Web3ConnectionProvider = dynamic(() => import('@/src/providers/web3ConnectionProvider'), {
  ssr: false,
})

const AgaveTokensProvider = dynamic(() => import('@/src/providers/agaveTokensProvider'), {
  ssr: false,
})

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Black magic explained here https://nextjs.org/docs/basic-features/layouts
  const getLayout = Component.getLayout ?? ((page) => <>{page}</>)

  return (
    <>
      <GoogleAnalytics />
      <Head />
      <SWRConfig
        value={{
          suspense: true,
          revalidateOnFocus: true,
          revalidateIfStale: false,
          dedupingInterval: TOKEN_DATA_RETRIEVAL_REFRESH_INTERVAL,
        }}
      >
        <Web3ConnectionProvider>
          <ThemeProvider>
            <SafeSuspense>
              <TransactionNotificationProvider>
                <CookiesWarningProvider>
                  <AgaveTokensProvider>
                    <MinHealthConfigurationModalProvider>
                      <TokenActionsModalProvider>
                        <Header />
                        <Scroll>
                          <MobileScrollTo id="main" />
                          <Container as="main">{getLayout(<Component {...pageProps} />)}</Container>
                          <Footer />
                        </Scroll>
                      </TokenActionsModalProvider>
                    </MinHealthConfigurationModalProvider>
                  </AgaveTokensProvider>
                </CookiesWarningProvider>
              </TransactionNotificationProvider>
            </SafeSuspense>
            <Toast />
            <TooltipConfig />
          </ThemeProvider>
        </Web3ConnectionProvider>
      </SWRConfig>
    </>
  )
}
