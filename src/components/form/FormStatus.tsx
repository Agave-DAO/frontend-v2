import styled from 'styled-components'

import { TextfieldStatus } from '@/src/components/form/Textfield'

export const FormStatus = styled.div<{ status?: TextfieldStatus }>`
  color: ${({ status, theme: { colors, textField } }) =>
    status === TextfieldStatus.error
      ? textField.errorColor
      : status === TextfieldStatus.success
      ? textField.successColor
      : colors.textColor};
  display: block;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;

  &:empty {
    display: none;
  }
`
