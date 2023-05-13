import styled from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { Magnifier } from '@/src/components/assets/Magnifier'
import { Dropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'

export const Wrapper = styled(Dropdown)`
  --inner-padding: var(--padding-md);
  --border-radius: 16px;

  .dropdownItems {
    background-color: ${({ theme: { colors } }) => colors.almostWhite};
    max-height: 290px;
    overflow: auto;
    padding: 0 1px;
    width: 330px;
  }
`

export const TextfieldContainer = styled.div<{ closeOnClick?: boolean }>`
  background-color: ${({ theme: { colors } }) => colors.almostWhite};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.lighterGray};
  padding: var(--inner-padding);
  position: sticky;
  top: 0;
  z-index: 1;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Textfield: any = styled(DebounceInput)`
  background-color: ${({ theme: { colors } }) => colors.lightGrayUltra};
  border-radius: var(--border-radius);
  border: none;
  color: ${({ theme: { colors } }) => colors.darkestGray};
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 1.4rem;
  font-weight: 400;
  height: 49px;
  max-width: 100%;
  padding-bottom: var(--padding-md);
  padding-left: var(--padding-md);
  padding-right: 40px;
  padding-top: var(--padding-md);
  position: relative;
  width: 100%;
  z-index: 1;

  &::placeholder {
    color: ${({ theme: { colors } }) => colors.darkGray};
  }
`

export const Item = styled(DropdownItem)`
  border: none;
  color: ${({ theme: { colors } }) => colors.darkestGray};
  font-size: 1.4rem;
  font-weight: 400;
  height: 60px;
  padding-left: var(--padding-md);
  padding-right: var(--padding-md);

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.lightGrayUltra};
  }
`

export const SearchIcon = styled(Magnifier)`
  position: absolute;
  right: calc(var(--padding-md) * 2);
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  path {
    fill: ${({ theme: { colors } }) => colors.darkestGray};
  }
`

export const NoResults = styled.div<{ closeOnClick?: boolean }>`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.secondary};
  display: flex;
  font-size: 1.5rem;
  font-weight: 500;
  height: 80px;
  justify-content: center;
  line-height: 1.2;
  padding: var(--inner-padding);
`
