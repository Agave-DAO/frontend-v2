import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { ReactElement, ReactNode } from 'react'
import styled from 'styled-components'

import { GoogleAnalytics } from 'nextjs-google-analytics'
import { SWRConfig } from 'swr'

import { Header } from '@/src/components/header/Header'
import { InnerContainer } from '@/src/components/helpers/InnerContainer'
import SafeSuspense from '@/src/components/helpers/SafeSuspense'
import { Footer } from '@/src/components/layout/Footer'
import { Main } from '@/src/components/layout/Main'
import Toast from '@/src/components/toast/Toast'
import { Head } from '@/src/pagePartials/index/Head'
import { TransactionNotificationProvider } from '@/src/providers/TransactionNotificationProvider'
import CookiesWarningProvider from '@/src/providers/cookiesWarningProvider'
import ThemeProvider from '@/src/providers/themeProvider'
import 'sanitize.css'
import TokenIconsProvider from '@/src/providers/tokenIconsProvider'

const Container = styled(InnerContainer)`
  flex-grow: 1;
  padding-bottom: 25px;
  padding-top: 25px;
`

const Web3ConnectionProvider = dynamic(() => import('@/src/providers/web3ConnectionProvider'), {
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
  const getLayout = Component.getLayout ?? ((page) => <Main>{page}</Main>)

  return (
    <>
      <GoogleAnalytics />
      <Head />
      <SWRConfig
        value={{
          suspense: true,
          revalidateOnFocus: false,
        }}
      >
        <Web3ConnectionProvider>
          <ThemeProvider>
            <SafeSuspense>
              <TransactionNotificationProvider>
                <CookiesWarningProvider>
                  <Header />
                  <TokenIconsProvider>
                    <Container>{getLayout(<Component {...pageProps} />)}</Container>
                  </TokenIconsProvider>
                  <Footer />
                </CookiesWarningProvider>
              </TransactionNotificationProvider>
            </SafeSuspense>
            <Toast />
          </ThemeProvider>
        </Web3ConnectionProvider>
      </SWRConfig>
    </>
  )
}
