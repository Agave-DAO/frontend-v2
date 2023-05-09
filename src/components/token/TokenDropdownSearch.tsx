import styled from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
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
  --inner-padding: 8px;

  .dropdownItems {
    max-height: 340px;
    overflow: auto;
  }
`

const TextfieldContainer = styled.div<{ closeOnClick?: boolean }>`
  background-color: ${({ theme }) => theme.dropdown.background};
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.borderColor};
  padding: var(--inner-padding);
  position: sticky;
  top: 0;
  z-index: 1;
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Textfield: any = styled(DebounceInput)`
  flex-shrink: 0;
  max-width: 100%;
  width: auto;
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
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.3rem;
  font-weight: 500;
  height: 80px;
  justify-content: center;
  line-height: 1.2;
  padding: var(--inner-padding);
`

export const TokenDropdownSearch: React.FC<{
  onChange?: (token: Token | null) => void
  selectedToken?: Token | null
}> = ({ onChange, selectedToken, ...restProps }) => {
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
      dropdownDirection={DropdownDirection.upwards}
      dropdownPosition={DropdownPosition.right}
      items={[
        <TextfieldContainer closeOnClick={false} key="tokenSearchInput">
          <Textfield
            debounceTimeout={300}
            onChange={(e: { target: { value: string } }) => onSearch(e.target.value)}
            placeholder="Search token..."
            type="search"
            value={searchString}
          />
        </TextfieldContainer>,
        ...tokensList.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => {
              onSelectToken(item)
            }}
          >
            <TokenIcon symbol={item.symbol} />
            {item.symbol}
          </DropdownItem>
        )),
        tokensList.length === 0 ? <NoResults closeOnClick={false}>Not found.</NoResults> : <></>,
      ]}
      {...restProps}
    />
  )
}
