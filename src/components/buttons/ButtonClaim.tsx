import styled from 'styled-components'

import TxButton from '@/src/components/buttons/txButton'

export const ButtonClaim = styled(TxButton)`
  --size: 18px;

  background-color: #fff;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTkgNi4zMzN2MS43NzhBLjg4OS44ODkgMCAwMTguMTExIDlIMS44OUEuODg5Ljg4OSAwIDAxMSA4LjExMVY2LjMzM00yLjc3OCA0LjExMUw1IDYuMzMzbDIuMjIyLTIuMjIyTTUgNi4zMzNWMSIgc3Ryb2tlPSIjMEI0NjRGIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=');
  background-position: 50% 50%;
  border-radius: 50%;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  display: block;
  height: var(--size);
  padding: 0;
  width: var(--size);

  &:active {
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`
