import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { BaseButton } from '@/src/components/buttons/Button'
import { DropdownDirection, DropdownPosition } from '@/src/components/dropdown/Dropdown'
import {
  Item,
  NoResults,
  SearchIcon,
  Textfield,
  TextfieldContainer,
  Wrapper,
} from '@/src/components/dropdown/DropdownElements'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { useTokensLists } from '@/src/hooks/useTokensLists'
import { Token } from '@/types/token'

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
