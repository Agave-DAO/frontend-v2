import styled from 'styled-components'

import { MoreActionsButton } from '@/src/components/buttons/MoreActionsButton'
import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'

export const Wrapper = styled.div``

export const MoreActionsDropdown: React.FC<{
  items: Array<{ text: string; onClick: () => void }>
}> = ({ items, ...restProps }) => {
  return (
    <Dropdown
      dropdownButton={<MoreActionsButton>More actions</MoreActionsButton>}
      items={items.map((item, index) => (
        <DropdownItem key={`menu_${index}`} onClick={item.onClick}>
          {item.text}
        </DropdownItem>
      ))}
      {...restProps}
    />
  )
}
