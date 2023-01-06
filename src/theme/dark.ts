/* Dark Theme            */
/* Add only colors here. */

import { darken } from 'polished'

const error = '#db3333'
const success = '#33dd33'
const primary = '#220022'
const secondary = '#E56399'
const tertiary = '#A6CFD5'
const textColor = '#fff'
const borderColor = 'rgba(250,250,250,0.2)'
const darkGray = 'rgb(10, 25, 50)'
const darkGrayDarkened = darken(0.1, 'rgb(10, 25, 50)')
const darkBlue = 'rgb(6, 75, 141)'
const componentBackgroundColor = 'rgba(13, 2, 2, 0.85)'

export const dark = {
  body: {
    backgroundColor: darkGray,
    backgroundImage:
      'linear-gradient(80deg, rgb(17, 10, 10) 15%, rgb(92, 33, 52) 33%, rgb(6, 75, 141) 65%, rgb(13, 2, 2) 98%)',
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
