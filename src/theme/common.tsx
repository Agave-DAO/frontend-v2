/* Properties common to any themes                     */
/* Add dimensions, fonts, paddings, margins, etc. here */

const borderRadius = '6px'
const radioAndCheckDimensions = '14px'
const componentPaddingHorizontal = '20px'
const componentPaddingVertical = '18px'

export const common = {
  common: {
    borderRadius: borderRadius,
  },
  fonts: {
    defaultSize: '1.4rem',
    family:
      "'Roboto', 'Helvetica Neue', 'Arial', 'Segoe UI', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'",
    familyCode: "'source-code-pro', 'Menlo', 'Monaco', 'Consolas', 'Courier New', 'monospace'",
  },
  checkBox: {
    dimensions: radioAndCheckDimensions,
  },
  radioButton: {
    dimensions: radioAndCheckDimensions,
  },
  dropdown: {
    borderRadius: borderRadius,
  },
  header: {
    height: '60px',
  },
  layout: {
    horizontalPaddingDesktopStart: '20px',
    horizontalPaddingDesktopWideStart: '20px',
    horizontalPaddingMobile: '10px',
    horizontalPaddingTabletLandscapeStart: '15px',
    horizontalPaddingTabletPortraitStart: '15px',
    maxWidth: '1360px',
  },
  breakPoints: {
    desktopStart: '1025px',
    desktopWideStart: '1281px',
    tabletLandscapeStart: '769px',
    tabletPortraitStart: '481px',
  },
  card: {
    borderRadius: borderRadius,
    paddingHorizontal: componentPaddingHorizontal,
    paddingVertical: componentPaddingVertical,
  },
}
