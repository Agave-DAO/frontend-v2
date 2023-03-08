/* Dark Theme            */
/* Add only colors here. */

import { darken } from 'polished'

const error = '#F4387C'
const success = '#33dd33'
const primary = '#019D8B'
const primary10 = '#019D8B1A'
const primaryLight = '#40B390'
const primaryDarkened = darken(0.05, primary)

const secondary = '#122C34'
const secondary20 = `${secondary}33`

const tertiary = '#BCF298'
const tertiary0 = `${tertiary}00`
const tertiary30 = `${tertiary}4d`

const black = '#0D2026'

const darkGreen = '#006268'
const darkGreenDarkened = darken(0.05, darkGreen)
const darkGreen20 = `${darkGreen}33`

const mainDark1 = '#007F7C'
const mainDark3 = '#0B464F'
const mainDark4 = '#0E3940'

const textColor = '#fff'
const textColor50 = 'rgba(255, 255, 255, 0.5)'
const textColor60 = 'rgba(255, 255, 255, 0.6)'

const borderColor = 'rgba(250, 250, 250, 0.2)'

const lightestGray = '#F0F4F4'
const lighterGray = '#D1DDDC'

const gray = '#97B1AB'

const darkGray = '#0F3B3F'
const darkestGray = '#122C34'
const darkerGray = '#344B47'
const darkGrayDarkened = darken(0.1, 'rgb(10, 25, 50)')

const componentBackgroundColor = 'rgba(13, 2, 2, 0.85)'
const darkBackground = '13, 32, 38'
const darkBackground0 = `rgba(${darkBackground}, 0)`
const darkBackground02 = `rgba(${darkBackground}, 0.2)`
const darkBackground04 = `rgba(${darkBackground}, 0.4)`
const darkBackground06 = `rgba(${darkBackground}, 0.6)`
const accent = '#9BEFD7'

const gradientLight = `linear-gradient(84.32deg, ${tertiary} 0%, ${primaryLight} 99.25%)`
const mainBodyGradient = `radial-gradient(64.22% 34.97% at 0% 0%, ${tertiary30} 0%, ${tertiary0} 100%), linear-gradient(188.87deg, ${primary} 4.99%, ${secondary} 62.79%)`
const greenGradientMedium = `linear-gradient(180deg, ${darkGreen20} 0%, ${darkGreen}00 100%)`
const greenGradientLight = `radial-gradient(64.22% 34.97% at 0% 0%, ${tertiary30} 0%, ${tertiary0} 100%), linear-gradient(188.87deg, ${primary} 4.99%, ${darkGreen} 62.79%);`

const dropdownBackground = '#F8F8F8'
const dropdownColor = '#767676'
const dropdownColorHover = '#363636'
const dropdownBackgroundColorHover = 'rgba(0, 0, 0, 0.1)'
const dropdownBorderColor = '#EFEFEF'

export const dark = {
  body: {
    backgroundColor: black,
    backgroundImage: mainBodyGradient,
  },
  buttonDropdown: {
    backgroundColor: black,
    backgroundColorHover: darkGrayDarkened,
    borderColor: borderColor,
    borderColorHover: borderColor,
    color: textColor,
    colorHover: textColor,
  },
  buttonConnect: {
    color: black,
    colorHover: black,
  },
  buttonGradient: {
    backgroundImage: gradientLight,
    backgroundImageHover: gradientLight,
    color: mainDark3,
    colorHover: mainDark3,
  },
  buttonPrimary: {
    backgroundColor: primary,
    backgroundColorHover: primaryDarkened,
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    color: textColor,
    colorHover: textColor,
  },
  buttonDark: {
    backgroundColor: darkGreen,
    backgroundColorHover: darkGreenDarkened,
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    color: textColor,
    colorHover: textColor,
  },
  buttonPrimaryDark: {
    backgroundColor: mainDark3,
    backgroundColorHover: mainDark4,
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    color: textColor,
    colorHover: textColor,
  },
  buttonLight: {
    backgroundColor: '#fff',
    backgroundColorHover: mainDark3,
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    color: mainDark1,
    colorHover: '#fff',
  },
  card: {
    backgroundColor: 'rgba(13, 2, 2, 0.65)',
    borderColor: borderColor,
  },
  checkBox: {
    backgroundColorActive: secondary,
    backgroundColor: black,
    borderColor: borderColor,
  },
  colors: {
    accent: accent,
    black: black,
    borderColor: borderColor,
    componentBackgroundColor: componentBackgroundColor,
    darkBackground02: darkBackground02,
    darkBackground04: darkBackground04,
    darkBackground06: darkBackground06,
    darkBackground0: darkBackground0,
    darkGray: darkGray,
    darkGrayDarkened: darkGrayDarkened,
    darkGreen20: darkGreen20,
    darkerGray: darkerGray,
    darkestGray: darkestGray,
    error: error,
    gray: gray,
    greenGradientLight: greenGradientLight,
    greenGradientMedium: greenGradientMedium,
    lighterGray: lighterGray,
    lightestGray: lightestGray,
    mainDark1: mainDark1,
    mainDark3: mainDark3,
    mainDark4: mainDark4,
    primary10: primary10,
    primary: primary,
    primaryDarkened: primaryDarkened,
    primaryLight: primaryLight,
    secondary20: secondary20,
    secondary: secondary,
    success: success,
    tertiary0: tertiary0,
    tertiary30: tertiary30,
    tertiary: tertiary,
    textColor50: textColor50,
    textColor60: textColor60,
    textColor: textColor,
  },
  dropdown: {
    background: dropdownBackground,
    boxShadow:
      '0 27px 80px rgba(0, 0, 0, 0.07), 0 10.4px 25.4815px rgba(0, 0, 0, 0.0425185), 0px 2.2px 6.51852px rgba(0, 0, 0, 0.0274815)',
    item: {
      backgroundColor: 'transparent',
      backgroundColorHover: dropdownBackgroundColorHover,
      borderColor: dropdownBorderColor,
      color: dropdownColor,
      colorDanger: error,
      colorHover: dropdownColorHover,
      colorOK: success,
    },
  },
  textField: {
    backgroundColor: mainDark4,
    borderColor: 'transparent',
    color: textColor,
    errorColor: error,
    successColor: success,
    active: {
      backgroundColor: mainDark4,
      borderColor: 'transparent',
      color: textColor,
    },
    placeholder: {
      color: textColor50,
    },
  },
  header: {
    backgroundColor: 'transparent',
    color: textColor,
  },
  mainMenu: {
    color: lightestGray,
    colorHover: secondary,
  },
  mobileMenu: {
    background: `radial-gradient(64.22% 34.97% at 0% 0%, rgba(188, 242, 152, 0.2) 0%, rgba(188, 242, 152, 0) 100%), linear-gradient(0deg, ${darkestGray}, ${darkestGray}), #fff`,
    items: {
      color: textColor,
      backgroundColor: '#000',
      borderColor: '#fff',
    },
  },
  modal: {
    overlayColor: 'rgba(0, 0, 0, 0.8)',
  },
  radioButton: {
    backgroundColorActive: secondary,
    backgroundColor: black,
    borderColor: borderColor,
  },
  onBoard: {
    backgroundColor: componentBackgroundColor,
    color: textColor,
    borderRadius: '5px',
    borderColor: borderColor,
    sidebarBackgroundColor: 'rgb(235, 235, 237)',
  },
  toast: {
    backgroundColor: componentBackgroundColor,
    borderColor: borderColor,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.25)',
  },
  tooltip: {
    backgroundColor: '#000',
    textColor: '#fff',
  },
}
