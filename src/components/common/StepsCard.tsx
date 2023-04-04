import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

import { ExternalLink as ExternalLinkSVG } from '@/src/components/assets/ExternalLink'
import { ButtonPrimary } from '@/src/components/buttons/Button'

export const TextCSS = css`
  color: ${({ theme: { colors } }) => colors.darkestGray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.5;
`

const Link = styled.a`
  align-items: center;
  background: ${({ theme: { colors } }) => colors.mainDark4};
  border-radius: 20px;
  color: ${({ theme: { colors } }) => colors.lightestGray};
  column-gap: 4px;
  display: flex;
  font-size: 1.1rem;
  font-weight: 400;
  height: 20px;
  padding: 0 6px;
  text-decoration: none;
`

export const StepsCard = styled.div`
  --border-radius: 16px;
  --padding-top: 32px;
  --padding-horizontal: 8px;
  --padding-bottom: 8px;

  background-color: ${({ theme: { colors } }) => colors.lightestGray};
  border-radius: var(--border-radius);
  display: flex;
  flex-direction: column;
  padding: var(--padding-top) var(--padding-horizontal) var(--padding-bottom);
  width: 100%;

  ${TextCSS}

  a:not(${Link}) {
    color: ${({ theme: { colors } }) => colors.primary};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`

export const Text = styled.span`
  ${TextCSS}
  padding-bottom: 8px;
  padding-left: 16px;
`

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
  width: 100%;
`

type RowVariant = 'dark' | undefined

export const Row = styled.div<{ variant?: RowVariant }>`
  background-color: ${({ theme: { colors }, variant }) =>
    variant === 'dark' ? colors.black05 : 'transparent'};

  align-items: center;
  border-radius: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 8px 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    padding: 16px;
  }
`

const RowCommonCSS = css`
  align-items: center;
  column-gap: 8px;
  display: flex;

  ${TextCSS}
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
    font-size: 1.6rem;
  }
`

export const RowValueBig = styled(RowValue)`
  font-size: 1.6rem;
  font-weight: 700;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
  }
`

export const ButtonWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-bottom: 8px;
  width: 100%;
`

export const Button = styled(ButtonPrimary)`
  border-radius: 16px;
  font-size: 1.6rem;
  font-weight: 700;
  height: 54px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
    height: 61px;
  }
`

export const StepActionText = styled.span`
  ${TextCSS}

  a {
    color: ${({ theme: { colors } }) => colors.primary};
    text-decoration: underline;

    &:hover {
      text-decoration: none;
    }
  }
`

export const StepActionButton = styled.button`
  ${TextCSS}
  align-items: center;
  background: none;
  border: none;
  color: ${({ theme: { colors } }) => colors.darkGreen};
  cursor: pointer;
  display: flex;
  justify-content: center;
  outline: none;
  padding: 0;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const ExternalLink: React.FC<PropsWithChildren<{ href: string }>> = ({
  children,
  href,
  ...restProps
}) => (
  <Link href={href} rel="noreferrer" target="_blank" {...restProps}>
    {children} <ExternalLinkSVG />
  </Link>
)
