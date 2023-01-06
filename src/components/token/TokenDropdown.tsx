import styled from 'styled-components'

import { DebounceInput } from 'react-debounce-input'

import { ButtonDropdown } from '@/src/components/buttons/Button'
import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { TextfieldCSS } from '@/src/components/form/Textfield'
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

const Button = styled(ButtonDropdown)`
  > span {
    flex-shrink: 0;
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
  ${TextfieldCSS};

  flex-shrink: 0;
  max-width: 100%;
  width: auto;
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

export const TokenDropdown: React.FC<{ onChange?: (token: Token | null) => void }> = ({
  onChange,
  ...restProps
}) => {
  const { onSelectToken, searchString, setSearchString, token, tokensList } =
    useTokensLists(onChange)

  return (
    <Wrapper
      dropdownButton={
        <Button>
          {token && <TokenIcon symbol={token.symbol} />}
          {token ? token.symbol : 'Select a token...'}
        </Button>
      }
      items={[
        <TextfieldContainer closeOnClick={false} key="tokenSearchInput">
          <Textfield
            debounceTimeout={300}
            onChange={(e: { target: { value: string } }) => setSearchString(e.target.value)}
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

export default TokenDropdown
