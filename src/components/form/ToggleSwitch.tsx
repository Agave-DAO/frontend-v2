import styled, { css } from 'styled-components'

const Wrapper = styled.label<{ disabled?: boolean; appearance?: string }>`
  --size: 20px;
  --gap: 4px;
  --toggle-left: 26px;
  height: 28px;
  position: relative;
  transition: opacity 0.15s linear;
  width: 50px;

  ${(props) =>
    props.appearance === 'mini' &&
    css`
      --size: 14px;
      --gap: 3px;
      --toggle-left: 23px;
      height: 20px;
      width: 40px;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.5;
      pointer-events: none;
    `}
`
const Switch = styled.span`
  background-color: ${({ theme: { colors } }) => colors.darkestGray};
  border-radius: 60px;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 0;

  &::after {
    background-color: ${({ theme: { colors } }) => colors.error};
    background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNy40ODcuNTEzYS42ODkuNjg5IDAgMDEwIC45NzRsLTYgNmEuNjg5LjY4OSAwIDExLS45NzQtLjk3NGw2LTZhLjY4OS42ODkgMCAwMS45NzQgMHoiIGZpbGw9IiMxMjJDMzQiLz48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTS41MTMuNTEzYS42ODkuNjg5IDAgMDEuOTc0IDBsNiA2YS42ODkuNjg5IDAgMDEtLjk3NC45NzRsLTYtNmEuNjg5LjY4OSAwIDAxMC0uOTc0eiIgZmlsbD0iIzEyMkMzNCIvPjwvc3ZnPg==');
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 50%;
    content: '';
    display: block;
    height: var(--size);
    left: var(--gap);
    position: absolute;
    top: var(--gap);
    transition: all 0.15s linear;
    width: var(--size);
  }
`
const CheckBox = styled.input`
  cursor: pointer;
  display: block;
  height: 100%;
  opacity: 0;
  position: relative;
  width: 100%;
  z-index: 5;

  &:checked + ${Switch} {
    background-color: ${({ theme: { colors } }) => colors.darkestGray};

    &::after {
      background-color: ${({ theme: { colors } }) => colors.primaryLight};
      background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTkuMDgzLjE5M2MuMjcuMjU2LjI3LjY3MiAwIC45M2wtNC45NCA0LjY4NGEuNzIuNzIgMCAwMS0uOTggMEwuOTE3IDMuNjc3YS42MzQuNjM0IDAgMDEwLS45MjkuNzIuNzIgMCAwMS45OCAwbDEuNzU2IDEuNjY1IDQuNDUtNC4yMmEuNzIuNzIgMCAwMS45OCAweiIgZmlsbD0iIzEyMkMzNCIvPjwvc3ZnPg==');
      left: var(--toggle-left);
    }
  }

  &:disabled {
    cursor: not-allowed;
  }
`

CheckBox.defaultProps = {
  type: 'checkbox',
}

type Props = {
  appearance?: string
} & React.InputHTMLAttributes<HTMLInputElement>

export const ToggleSwitch = ({ appearance, checked, disabled, onChange, ...restProps }: Props) => {
  return (
    <Wrapper appearance={appearance} disabled={disabled}>
      <CheckBox checked={checked} disabled={disabled} onChange={onChange} {...restProps} />
      <Switch />
    </Wrapper>
  )
}
