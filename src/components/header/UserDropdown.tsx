import { useState } from 'react'
import styled from 'styled-components'

import { Link as BaseLink } from '@/src/components/assets/Link'
import { Logout } from '@/src/components/assets/Logout'
import { SwitchNetwork } from '@/src/components/assets/SwitchNetwork'
import { User } from '@/src/components/assets/User'
import { DropdownPosition } from '@/src/components/common/Dropdown'
import { Dropdown } from '@/src/components/header/Helpers'
import { ModalSwitchNetwork } from '@/src/components/helpers/ModalSwitchNetwork'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/strings'

const Wrapper = styled(Dropdown)`
  .dropdownButton {
    padding: 0;
  }

  .dropdownItems {
    width: 170px;
  }
`

const Item = styled.div`
  align-items: center;
  background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColor};
  border-bottom: 1px solid ${({ theme: { dropdown } }) => dropdown.item.borderColor};
  color: ${({ theme: { dropdown } }) => dropdown.item.color};
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  font-size: 1.2rem;
  font-weight: 400;
  justify-content: space-between;
  line-height: 1.2;
  overflow: hidden;
  padding: 8px 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  &:hover {
    background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColorHover};
  }

  &:last-child {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-bottom: none;
  }

  path.fill {
    fill: ${({ theme: { dropdown } }) => dropdown.item.color};
  }
`

const ItemDirectionColumn = styled(Item)`
  align-items: flex-start;
  flex-direction: column;
`

const ItemTitle = styled.span`
  font-weight: 700;
`

const AddressRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Link = styled(BaseLink)`
  .fill {
    fill: #fff;
  }
`

const UserButton = styled.button`
  --dimensions: 30px;

  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  height: var(--dimensions);
  position: relative;
  width: var(--dimensions);

  .user {
    position: relative;
    z-index: 1;
  }
`

const SmallCircle = styled.div<{ state?: 'ok' | 'error' }>`
  --ball-dimensions: 10px;

  background-color: ${({ state, theme: { colors } }) =>
    state === 'ok' ? colors.ok : colors.error};
  border-radius: 50%;
  bottom: 0;
  height: var(--ball-dimensions);
  left: 0;
  position: absolute;
  width: var(--ball-dimensions);
  z-index: 5;
`

SmallCircle.defaultProps = { state: 'error' }

export const UserDropdown: React.FC = ({ ...restProps }) => {
  const { address, disconnectWallet, getExplorerUrl, isWalletNetworkSupported } =
    useWeb3Connection()
  const [showNetworkModal, setShowNetworkModal] = useState(false)

  return (
    <>
      <Wrapper
        dropdownButton={
          <UserButton>
            <User />
            <SmallCircle state={isWalletNetworkSupported ? 'ok' : 'error'} />
          </UserButton>
        }
        dropdownPosition={DropdownPosition.right}
        items={[
          <ItemDirectionColumn
            key="0"
            onClick={() => window.open(getExplorerUrl(address || ''), '_blank')}
          >
            <ItemTitle>Connected</ItemTitle>{' '}
            <AddressRow>
              {address ? (
                <>
                  {truncateStringInTheMiddle(address, 10, 8)} <Link />
                </>
              ) : (
                'Error'
              )}
            </AddressRow>
          </ItemDirectionColumn>,
          <Item key="1" onClick={() => setShowNetworkModal(true)}>
            <span>Switch network</span>
            <SwitchNetwork />
          </Item>,
          <Item key="2" onClick={disconnectWallet}>
            <span>Log out</span> <Logout />
          </Item>,
        ]}
        {...restProps}
      />
      {showNetworkModal && <ModalSwitchNetwork onClose={() => setShowNetworkModal(false)} />}
    </>
  )
}
