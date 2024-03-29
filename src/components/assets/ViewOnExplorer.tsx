import { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { ButtonMini } from '@/src/components/buttons/ButtonMini'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { chainsConfig } from '@/src/config/web3'
import { useTokenInfo } from '@/src/hooks/useTokenInfo'

const Container = styled.div<StyleProps>`
  position: relative;
  display: flex;
  height: ${({ small }) => (small ? '23px' : '30px')};
  background-color: ${({ minimal }) => (minimal ? 'transparent' : '#0d20264a')};
  border-radius: 15px;

  &:hover {
    background-color: ${({ hover }) => (hover ? '#0d202650' : '')};
  }
`

const Wrapper = styled(Container)<StyleProps>`
  background-color: transparent;
`

const SVGButton = styled(ButtonMini)<StyleProps>`
  align-items: center;
  justify-content: center;
  height: ${({ small }) => (small ? '23px' : '30px')};
  width: ${({ small }) => (small ? '23px' : '30px')};
  padding: 0;
  position: relative;
  border-radius: 15px;
  background-color: ${({ hover, minimal, theme }) =>
    minimal ? 'transparent' : hover ? '#0b464f' : theme.buttonMini.dark.backgroundColor};
`
const TextButton = styled.button<StyleProps>`
  height: ${({ small }) => (small ? '23px' : '30px')};
  padding: 0 10px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  cursor: pointer;
  background-color: transparent;
  color: #ffffff;
  margin: ${({ minimal }) => (minimal ? '1px 0 0 0' : '0px')};
`

interface ViewOnExplorerProps extends HTMLAttributes<SVGElement>, StyleProps {
  symbol: string
  text?: string
}

interface StyleProps {
  hover?: boolean
  minimal?: boolean
  small?: boolean
  tooltip?: boolean
}

function useStyleProps({ hover, minimal, small, tooltip }: StyleProps) {
  return { hover, minimal, small, tooltip }
}

export const ViewIcon: React.FC<StyleProps> = ({ small }) => {
  return (
    <svg
      fill="none"
      height={small ? '10' : '15'}
      viewBox="0 0 9 9"
      width={small ? '10' : '16'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clipRule="evenodd"
        d="M1.86663 2.49995C1.76054 2.49995 1.6588 2.54209 1.58378 2.61711C1.50877 2.69212 1.46663 2.79386 1.46663 2.89995V7.29995C1.46663 7.40604 1.50877 7.50778 1.58378 7.58279C1.6588 7.65781 1.76054 7.69995 1.86663 7.69995H6.26663C6.37271 7.69995 6.47445 7.65781 6.54947 7.58279C6.62448 7.50778 6.66663 7.40604 6.66663 7.29995V4.89995C6.66663 4.67904 6.84571 4.49995 7.06663 4.49995C7.28754 4.49995 7.46663 4.67904 7.46663 4.89995V7.29995C7.46663 7.61821 7.3402 7.92344 7.11515 8.14848C6.89011 8.37352 6.58489 8.49995 6.26663 8.49995H1.86663C1.54837 8.49995 1.24314 8.37352 1.0181 8.14848C0.793054 7.92344 0.666626 7.61821 0.666626 7.29995V2.89995C0.666626 2.58169 0.793054 2.27647 1.0181 2.05142C1.24314 1.82638 1.54837 1.69995 1.86663 1.69995H4.26663C4.48754 1.69995 4.66663 1.87904 4.66663 2.09995C4.66663 2.32087 4.48754 2.49995 4.26663 2.49995H1.86663Z"
        fill="#F0F4F4"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M5.4668 0.9C5.4668 0.679086 5.64588 0.5 5.8668 0.5H8.2668C8.48771 0.5 8.6668 0.679086 8.6668 0.9V3.3C8.6668 3.52091 8.48771 3.7 8.2668 3.7C8.04588 3.7 7.8668 3.52091 7.8668 3.3V1.3H5.8668C5.64588 1.3 5.4668 1.12091 5.4668 0.9Z"
        fill="#F0F4F4"
        fillRule="evenodd"
      />
      <path
        clipRule="evenodd"
        d="M8.54964 0.617157C8.70585 0.773367 8.70585 1.02663 8.54964 1.18284L4.14964 5.58284C3.99343 5.73905 3.74016 5.73905 3.58395 5.58284C3.42774 5.42663 3.42774 5.17337 3.58395 5.01716L7.98396 0.617157C8.14016 0.460948 8.39343 0.460948 8.54964 0.617157Z"
        fill="#F0F4F4"
        fillRule="evenodd"
      />
    </svg>
  )
}

export const ViewOnExplorer: React.FC<ViewOnExplorerProps> = ({
  className,
  symbol,
  text,
  ...props
}) => {
  const styleProps = useStyleProps(props)
  const token = useTokenInfo(symbol)

  const viewOnExplorer = () => {
    if (token) {
      const url = chainsConfig['100'].blockExplorerUrls[0] + 'address/' + token.address
      window.open(url, '_blank')
    }
  }

  function renderContainer() {
    return (
      <Container {...styleProps}>
        <SVGButton className={className} onClick={viewOnExplorer} {...styleProps}>
          <ViewIcon {...styleProps} />
        </SVGButton>
        {text ? (
          <TextButton onClick={viewOnExplorer} {...styleProps}>
            {text}
          </TextButton>
        ) : null}
      </Container>
    )
  }

  return (
    <Wrapper {...styleProps}>
      {styleProps.tooltip ? (
        <Tooltip content={`View ${symbol} on explorer`}>{renderContainer()}</Tooltip>
      ) : (
        renderContainer()
      )}
    </Wrapper>
  )
}
