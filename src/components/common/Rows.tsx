import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { CollapseToggle } from '@/src/components/assets/CollapseToggle'

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 6px;
  width: 100%;
`

export type RowVariant = 'light' | 'dark' | 'openCollapsableRow' | undefined

export const Row = styled.div<{ variant?: RowVariant }>`
  align-items: center;
  background-color: ${({ theme: { colors }, variant }) =>
    variant === 'light'
      ? colors.white05
      : variant === 'dark'
      ? colors.black20
      : variant === 'openCollapsableRow'
      ? colors.black50
      : 'transparent'};
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 16px;
  transition: all 0.15s linear;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding: 16px;
  }
`

const RowCommonCSS = css`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  column-gap: 8px;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
`

export const RowKey = styled.div`
  ${RowCommonCSS}

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
  }
`

export const RowValue = styled.div`
  ${RowCommonCSS}
  margin-left: auto;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const RowValueBig = styled(RowValue)`
  font-size: 1.6rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const EmphasizedRowValue = styled(RowValue)`
  font-size: 1.6rem;
  font-weight: 700;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const CollapsableRows = styled(Rows)`
  row-gap: 6px;
  padding-top: 16px;
`

export const CollapsableRowsInner = styled(CollapsableRows)`
  flex-grow: 0;
  margin-left: auto;
  max-width: fit-content;
  padding: 0;
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
  color: ${({ theme: { colors } }) => colors.lightestGray};
  font-size: 1.4rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

export const CollapsableRowValue = styled(RowValue)`
  color: ${({ theme: { colors } }) => colors.lightestGray};
  font-size: 1.4rem;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.4rem;
  }
`

interface CollapsableRowsHandlerProps extends HTMLAttributes<HTMLDivElement> {
  toggle: React.ReactNode
  variant?: RowVariant
}

export const CollapsableRowsHandler: React.FC<CollapsableRowsHandlerProps> = ({
  children,
  toggle,
  variant,
  ...restProps
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(true)
  const onToggle = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <Row variant={!isCollapsed ? 'openCollapsableRow' : variant} {...restProps}>
      <RowToggle onClick={onToggle}>
        {toggle} <CollapseToggle isOpen={!isCollapsed} />
      </RowToggle>
      {!isCollapsed && <CollapsableRows>{children}</CollapsableRows>}
    </Row>
  )
}
