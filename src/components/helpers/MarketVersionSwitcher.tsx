import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'

import { ChevronDown } from '@/src/components/assets/ChevronDown'
import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { MarketVersions } from '@/src/contracts/contracts'
import { useMarketVersion } from '@/src/hooks/useMarketVersion'

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

export const MarketVersionSwitcher = () => {
  const router = useRouter()
  const [marketVersion, setMarketVersion] = useMarketVersion()

  const handleVersionChange = (version: MarketVersions) => {
    setMarketVersion(version)
    router.push(
      {
        query: {
          ...router.query,
          marketVersion: version,
        },
      },
      undefined,
    )
  }

  return (
    <>
      <Dropdown
        dropdownButton={
          <Button>
            <span style={{ textTransform: 'capitalize' }}>{marketVersion} market</span>
            <ChevronDown />
          </Button>
        }
        items={Object.values(MarketVersions).map((item) => (
          <DropdownItem
            key={item}
            onClick={() => {
              handleVersionChange(item)
            }}
          >
            <span style={{ textTransform: 'capitalize' }}>{item} market</span>
          </DropdownItem>
        ))}
      />
    </>
  )
}
