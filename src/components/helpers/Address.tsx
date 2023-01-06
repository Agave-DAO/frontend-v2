import { useState } from 'react'
import styled from 'styled-components'

import { Toast, toast } from 'react-hot-toast'

import { Copy } from '@/src/components/assets/Copy'
import { Link } from '@/src/components/assets/Link'
import { ToastComponent } from '@/src/components/toast/ToastComponent'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/strings'

const Wrapper = styled.span`
  align-items: center;
  column-gap: 8px;
  display: flex;
`

const ExternalLink = styled.a`
  color: ${({ theme: { colors } }) => colors.textColor};
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }

  &:active {
    opacity: 0.7;
  }
`

ExternalLink.defaultProps = {
  className: 'externalLink',
  rel: 'noopener noreferrer',
  target: '_blank',
}

const CopyButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;

  &:active {
    opacity: 0.7;
  }
`

interface Props {
  address: string
  showExternalLink?: boolean
  showCopyButton?: boolean
}

export const Address: React.FC<Props> = ({
  address,
  showCopyButton = true,
  showExternalLink = true,
  ...restProps
}) => {
  const { getExplorerUrl } = useWeb3Connection()
  const [toastId, setToastId] = useState('')

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast.remove(toastId)
    toast.custom(
      (t: Toast) => {
        setToastId(t.id)
        return <ToastComponent message={'Address copied'} t={t} />
      },
      {
        duration: 1000,
        position: 'top-right',
      },
    )
  }

  return (
    <Wrapper {...restProps}>
      <ExternalLink href={getExplorerUrl(address)}>
        {truncateStringInTheMiddle(address, 8, 6)}
      </ExternalLink>
      {showCopyButton && (
        <CopyButton onClick={() => copyAddress(address)}>
          <Copy />
        </CopyButton>
      )}
      {showExternalLink && (
        <ExternalLink href={getExplorerUrl(address)}>
          <Link />
        </ExternalLink>
      )}
    </Wrapper>
  )
}
