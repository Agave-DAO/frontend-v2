import styled from 'styled-components'

import { Link } from '@/src/components/assets/Link'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.a`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:active {
    opacity: 0.7;
  }
`

Wrapper.defaultProps = {
  className: 'externalLink',
  rel: 'noopener noreferrer',
  target: '_blank',
}

interface Props {
  address: string
  text?: string
}

export const GoToExplorer: React.FC<Props> = ({
  address,
  text = 'Go to Explorer',
  ...restProps
}) => {
  const { getExplorerUrl } = useWeb3Connection()

  return (
    <Wrapper href={getExplorerUrl(address)} {...restProps}>
      {text}
      <Link />
    </Wrapper>
  )
}
