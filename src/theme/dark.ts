/* Dark Theme            */
/* Add only colors here. */

import { darken } from 'polished'

const error = '#F4387C'
const errorDark = darken(0.1, error)
const success = '#33dd33'

const primary = '#019D8B'
const primary10 = `${primary}1A`
const primary30 = `${primary}4D`
const primaryLight = '#40B390'
const primaryDarkened = darken(0.05, primary)

const mainLight = '#92DE95'

const secondary = '#122C34'
const secondary20 = `${secondary}33`
const secondary30 = `${secondary}4D`
const secondary50 = `${secondary}80`

const tertiary = '#BCF298'
const tertiary0 = `${tertiary}00`
const tertiary30 = `${tertiary}4d`

const black = '#0D2026'
const black05 = `${black}0D`
const black20 = `${black}33`
const black40 = `${black}66`
const black60 = `${black}99`
const black50 = `${black}80`

const overlay = '#11171C'
const overlay50 = `${overlay}80`

const darkGreen = '#006268'
const darkGreenDarkened = darken(0.05, darkGreen)
const darkGreen20 = `${darkGreen}33`
const darkGreen50 = `${darkGreen}80`

const mainDark1 = '#007F7C'
const mainDark3 = '#0B464F'
const mainDark4 = '#0E3940'
const mainDark440 = `${mainDark4}66`
const mainDark450 = `${mainDark4}80`

const white05 = 'rgba(255, 255, 255, 0.05)'
const white50 = 'rgba(255, 255, 255, 0.5)'
const white60 = 'rgba(255, 255, 255, 0.6)'
const white80 = 'rgba(255, 255, 255, 0.9)'

const textColor = '#fff'
const textColor50 = white50
const textColor60 = white60

const lightestGray = '#F0F4F4'
const lighterGray = '#D1DDDC'

const gray = '#97B1AB'

const darkGray = '#0F3B3F'
const darkishGray = '#647C77'
const darkestGray = secondary
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

const borderColor = '#B3C7C480'

export const dark = {
  body: {
    backgroundColor: black,
    backgroundImage: mainBodyGradient,
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
  buttonNeutral: {
    backgroundColor: lighterGray,
    backgroundColorHover: gray,
    borderColor: 'transparent',
    borderColorHover: 'transparent',
    color: darkestGray,
    colorHover: darkestGray,
  },
  buttonUltraLight: {
    backgroundColor: '#fff',
    backgroundColorHover: primary,
    borderColor: '#fff',
    borderColorHover: primary,
    color: primary,
    colorHover: '#fff',
  },
  buttonMini: {
    color: '#fff',
    colorHover: '#fff',
    regular: {
      backgroundColor: mainDark3,
      backgroundColorHover: mainDark4,
    },
    dark: {
      backgroundColor: mainDark4,
      backgroundColorHover: mainDark3,
    },
    danger: {
      backgroundColor: error,
      backgroundColorHover: errorDark,
    },
  },
  card: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  checkBox: {
    backgroundColorActive: secondary,
    backgroundColor: black,
    borderColor: borderColor,
  },
  colors: {
    accent: accent,
    black05: black05,
    black20: black20,
    black40: black40,
    black50: black50,
    black60: black60,
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
    darkGreen50: darkGreen50,
    darkGreen: darkGreen,
    darkGreenDarkened: darkGreenDarkened,
    darkerGray: darkerGray,
    darkestGray: darkestGray,
    darkishGray: darkishGray,
    error: error,
    gray: gray,
    greenGradientLight: greenGradientLight,
    greenGradientMedium: greenGradientMedium,
    lighterGray: lighterGray,
    lightestGray: lightestGray,
    mainDark1: mainDark1,
    mainDark3: mainDark3,
    mainDark440: mainDark440,
    mainDark450: mainDark450,
    mainDark4: mainDark4,
    mainLight: mainLight,
    overlay50: overlay50,
    overlay: overlay,
    primary10: primary10,
    primary30: primary30,
    primary: primary,
    primaryDarkened: primaryDarkened,
    primaryLight: primaryLight,
    secondary20: secondary20,
    secondary30: secondary30,
    secondary50: secondary50,
    secondary: secondary,
    success: success,
    tertiary0: tertiary0,
    tertiary30: tertiary30,
    tertiary: tertiary,
    textColor50: textColor50,
    textColor60: textColor60,
    textColor: textColor,
    white05: white05,
    white50: white50,
    white60: white60,
    white80: white80,
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
    overlayColor: `linear-gradient(188.87deg, ${darkGreen} 4.99%, ${secondary} 62.79%)`,
  },
  radioButton: {
    backgroundColorActive: secondary,
    backgroundColor: black,
    borderColor: borderColor,
  },
  onBoard: {
    backgroundColor: primary,
    color: textColor,
    borderRadius: '16px',
    borderColor: 'transparent',
    sidebarBackgroundColor: secondary,
  },
  toast: {
    backgroundColor: componentBackgroundColor,
    borderColor: borderColor,
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.25)',
  },
  tooltip: {
    backgroundColor: secondary,
    textColor: textColor,
  },
}
