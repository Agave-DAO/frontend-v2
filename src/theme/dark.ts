/* Dark Theme            */
/* Add only colors here. */

import { darken } from 'polished'

const error = '#db3333'
const success = '#33dd33'
const primary = '#019D8B'
const secondary = '#122C34'
const tertiary = '#BCF298'
const textColor = '#fff'
const borderColor = 'rgba(250,250,250,0.2)'
const darkGray = '#0D2026'
const darkGrayDarkened = darken(0.1, 'rgb(10, 25, 50)')
const darkBlue = 'rgb(6, 75, 141)'
const componentBackgroundColor = 'rgba(13, 2, 2, 0.85)'
const darkBackground = '13, 32, 38'
const darkBackground04 = `rgba(${darkBackground}, 0.4)`
const darkBackground06 = `rgba(${darkBackground}, 0.6)`
const accent = '#9BEFD7'

export const dark = {
  body: {
    backgroundColor: darkGray,
    backgroundImage: `radial-gradient(64.22% 34.97% at 0% 0%, ${tertiary}4d 0%, ${tertiary}00 100%), linear-gradient(188.87deg, ${primary} 4.99%, ${secondary} 62.79%)`,
  },
  buttonDropdown: {
    backgroundColor: darkGray,
    backgroundColorHover: darkGrayDarkened,
    borderColor: borderColor,
    borderColorHover: borderColor,
    color: textColor,
    colorHover: textColor,
  },
  buttonPrimary: {
    backgroundColor: darkGray,
    backgroundColorHover: darkGrayDarkened,
    borderColor: borderColor,
    borderColorHover: borderColor,
    color: textColor,
    colorHover: textColor,
  },
  card: {
    backgroundColor: 'rgba(13, 2, 2, 0.65)',
    borderColor: borderColor,
  },
  checkBox: {
    backgroundColorActive: secondary,
    backgroundColor: darkGray,
    borderColor: borderColor,
  },
  colors: {
    accent: accent,
    borderColor: borderColor,
    componentBackgroundColor: componentBackgroundColor,
    darkBackground04: darkBackground04,
    darkBackground06: darkBackground06,
    darkBlue: darkBlue,
    darkGray: darkGray,
    darkGrayDarkened: darkGrayDarkened,
    error: error,
    primary: primary,
    secondary: secondary,
    success: success,
    tertiary: tertiary,
    textColor: textColor,
  },
  dropdown: {
    background: componentBackgroundColor,
    borderColor: borderColor,
    boxShadow: 'none',
    item: {
      backgroundColor: 'transparent',
      backgroundColorHover: darkGrayDarkened,
      borderColor: borderColor,
      color: textColor,
      colorDanger: error,
      colorHover: textColor,
      colorOK: success,
    },
  },
  textField: {
    backgroundColor: darkGray,
    borderColor: borderColor,
    color: textColor,
    errorColor: error,
    successColor: success,
    active: {
      backgroundColor: darkGray,
      borderColor: secondary,
      boxShadow: 'none',
      color: textColor,
    },
    placeholder: {
      color: 'lightGray',
    },
  },
  header: {
    backgroundColor: 'transparent',
    color: textColor,
  },
  mainMenu: {
    color: textColor,
  },
  mobileMenu: {
    color: textColor,
    backgroundColor: '#000',
    borderColor: borderColor,
  },
  modal: {
    overlayColor: 'rgba(0, 0, 0, 0.8)',
  },
  radioButton: {
    backgroundColorActive: secondary,
    backgroundColor: darkGray,
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
}
