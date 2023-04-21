import { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

export enum TextfieldStatus {
  error = 'error',
  success = 'success',
}

type Variant = 'dark' | 'light' | undefined

interface TextfieldCSSProps {
  status?: TextfieldStatus | undefined
  variant?: Variant
}

export interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement>, TextfieldCSSProps {}

const getTextfieldStyles = (
  theme: any,
  variant?: Variant,
  status?: TextfieldStatus | undefined,
) => {
  const textField = variant === undefined ? theme.textField : theme.textFieldLight

  return css`
    --textfield-border-radius: 16px;
    --texfield-font-size: 1.4rem;
    --textfield-padding: 16px;
    --textfield-height: 49px;
    --textfield-font-weight: 400;

    background-color: ${textField.backgroundColor};
    border-color: ${status === TextfieldStatus.error
      ? textField.errorColor
      : status === TextfieldStatus.success
      ? textField.successColor
      : textField.borderColor};
    border-radius: var(--textfield-border-radius);
    border-style: solid;
    border-width: 1px;
    color: ${status === TextfieldStatus.error ? textField.errorColor : textField.color};
    font-size: var(--texfield-font-size);
    font-weight: var(--textfield-font-weight);
    height: var(--textfield-height);
    outline: none;
    overflow: hidden;
    padding: var(--textfield-padding);
    text-overflow: ellipsis;
    transition: border-color 0.15s linear;
    white-space: nowrap;
    width: 100%;

    &:active,
    &:focus {
      background-color: ${textField.active.backgroundColor};
      border-color: ${status === TextfieldStatus.error
        ? textField.errorColor
        : status === TextfieldStatus.success
        ? textField.successColor
        : textField.active.borderColor};
      color: ${status === TextfieldStatus.error
        ? textField.errorColor
        : status === TextfieldStatus.success
        ? textField.successColor
        : textField.color};
    }

    &[disabled],
    &[disabled]:hover {
      background-color: ${textField.backgroundColor};
      border-color: ${textField.borderColor};
      color: ${textField.color};
      cursor: not-allowed;
      opacity: 0.5;
    }

    &[disabled]::placeholder,
    &[disabled]:hover::placeholder {
      color: ${textField.color}!important;
    }

    &::placeholder {
      color: ${textField.placeholder.color};
      font-size: var(--texfield-font-size);
      font-style: normal;
      font-weight: var(--textfield-font-weight);
      opacity: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &[readonly] {
      background-color: ${textField.backgroundColor};
      border-color: ${textField.borderColor};
      color: ${textField.placeholder.color};
      cursor: default;
      font-style: normal;
    }

    &[type='number'] {
      -moz-appearance: textfield;
      ::-webkit-inner-spin-button,
      ::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    }

    &::-webkit-search-decoration {
      -webkit-appearance: none;
    }
  `
}

export const Textfield = styled.input<TextfieldProps>`
  ${({ status, theme, variant }) => getTextfieldStyles(theme, variant, status)}
`
