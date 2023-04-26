import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const Buttons = styled.div`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.lighterGray};
  border-radius: 60px;
  column-gap: 4px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 34px;
  padding: 4px;
`

const Button = styled.button<{ isActive: boolean }>`
  align-items: center;
  background-color: ${({ isActive, theme: { colors } }) =>
    isActive ? '#fff' : colors.lighterGray};
  border-radius: 20px;
  border: none;
  color: ${({ theme: { colors } }) => colors.darkishGray};
  cursor: pointer;
  display: flex;
  font-size: 1.3rem;
  font-weight: 400;
  height: 100%;
  justify-content: center;
  line-height: 1.2;
  min-width: fit-content;
  padding: 0 12px;
  transition: background-color 0.25s ease-in-out;
  user-select: none;

  &:active {
    background-color: #fff;
    opacity: 0.4;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      pointer-events: none;
    `}
`

const Text = styled.span`
  color: ${({ theme: { colors } }) => colors.darkishGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  text-align: right;
`

export const TabToggle: React.FC<{
  disabled?: boolean
  isToggled?: boolean
  onChange?: (isToggled: boolean) => void
  toggleOptions: {
    toggledButton: string | React.ReactNode
    toggledText: string | React.ReactNode
    untoggledButton: string | React.ReactNode
    untoggledText: string | React.ReactNode
  }
}> = ({ disabled = false, isToggled, onChange, toggleOptions }) => {
  const [toggled, setToggled] = useState<boolean>(isToggled ?? false)
  const { toggledButton, toggledText, untoggledButton, untoggledText } = toggleOptions

  useEffect(() => {
    if (!disabled && onChange) {
      onChange(toggled)
    }
  }, [disabled, onChange, toggled])

  useEffect(() => {
    if (isToggled !== undefined) {
      setToggled((prevState) => (prevState !== isToggled ? isToggled : prevState))
    }
  }, [isToggled])

  return (
    <>
      <Buttons>
        <Button
          disabled={disabled}
          isActive={!toggled}
          onClick={() => (!toggled ? undefined : setToggled(false))}
        >
          {untoggledButton}
        </Button>
        <Button
          disabled={disabled}
          isActive={toggled}
          onClick={() => (toggled ? undefined : setToggled(true))}
        >
          {toggledButton}
        </Button>
      </Buttons>
      <Text>{toggled ? toggledText : untoggledText} </Text>
    </>
  )
}
