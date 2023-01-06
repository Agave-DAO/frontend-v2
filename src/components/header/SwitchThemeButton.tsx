import { ButtonHTMLAttributes } from 'react'
import styled, { css, keyframes } from 'styled-components'

import { DarkMode } from '@/src/components/assets/DarkMode'
import { LightMode } from '@/src/components/assets/LightMode'
import { ActiveButtonCSS, DisabledButtonCSS } from '@/src/components/buttons/Button'
import { useThemeContext } from '@/src/providers/themeProvider'
import { ThemeType } from '@/src/theme/types'

const Wrapper = styled.button`
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 0;
  transition: all 0.15s ease-out;

  ${ActiveButtonCSS}
  ${DisabledButtonCSS}
`

const spinningAnimation = keyframes`
  0% {
    transform: rotate(0deg)
  }

  50% {
    transform: rotate(180deg)
  }

  100% {
    transform: rotate(359deg)
  }
`

const SpinningCSS = css`
  animation-duration: 0.08s;
  animation-iteration-count: 2;
  animation-name: ${spinningAnimation};
  animation-timing-function: linear;
`

const DarkModeSVG = styled(DarkMode)`
  ${SpinningCSS}
`

const LightModeSVG = styled(LightMode)`
  ${SpinningCSS}
`

export const SwitchThemeButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  ...restProps
}) => {
  const { currentThemeName, switchTheme } = useThemeContext()

  return (
    <Wrapper onClick={switchTheme} {...restProps}>
      {currentThemeName === ThemeType.dark && <LightModeSVG />}
      {currentThemeName === ThemeType.light && <DarkModeSVG />}
    </Wrapper>
  )
}
