import styled from 'styled-components'

const Chevrons: React.FC = ({ ...restProps }) => (
  <svg
    fill="none"
    height="16"
    viewBox="0 0 10 16"
    width="10"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <path
      clipRule="evenodd"
      d="M0.209209 11.1831C0.488155 10.939 0.940416 10.939 1.21936 11.1831L5 14.4911L8.78064 11.1831C9.05958 10.939 9.51184 10.939 9.79079 11.1831C10.0697 11.4271 10.0697 11.8229 9.79079 12.0669L5.50508 15.8169C5.22613 16.061 4.77387 16.061 4.49492 15.8169L0.209209 12.0669C-0.0697365 11.8229 -0.0697365 11.4271 0.209209 11.1831Z"
      fill="#0B464F"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M9.79079 4.81694C9.51184 5.06102 9.05958 5.06102 8.78064 4.81694L5 1.50888L1.21936 4.81694C0.940415 5.06102 0.488154 5.06102 0.209208 4.81694C-0.0697374 4.57286 -0.0697373 4.17714 0.209208 3.93306L4.49492 0.183058C4.77387 -0.0610198 5.22613 -0.0610197 5.50508 0.183058L9.79079 3.93306C10.0697 4.17714 10.0697 4.57286 9.79079 4.81694Z"
      fill="#0B464F"
      fillRule="evenodd"
    />
  </svg>
)

const Wrapper = styled.div`
  --size: 41px;

  display: flex;
  height: var(--size);
  justify-content: center;
  margin: 16px calc(var(--padding-horizontal) * -1);
  position: relative;

  &::before {
    background-color: #fff;
    content: '';
    height: 2px;
    left: 0;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: 1;
  }
`

const Button = styled.button`
  align-items: center;
  background-color: #fff;
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.04), 0 8.47407px 19.1111px rgba(0, 0, 0, 0.0242963),
    0 1.79259px 4.88889px rgba(0, 0, 0, 0.0157037);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  height: var(--size);
  justify-content: center;
  transition: box-shadow 0.15s linear;
  width: var(--size);
  z-index: 5;

  &:hover {
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.1), 0 8.47407px 19.1111px rgba(0, 0, 0, 0.1),
      0 1.79259px 4.88889px rgba(0, 0, 0, 0.1);
  }

  &:active {
    opacity: 0.7;
  }
`

export const SwapButton: React.FC<{ disabled?: boolean; onClick: () => void }> = ({
  disabled,
  onClick,
  ...restProps
}) => {
  return (
    <Wrapper {...restProps}>
      <Button disabled={disabled} onClick={onClick} type="button">
        <Chevrons />
      </Button>
    </Wrapper>
  )
}
