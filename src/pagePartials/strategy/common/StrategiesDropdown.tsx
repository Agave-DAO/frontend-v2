import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { CollateralSwap } from '@/src/components/assets/CollateralSwap'
import { Long } from '@/src/components/assets/Long'
import { Short } from '@/src/components/assets/Short'
import {
  Item as BaseItem,
  NoResults,
  SearchIcon,
  Textfield,
  TextfieldContainer,
  Wrapper,
} from '@/src/components/dropdown/DropdownElements'
import { Strategy } from '@/types/strategy'

const Dropdown = styled(Wrapper)`
  margin: 0 0 16px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    margin-bottom: 32px;
  }
`

const Item = styled(BaseItem)`
  svg {
    --size: 32px;

    height: var(--size);
    width: var(--size);

    rect {
      fill: ${({ theme: { colors } }) => colors.secondary};
    }

    path {
      fill: ${({ theme: { colors } }) => colors.accent};
    }
  }
`

const Button = styled.button`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.mainDark4};
  border-radius: 16px;
  border: none;
  column-gap: 10px;
  cursor: pointer;
  display: flex;
  filter: drop-shadow(0 51px 80px rgba(0, 0, 0, 0.17))
    drop-shadow(0 19.6444px 25.4815px rgba(0, 0, 0, 0.103259))
    drop-shadow(0 4.15556px 6.51852px rgba(0, 0, 0, 0.0667407));
  height: 62px;
  justify-content: space-between;
  padding: 0 var(--padding-xl) 0 var(--padding-md);
  width: 100%;

  &:hover {
    filter: drop-shadow(0 51px 80px rgba(0, 0, 0, 0.2))
      drop-shadow(0 19.6444px 25.4815px rgba(0, 0, 0, 0.2))
      drop-shadow(0 4.15556px 6.51852px rgba(0, 0, 0, 0.1));
    height: 62px;
  }

  &:active {
    opacity: 0.7;
  }

  svg {
    rect {
      fill: none;
    }

    path {
      fill: ${({ theme: { colors } }) => colors.accent};
    }
  }
`

const Value = styled.span`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 0;
  display: flex;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1.2;
`

const Chevron = styled(ChevronDown)`
  path {
    fill: ${({ theme: { colors } }) => colors.textColor};
  }
`

export const StrategiesDropdown: React.FC<{
  onChange: (strategy: Strategy) => void
  strategy: Strategy
}> = ({ onChange, strategy, ...restProps }) => {
  const [searchString, setSearchString] = useState<string | undefined>(undefined)
  const [currentStrategy, setCurrentStrategy] = useState<Strategy>(strategy)
  const items = useMemo(
    () =>
      [
        { name: 'Long', icon: <Long />, type: 'long' },
        { name: 'Short', icon: <Short />, type: 'short' },
        { name: 'Collateral Swap', icon: <CollateralSwap />, type: 'collateralSwap' },
      ] as const,
    [],
  )

  const filteredItems = useMemo(
    () =>
      searchString
        ? items.filter(({ name }) => {
            return name.toUpperCase().indexOf(searchString.toUpperCase()) >= 0
          })
        : items,
    [items, searchString],
  )

  const onSearch = useCallback((search: string | undefined) => {
    setSearchString(search)
  }, [])

  const getCurrentStrategy = useMemo(() => {
    return items.filter((item) => item.type === currentStrategy)
  }, [currentStrategy, items])

  useEffect(() => {
    setCurrentStrategy(strategy)
  }, [strategy])

  const onSelectStrategy = (strategy: Strategy) => {
    setCurrentStrategy(strategy)
    onChange(strategy)
  }

  return (
    <Dropdown
      dropdownButton={
        <Button>
          <Value>
            {getCurrentStrategy[0].icon} {getCurrentStrategy[0].name}
          </Value>
          <Chevron />
        </Button>
      }
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
        ...filteredItems.map((item, index) => (
          <Item
            key={index}
            onClick={() => {
              onSelectStrategy(item.type)
            }}
          >
            {item.icon}
            {item.name}
          </Item>
        )),
        filteredItems.length === 0 ? (
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
