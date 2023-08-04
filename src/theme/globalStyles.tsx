import { createGlobalStyle } from 'styled-components'

import { onBoardCSS } from '@/src/theme/onBoard'
import { tooltipCSS } from '@/src/theme/tooltip'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GlobalStyles = createGlobalStyle<{ theme: any }>`
  :root {
    --header-padding-top: 25px;
    --header-full-height: calc(${({ theme: { header } }) =>
      header.height} + var(--header-padding-top));

      /* Tooltip */
      --rt-color-dark:  ${({ theme: { tooltip } }) => tooltip.backgroundColor};
      --rt-color-info:  ${({ theme: { tooltip } }) => tooltip.textColor};
      --rt-opacity: 1;
  }

  html {
    font-size: 10px;
    scroll-behavior: smooth;
  }

  body {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    background-color: ${({ theme: { body } }) => body.backgroundColor};
    background-image: ${({ theme: { body } }) => body.backgroundImage};
    background-size: cover;
    color: ${({ theme: { colors } }) => colors.textColor};
    font-family: ${({ theme: { fonts } }) => fonts.family};
    font-size: ${({ theme: { fonts } }) => fonts.defaultSize};
    min-height: 100vh;
    outline-color: ${({ theme: { colors } }) => colors.secondary};
    overflow: hidden;

    @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
      overflow: auto;
    }

    &.modalOpen {
      height: 100vh;
      left: 0;
      position: fixed;
      top: 0;
      width: 100vw;
    }
  }

  code {
    font-family: ${({ theme: { fonts } }) => fonts.familyCode};
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow: hidden;
    width: 100%;
  }

  hr {
    display: block;
    height: auto;
    margin: 30px 0;
    width: 100%;
  }

  a {
    color: ${({ theme: { colors } }) => colors.textColor};
  }

  ${onBoardCSS}
  ${tooltipCSS}

  // Scrollbar
  ::-webkit-scrollbar {
    width: 6px;
  }
 ::-webkit-scrollbar-track {
    border-radius: 10px;
    background: #122C34;
  }
  ::-webkit-scrollbar-thumb{
    border-radius: 10px;
    background: white;
  }
`
