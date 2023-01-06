import { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.svg`
  height: 20px;
  width: 20px;

  .fill {
    fill: ${({ theme }) => theme.header.color};
  }
  .stroke {
    stroke: ${({ theme }) => theme.header.color};
  }
`

export const Notifications: React.FC<HTMLAttributes<SVGElement>> = ({
  className,
  ...restProps
}) => (
  <Wrapper
    className={`notifications ${className}`}
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      className="fill stroke"
      d="M16.6 13.4l-.7-1.1c-.2-.4-.3-.8-.4-1.2l-.3-3.9C15 5 13.5 3.1 11.4 2.4c-.2-.6-.8-1-1.4-1-.6 0-1.2.4-1.4 1-2.1.8-3.6 2.7-3.8 4.8l-.3 3.9c-.1.4-.2.8-.4 1.2l-.7 1.1c-.5.6-.4 1.6.2 2.1.3.3.8.4 1.2.4h10.4c.8.1 1.6-.4 1.7-1.2.1-.5-.1-.9-.3-1.3h0zm-.5 1.4c-.1.2-.4.3-.8.3H4.8c-.3 0-.7-.1-.9-.4-.1-.3 0-.7.2-.9l.7-1.1c.3-.5.4-1 .5-1.5l.3-3.9c.2-2 1.6-3.6 3.4-4.2.1 0 .2-.2.3-.3.1-.3.4-.5.7-.5.4 0 .7.2.7.6 0 .1.1.3.3.3 1.9.6 3.2 2.2 3.4 4.2l.3 3.9c.1.5.2 1 .5 1.5l.7 1.1c.2.2.3.6.2.9h0zm-4 2c-.1.2-1 1.7-2.1 1.7S8 17 7.9 16.8c-.1-.2 0-.4.2-.5.2-.1.4 0 .5.1.3.4.9 1.3 1.5 1.3s1.2-.9 1.5-1.3c.1-.2.3-.2.5-.1.1.1.1.3 0 .5z"
      stroke="#000"
      strokeMiterlimit="10"
      strokeWidth=".5"
    />
  </Wrapper>
)
