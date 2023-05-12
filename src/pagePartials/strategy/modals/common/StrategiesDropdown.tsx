import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { CollateralSwap } from '@/src/components/assets/CollateralSwap'
import { Long } from '@/src/components/assets/Long'
import { Short } from '@/src/components/assets/Short'
import {
  Item,
  NoResults,
  SearchIcon,
  Textfield,
  TextfieldContainer,
  Wrapper,
} from '@/src/components/dropdown/DropdownElements'
import { Strategy } from '@/types/strategy'

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

export const StrategiesDropdown: React.FC<{
  onChange: (strategy: Strategy) => void
  strategy: Strategy
}> = ({ onChange, strategy, ...restProps }) => {
  const [searchString, setSearchString] = useState<string | undefined>(undefined)
  const [currentStrategy, setCurrentStrategy] = useState<Strategy>(strategy)
  const items = useMemo(
    () =>
      [
        { name: 'Collateral Swap', icon: <CollateralSwap />, type: 'collateralSwap' },
        { name: 'Long', icon: <Long />, type: 'long' },
        { name: 'Short', icon: <Short />, type: 'short' },
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
    <Wrapper
      dropdownButton={
        <button>
          <Value>
            {getCurrentStrategy[0].icon} {getCurrentStrategy[0].name}
          </Value>
          <Chevron />
        </button>
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
