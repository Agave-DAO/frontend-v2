import {
  DOMAttributes,
  HTMLAttributes,
  MouseEventHandler,
  cloneElement,
  createRef,
  useCallback,
  useEffect,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

export enum DropdownPosition {
  center,
  left,
  right,
}

export enum DropdownDirection {
  downwards = 'down',
  upwards = 'up',
}

interface WrapperProps {
  disabled: boolean
  fullWidth?: boolean
  isOpen: boolean
}

const Wrapper = styled.div<WrapperProps>`
  outline: none;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'initial')};
  position: relative;
  z-index: ${(props) => (props.isOpen ? '50' : '0')};

  ${(props) =>
    props.fullWidth &&
    css`
      width: 100%;
    `}

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

Wrapper.defaultProps = {
  fullWidth: false,
}

const ButtonContainer = styled.div`
  background-color: transparent;
  border: none;
  display: block;
  outline: none;
  padding: 0;
  user-select: none;
  width: 100%;
`

interface ItemsProps {
  dropdownDirection?: DropdownDirection
  dropdownPosition?: DropdownPosition
  isOpen: boolean
}

const Items = styled.div<ItemsProps>`
  background-color: ${({ theme: { dropdown } }) => dropdown.background};
  border-radius: ${({ theme: { dropdown } }) => dropdown.borderRadius};
  box-shadow: ${({ theme: { dropdown } }) => dropdown.boxShadow};
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  min-width: 140px;
  padding: 4px;
  position: absolute;
  white-space: nowrap;

  ${({ dropdownPosition }) =>
    dropdownPosition === DropdownPosition.left &&
    css`
      left: 0;
    `}

  ${({ dropdownPosition }) =>
    dropdownPosition === DropdownPosition.right &&
    css`
      right: 0;
    `}

  ${({ dropdownPosition }) =>
    dropdownPosition === DropdownPosition.center &&
    css`
      left: 50%;
      transform: translateX(-50%);
    `}

  ${({ dropdownDirection }) =>
    dropdownDirection === DropdownDirection.downwards &&
    css`
      top: calc(100% + 10px);
    `}

  ${({ dropdownDirection }) =>
    dropdownDirection === DropdownDirection.upwards &&
    css`
      bottom: calc(100%);
    `}
`

Items.defaultProps = {
  dropdownDirection: DropdownDirection.downwards,
  dropdownPosition: DropdownPosition.left,
  isOpen: false,
}

export type ActionStates = 'ok' | 'danger' | undefined

export interface ItemProps {
  closeOnClick?: boolean
  disabled?: boolean
  justifyContent?: string
  state?: ActionStates
}

export const DropdownItemCSS = css<ItemProps>`
  align-items: center;
  background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColor};
  border-bottom: 1px solid ${({ theme: { dropdown } }) => dropdown.item.borderColor};
  cursor: pointer;
  display: flex;
  font-size: 1.4rem;
  font-weight: 400;
  gap: 10px;
  justify-content: ${({ justifyContent }) => justifyContent};
  line-height: 1.4;
  min-height: 28px;
  overflow: hidden;
  padding: 0 8px;
  text-decoration: none;
  transition: background-color 0.15s linear;
  user-select: none;
  white-space: nowrap;

  ${({ state, theme: { dropdown } }) =>
    state === 'danger'
      ? css`
          color: ${dropdown.item.colorDanger};
        `
      : state === 'ok'
      ? css`
          color: ${dropdown.item.colorOK};
        `
      : css`
          color: ${dropdown.item.color};
        `};

  &:first-child {
    border-top-left-radius: ${({ theme: { dropdown } }) => dropdown.borderRadius};
    border-top-right-radius: ${({ theme: { dropdown } }) => dropdown.borderRadius};
  }

  &:last-child {
    border-bottom-left-radius: ${({ theme: { dropdown } }) => dropdown.borderRadius};
    border-bottom-right-radius: ${({ theme: { dropdown } }) => dropdown.borderRadius};
    border-bottom: none;
  }

  &:hover {
    background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColorHover};

    ${({ state, theme: { dropdown } }) =>
      state === 'danger'
        ? css`
            color: ${dropdown.item.colorDanger};
          `
        : state === 'ok'
        ? css`
            color: ${dropdown.item.colorOK};
          `
        : css`
            color: ${dropdown.item.colorHover};
          `};
  }

  &:disabled,
  &[disabled] {
    &,
    &:hover {
      background-color: ${({ theme: { dropdown } }) => dropdown.item.backgroundColor};
      cursor: not-allowed;
      font-weight: 400;
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &:active {
    opacity: 0.8;
  }
`

export const DropdownItem = styled.div<ItemProps>`
  ${DropdownItemCSS}
`

DropdownItem.defaultProps = {
  closeOnClick: true,
  disabled: false,
  justifyContent: 'flex-start',
}

export interface Props extends DOMAttributes<HTMLDivElement>, HTMLAttributes<HTMLDivElement> {
  activeItemHighlight?: boolean | undefined
  className?: string
  disabled?: boolean
  dropdownButton?: React.ReactNode | string
  dropdownDirection?: DropdownDirection | undefined
  dropdownPosition?: DropdownPosition | undefined
  fullWidth?: boolean
  items: Array<unknown>
}

export const Dropdown: React.FC<Props> = (props) => {
  const {
    className = '',
    disabled = false,
    dropdownButton,
    dropdownDirection,
    dropdownPosition,
    fullWidth,
    items,
    ...restProps
  } = props
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const node = createRef<HTMLDivElement>()

  const onButtonClick: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      e.stopPropagation()

      if (disabled) {
        return
      }

      setIsOpen(!isOpen)
    },
    [disabled, isOpen],
  )

  useEffect(() => {
    // Note: This code handles closing when clicking outside of the dropdown
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      if (node && node.current && node.current.contains(e.target)) {
        return
      }
      setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClick)

    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [node])

  return (
    <Wrapper
      className={`dropdown ${isOpen ? 'isOpen' : ''} ${className}`}
      disabled={disabled}
      fullWidth={fullWidth}
      isOpen={isOpen}
      ref={node}
      {...restProps}
    >
      <ButtonContainer className="dropdownButton" onClick={onButtonClick}>
        {dropdownButton}
      </ButtonContainer>
      <Items
        className="dropdownItems"
        dropdownDirection={dropdownDirection}
        dropdownPosition={dropdownPosition}
        isOpen={isOpen}
      >
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          items.map((item: any, index: number) => {
            const dropdownItem = cloneElement(item, {
              className: `dropdownItem`,
              key: item.key ? item.key : index,
              onClick: (e) => {
                e.stopPropagation()

                if (item.props.closeOnClick) {
                  setIsOpen(false)
                }

                if (!item.props.onClick) {
                  return
                }

                item.props.onClick()
              },
            })

            return dropdownItem
          })
        }
      </Items>
    </Wrapper>
  )
}
