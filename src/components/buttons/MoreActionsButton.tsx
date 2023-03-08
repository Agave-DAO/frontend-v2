import { ButtonHTMLAttributes } from 'react'
import styled from 'styled-components'

import { More } from '@/src/components/assets/More'
import { ButtonPrimaryDark } from '@/src/components/buttons/Button'

const Wrapper = styled(ButtonPrimaryDark)`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;
  --padding: 12px;

  border-radius: var(--border-radius);
  font-size: var(--font-size);
  height: var(--height);
  padding-left: var(--padding);
  padding-right: var(--padding);

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --border-radius: 30px;
    --font-size: 1.6rem;
    --height: 46px;
    --padding: 16px;
  }
`

export const MoreActionsButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  ...restProps
}) => (
  <Wrapper {...restProps}>
    {children} <More />
  </Wrapper>
)
