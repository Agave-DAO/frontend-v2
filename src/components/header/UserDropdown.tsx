import styled from 'styled-components'

import { Logout } from '@/src/components/assets/Logout'
import { ButtonPrimary } from '@/src/components/buttons/Button'
import {
  Dropdown as BaseDropdown,
  DropdownPosition,
  ItemProps,
} from '@/src/components/common/Dropdown'
import { useWeb3Connection } from '@/src/providers/web3ConnectionProvider'
import { truncateStringInTheMiddle } from '@/src/utils/strings'

const Wrapper = styled(BaseDropdown)`
  .dropdownButton {
    padding: 0;
  }

  .dropdownItems {
    --border-radius: 4px;

    background-color: ${({ theme: { colors } }) => colors.black};
    border-radius: var(--border-radius);
    border: none;
    padding: 0;
    width: 180px;
  }
`

const Button = styled(ButtonPrimary)`
  background-color: ${({ theme: { colors } }) => colors.black};
  padding-left: 16px;
  padding-right: 16px;
  white-space: nowrap;
`

const Item = styled.div<ItemProps>`
  align-items: center;
  border-bottom: 1px solid
    ${({
      theme: {
        dropdown: { item },
      },
    }) => item.borderColor};
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  font-size: 1.5rem;
  font-weight: 400;
  justify-content: space-between;
  line-height: 1.2;
  overflow: hidden;
  padding: 8px 12px;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:first-child {
    border-top-left-radius: var(--border-radius);
    border-top-right-radius: var(--border-radius);
  }

  &:last-child {
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-bottom: none;
  }

  path.fill {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const UserDropdown: React.FC = ({ ...restProps }) => {
  const { address, disconnectWallet } = useWeb3Connection()

  return (
    <Wrapper
      dropdownButton={
        <Button>{address ? truncateStringInTheMiddle(address, 5, 3) : 'Error'}</Button>
      }
      dropdownPosition={DropdownPosition.right}
      items={[
        <Item key="pickleRick" onClick={disconnectWallet}>
          <span>Log out</span> <Logout />
        </Item>,
      ]}
      {...restProps}
    />
  )
}
