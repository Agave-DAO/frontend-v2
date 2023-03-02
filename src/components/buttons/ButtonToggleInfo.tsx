import { ButtonHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.button<{ isOpen?: boolean }>`
  --button-size: 23px;

  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.mainDark3};
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--button-size);
  justify-content: center;
  padding: 0;
  position: relative;
  transition: all 0.15s linear;
  user-select: none;
  width: var(--button-size);

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.mainDark4};
  }

  &:active {
    opacity: 0.7;
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      background-color: ${({ theme: { colors } }) => colors.mainDark4};

      .line2 {
        transform: translate(-50%, -50%) rotate(0deg);
      }
    `}
`

const Line = styled.div`
  background-color: ${({ theme: { colors } }) => colors.primary};
  border-radius: 2px;
  display: block;
  height: 1px;
  left: 0;
  left: 50%;
  position: absolute;
  top: 50%;
  transition: all 0.25s linear;
  user-select: none;
  width: 9px;
`

const Line1 = styled(Line)`
  transform: translate(-50%, -50%);
`

Line1.defaultProps = {
  className: 'line2',
}

const Line2 = styled(Line)`
  transform: translate(-50%, -50%) rotate(90deg);
`

Line2.defaultProps = {
  className: 'line2',
}

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isOpen?: boolean
}

export const ButtonToggleInfo: React.FC<Props> = ({ isOpen, ...restProps }) => (
  <Wrapper isOpen={isOpen} {...restProps}>
    <Line1 />
    <Line2 />
  </Wrapper>
)
