import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })
      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render = () => {
    return (
      <Html lang="en">
        <Head>
          <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
          <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
          <link href="/favicon/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
          <link href="/favicon/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/favicon/site.webmanifest" rel="manifest" />
          <link color="#333" href="/favicon/safari-pinned-tab.svg" rel="mask-icon" />
          <meta content="#333" name="msapplication-TileColor" />
          <meta content="#333" name="theme-color"></meta>
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link crossOrigin="crossorigin" href="https://fonts.gstatic.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=Droid+Sans:wght@400;500;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body id="body">
          <Main />
          <NextScript />
          <div id="modals" />
        </body>
      </Html>
    )
  }
}
