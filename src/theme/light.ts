/* Light Theme           */
/* Add only colors here. */

import { darken } from 'polished'

const error = '#db3333'
const success = '#33dd33'
const primary = '#320E3B'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#333'
const borderColor = '#ccc'
const darkGray = 'rgb(10, 25, 50)'
const darkGrayDarkened = darken(0.1, '#fff')
const darkBlue = 'rgb(6, 75, 141)'
const componentBackgroundColor = 'rgba(255, 255, 255, 0.95)'

export const light = {
  body: {
    backgroundColor: 'rgba(229, 243, 255, 0.5)',
    backgroundImage:
      'linear-gradient(80deg,rgba(17,10,10,0.2) 15%,rgba(92,33,52,0.2) 33%,rgba(6,75,141,0.2) 65%,rgba(13,2,2,0.1) 98%)',
  },
  buttonPrimary: {
    backgroundColor: '#fff',
    backgroundColorHover: darkGrayDarkened,
    borderColor: borderColor,
    borderColorHover: borderColor,
    color: textColor,
    colorHover: textColor,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: borderColor,
  },
  checkBox: {
    backgroundColorActive: secondary,
    backgroundColor: '#fff',
    borderColor: borderColor,
  },
  colors: {
    borderColor: borderColor,
    componentBackgroundColor: componentBackgroundColor,
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
    background: '#fff',
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
    backgroundColor: '#fff',
    borderColor: borderColor,
    color: textColor,
    errorColor: error,
    successColor: success,
    active: {
      backgroundColor: '#fff',
      borderColor: primary,
      boxShadow: 'none',
      color: textColor,
    },
    placeholder: {
      color: '#999',
    },
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    color: textColor,
  },
  mainMenu: {
    color: textColor,
  },
  mobileMenu: {
    color: textColor,
    backgroundColor: '#fff',
    borderColor: borderColor,
  },
  modal: {
    overlayColor: 'rgba(255, 255, 255, 0.8)',
  },
  radioButton: {
    backgroundColorActive: secondary,
    backgroundColor: '#fff',
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
    boxShadow: '0 0 10px 0 rgba(255, 255, 255, 0.25)',
  },
  tooltip: {
    iconBackgroundColor: '#000',
    iconBorderColor: '#fff',
    textBackgroundColor: '#000',
    textBorderColor: '#fff',
    textColor: '#fff',
  },
}
