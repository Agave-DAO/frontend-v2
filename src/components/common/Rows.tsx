import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

import { CollapseToggle } from '@/src/components/assets/CollapseToggle'

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  width: 100%;
`

type RowVariant = 'light' | 'dark' | undefined

export const Row = styled.div<{ variant?: RowVariant }>`
  background-color: ${({ theme: { colors }, variant }) =>
    variant === 'light' ? colors.white05 : variant === 'dark' ? colors.black20 : 'transparent'};

  align-items: center;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding: 16px;
  }
`

export const RowKey = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

export const RowValue = styled.div`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin-left: auto;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const EmphasizedRowValue = styled.span`
  font-size: 1.6rem;
  font-weight: 700;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const CollapsableRows = styled(Rows)`
  row-gap: 4px;
  padding-top: 8px;
`

export const CollapsableRow = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const RowToggle = styled(CollapsableRow)`
  column-gap: 8px;
  cursor: pointer;
`

export const CollapsableRowKey = styled(RowKey)`
  font-size: 1.2rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

export const CollapsableRowValue = styled(RowValue)`
  font-size: 1.2rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

interface CollapsableRowsHandlerProps extends HTMLAttributes<HTMLDivElement> {
  toggle: React.ReactNode
}

export const CollapsableRowsHandler: React.FC<CollapsableRowsHandlerProps> = ({
  children,
  toggle,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const onToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <>
      <RowToggle onClick={onToggle}>
        {toggle} <CollapseToggle isOpen={!isCollapsed} />
      </RowToggle>
      {!isCollapsed && <CollapsableRows>{children}</CollapsableRows>}
    </>
  )
}
