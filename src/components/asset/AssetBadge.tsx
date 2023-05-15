import styled from 'styled-components'

import { Strategy } from '@/types/strategy'

export type AssetType = Strategy | 'neutral' | undefined

const getColor = (colors: any, type?: AssetType) => {
  return type === 'long'
    ? colors.primaryUltraLight
    : type === 'short'
    ? colors.errorLight
    : type === 'collateralSwap'
    ? colors.accentDark
    : type === 'neutral'
    ? colors.secondary
    : colors.mainDark3
}

export const AssetBadge = styled.div<{ type?: AssetType }>`
  align-items: center;
  background-color: ${({ theme: { colors }, type }) => getColor(colors, type)};
  border-radius: 6px;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.2rem;
  font-weight: 400;
  height: 21px;
  line-height: 1.2;
  margin-left: auto;
  padding: 0 8px;
  text-transform: capitalize;
`
