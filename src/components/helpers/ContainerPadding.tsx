import { css } from 'styled-components'

export const ContainerPadding = css`
  padding-left: ${({ theme }) => theme.layout.horizontalPaddingMobile};
  padding-right: ${({ theme }) => theme.layout.horizontalPaddingMobile};

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletPortraitStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingTabletPortraitStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingTabletPortraitStart};
  }

  @media (min-width: ${({ theme }) => theme.breakPoints.tabletLandscapeStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingTabletLandscapeStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingTabletLandscapeStart};
  }

  @media (min-width: ${({ theme }) => theme.breakPoints.desktopStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingDesktopStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingDesktopStart};
  }

  @media (min-width: ${({ theme }) => theme.breakPoints.desktopWideStart}) {
    padding-left: ${({ theme }) => theme.layout.horizontalPaddingDesktopWideStart};
    padding-right: ${({ theme }) => theme.layout.horizontalPaddingDesktopWideStart};
  }
`
