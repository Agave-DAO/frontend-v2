import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { Icon } from '@/src/components/asset/Icon'
import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown as BaseDropdown, DropdownItem } from '@/src/components/dropdown/Dropdown'
import { TokenWithType } from '@/src/config/agaveTokens'
import { useTokensLists } from '@/src/hooks/useTokensLists'
import { Token } from '@/types/token'

const Wrapper = styled.div`
  align-items: center;
  column-gap: 15px;
  display: flex;
`

const Dropdown = styled(BaseDropdown)`
  .dropdownItems {
    max-height: 340px;
    overflow: auto;
  }
`

const Button = styled.button`
  align-items: center;
  background: transparent;
  border: none;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 15px;
  cursor: pointer;
  display: flex;
  font-family: ${({ theme: { fonts } }) => fonts.family};
  font-size: 2.4rem;
  font-weight: 700;
  padding: 0;

  &:active {
    opacity: 0.7;
  }
`

const ButtonText = styled.span``

export const TokenDropdown: React.FC<{
  activeTokenSymbol?: string
  onChange?: (token: Token | null) => void
}> = ({ activeTokenSymbol = '', onChange, ...restProps }) => {
  const { onSelectToken, tokensList } = useTokensLists({
    includeFrozen: false,
    types: ['reserve'],
    onChange,
  })
  const [currentToken, setCurrentToken] = useState<string>(activeTokenSymbol)

  const onSelect = useCallback(
    (token: TokenWithType) => {
      onSelectToken(token)
      setCurrentToken(token.symbol)
    },
    [onSelectToken],
  )

  useMemo(() => {
    setCurrentToken(activeTokenSymbol)
  }, [activeTokenSymbol])

  return (
    <Wrapper {...restProps}>
      {currentToken && <Icon dimensions={40} symbol={currentToken} />}
      <Dropdown
        dropdownButton={
          <Button>
            <ButtonText>{currentToken ? currentToken : 'Select token'}</ButtonText>
            <ChevronDown />
          </Button>
        }
        items={tokensList.map((item, index) => (
          <DropdownItem
            key={index}
            onClick={() => {
              onSelect(item)
            }}
          >
            {item.symbol}
          </DropdownItem>
        ))}
      />
    </Wrapper>
  )
}
