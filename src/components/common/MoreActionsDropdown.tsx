import styled from 'styled-components'

import { MoreActionsButton, Size, Variant } from '@/src/components/buttons/MoreActionsButton'
import { Dropdown, DropdownItem, Props as DropdownProps } from '@/src/components/common/Dropdown'

export const Wrapper = styled.div``

interface Props extends DropdownProps {
  items: Array<{ text: string; onClick: () => void }>
  size?: Size
  variant?: Variant
}

export const MoreActionsDropdown: React.FC<Props> = ({ items, size, variant, ...restProps }) => {
  return (
    <Dropdown
      dropdownButton={
        <MoreActionsButton size={size} variant={variant}>
          More actions
        </MoreActionsButton>
      }
      items={items.map((item, index) => (
        <DropdownItem key={`menu_${index}`} onClick={item.onClick}>
          {item.text}
        </DropdownItem>
      ))}
      {...restProps}
    />
  )
}
