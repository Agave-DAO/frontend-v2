import { useRouter } from 'next/router'
import React, { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import type { UrlObject } from 'url'

export interface Columns {
  align?: string
  title: string
  width?: string
}

export const TableWrapper = styled.div`
  overflow-x: auto;
  overflow-y: none;
  width: 100%;

  &:focus-within {
    overflow: visible;
  }
`

export const TableBody = styled.div`
  display: grid;
  min-width: fit-content;
  row-gap: 10px;
  width: 100%;
`

const getGridTemplateColumns = (columns: Columns[]): string => {
  return columns.map(({ width }) => (width ? width : '1fr')).join(' ')
}

interface RowProps {
  columns: Columns[]
}

export const RowCSS = css<RowProps>`
  align-items: center;
  color: ${({ theme }) => theme.colors.textColor};
  column-gap: 10px;
  display: grid;
  grid-template-columns: ${({ columns }) => getGridTemplateColumns(columns)};
  text-decoration: none;
  transition: background-color 0.15s linear;
`

export const TableRowCSS = css<RowProps>`
  ${RowCSS}

  background-color: ${({ theme }) => theme.card.backgroundColor};
  border-radius: 4px;
  min-height: 48px;
  padding-bottom: 10px;
  padding-top: 10px;
  position: relative;
`

export const Row = styled.div<RowProps>`
  ${TableRowCSS}
`

const HoverableRow = styled(Row)`
  cursor: pointer;
  text-decoration: none;
  position: relative;

  &:hover {
    background-color: rgba(255, 255, 255, 0.75);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.6);
    z-index: 5;
  }
`

export const NavRow: React.FC<
  PropsWithChildren<{
    href: UrlObject | string
    columns: Columns[]
  }>
> = ({ children, columns, href }) => {
  const router = useRouter()

  return (
    <HoverableRow columns={columns} onClick={() => router.push(href, undefined, { shallow: true })}>
      {children}
    </HoverableRow>
  )
}

export const TableHead = styled.div<RowProps>`
  ${RowCSS}
`

export interface CellProps {
  align?: string
}

export const Cell = styled.span<CellProps>`
  align-items: center;
  color: ${({ theme: { colors } }) => colors.textColor};
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  justify-content: ${({ align }) => align};
  line-height: 1.3;
  min-width: 0;

  &:first-child {
    padding-left: 15px;
  }

  &:last-child {
    padding-right: 15px;
  }
`

Cell.defaultProps = {
  align: 'flex-start',
  className: 'tableCell',
}

export const TH = styled(Cell)`
  color: ${({ theme }) => theme.colors.textColor};
  font-family: ${({ theme }) => theme.fonts.fontFamilyTitle};
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
`

TH.defaultProps = {
  className: 'tableTH',
}

export const Table: React.FC<
  PropsWithChildren<{
    columns: Columns[]
    hideTableHead?: boolean
  }>
> = ({ children, columns, hideTableHead = false, ...restProps }) => {
  return (
    <TableBody {...restProps}>
      {hideTableHead ? null : (
        <TableHead columns={columns}>
          {columns.map(({ align, title }, index) => (
            <TH align={align} key={index}>
              {title}
            </TH>
          ))}
        </TableHead>
      )}
      {children}
    </TableBody>
  )
}

const TitleValue = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const Title = styled.span``
const Value = styled.span``

export const TitleValuePair: React.FC<{ title: React.ReactNode; value?: React.ReactNode }> = ({
  title,
  value,
}) => (
  <TitleValue>
    <Title>{title}</Title>
    {value && <Value>{value}</Value>}
  </TitleValue>
)

export const getColumnAlignment = (columns: Columns[], index: number): string | undefined => {
  return columns[index].align ? columns[index].align : undefined
}
