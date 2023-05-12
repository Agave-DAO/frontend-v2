import styled from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Magnifier } from '@/src/components/assets/Magnifier'
import { BaseButton } from '@/src/components/buttons/Button'
import {
  Dropdown,
  DropdownDirection,
  DropdownItem,
  DropdownPosition,
} from '@/src/components/dropdown/Dropdown'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useTokensLists } from '@/src/hooks/useTokensLists'
import { Token } from '@/types/token'

const Wrapper = styled(Dropdown)`
  --inner-padding: 16px;

  .dropdownItems {
    background-color: ${({ theme: { colors } }) => colors.almostWhite};
    max-height: 290px;
    overflow: auto;
    padding: 0 1px;
    width: 330px;
  }
`

const TextfieldContainer = styled.div<{ closeOnClick?: boolean }>`
  background-color: ${({ theme: { colors } }) => colors.almostWhite};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.lighterGray};
  padding: var(--inner-padding);
  position: sticky;
  top: 0;
  z-index: 1;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled(DebounceInput)`
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
  padding-bottom: var(--padding);
  padding-left: var(--padding);
  padding-right: 40px;
  padding-top: var(--padding);
  position: relative;
  width: 100%;
  z-index: 1;

  &::placeholder {
    color: ${({ theme: { colors } }) => colors.darkGray};
  }
`

const Item = styled(DropdownItem)`
  border: none;
  color: ${({ theme: { colors } }) => colors.darkestGray};
  font-size: 1.4rem;
  font-weight: 400;
  height: 60px;
  padding-left: var(--padding);
  padding-right: var(--padding);

  &:hover {
    background-color: ${({ theme: { colors } }) => colors.lightGrayUltra};
  }
`

const SearchIcon = styled(Magnifier)`
  position: absolute;
  right: calc(var(--padding) * 2);
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;

  path {
    fill: ${({ theme: { colors } }) => colors.darkestGray};
  }
`

const Value = styled.span`
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

const Chevron = styled(ChevronDown)`
  path {
    fill: ${({ theme: { colors } }) => colors.secondary};
  }
`

const NoResults = styled.div<{ closeOnClick?: boolean }>`
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

export const TokenDropdownSearch: React.FC<{
  dropdownDirection?: DropdownDirection
  onChange?: (token: Token | null) => void
  selectedToken?: Token | null
}> = ({
  onChange,
  selectedToken,
  dropdownDirection = DropdownDirection.downwards,
  ...restProps
}) => {
  const { onSearch, onSelectToken, searchString, token, tokensList } = useTokensLists(
    ['reserve'],
    onChange,
  )

  const currentToken = selectedToken || token

  return (
    <Wrapper
      dropdownButton={
        <BaseButton className="button">
          {currentToken && <TokenIcon symbol={currentToken.symbol} />}
          <Value>{currentToken ? currentToken.symbol : 'Select a token...'}</Value>
          <Chevron />
        </BaseButton>
      }
      dropdownDirection={dropdownDirection}
      dropdownPosition={DropdownPosition.right}
      items={[
        <TextfieldContainer closeOnClick={false} key="tokenSearchInput">
          <Textfield
            debounceTimeout={300}
            onChange={(e: { target: { value: string } }) => onSearch(e.target.value)}
            placeholder="Search asset..."
            type="search"
            value={searchString}
          />
          <SearchIcon />
        </TextfieldContainer>,
        ...tokensList.map((item, index) => (
          <Item
            key={index}
            onClick={() => {
              onSelectToken(item)
            }}
          >
            <TokenIcon dimensions={32} symbol={item.symbol} />
            {item.symbol}
          </Item>
        )),
        tokensList.length === 0 ? (
          <NoResults closeOnClick={false}>
            <strong>{searchString}</strong>&nbsp;not found.
          </NoResults>
        ) : (
          <></>
        ),
      ]}
      {...restProps}
    />
  )
}
