import { useState } from 'react'
import styled, { css } from 'styled-components'

import { Head, HeadContents } from '@/src/components/asset/Asset'
import { AssetBadge } from '@/src/components/asset/AssetBadge'
import { HeadInnerCollapsable } from '@/src/components/asset/HeadInnerCollapsable'
import { Icon } from '@/src/components/asset/Icon'
import { ButtonToggleInfo } from '@/src/components/buttons/ButtonToggleInfo'

const iconDimensions = 36

const Wrapper = styled(Head)`
  flex-wrap: wrap;
  padding-bottom: 16px;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
`

const OverlappingIcon = styled(Icon)`
  margin-left: -${iconDimensions / 2}px;
`

const Badges = styled.div`
  display: flex;
  flex-direction: column;
`

const Controls = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const Collapsable = styled(HeadInnerCollapsable)`
  --container-height: 165px;

  border: none;

  ${({ isOpen }) =>
    isOpen &&
    css`
      margin-top: 16px;
      max-height: var(--container-height);
      padding-top: 16px;

      > * {
        opacity: 1;
      }
    `}
`

export const PositionHead: React.FC = ({ ...restProps }) => {
  const symbolPair = ['usdc', 'xdai']
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Wrapper {...restProps}>
      <Icons>
        <Icon dimensions={iconDimensions} symbol={symbolPair[0]} />
        <OverlappingIcon dimensions={iconDimensions} symbol={symbolPair[1]} />
      </Icons>
      <HeadContents>
        <div>Value 1</div>
        <div>Value 2</div>
      </HeadContents>
      <Badges>
        <AssetBadge>asd</AssetBadge>
        <AssetBadge>fhdsdghf</AssetBadge>
      </Badges>
      <Controls>
        <div>Limit whatever</div>
        <ButtonToggleInfo isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      </Controls>
      <Collapsable isOpen={isOpen}>asdasd</Collapsable>
    </Wrapper>
  )
}
