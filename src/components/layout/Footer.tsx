import styled from 'styled-components'

import { InnerContainer as BaseInnerContainer } from '@/src/components/helpers/InnerContainer'
import { BaseParagraph } from '@/src/components/text/BaseParagraph'
import { useCookiesWarningContext } from '@/src/providers/cookiesWarningProvider'

const Wrapper = styled.footer`
  color: ${({ theme }) => theme.colors.textColor};
  flex-shrink: 0;
  margin-top: auto;
  padding-bottom: 20px;
  padding-top: 40px;
  width: 100%;
`

const InnerContainer = styled(BaseInnerContainer)`
  align-items: center;
  display: grid;
  grid-template-columns: 1fr;
`

const Paragraph = styled(BaseParagraph)`
  color: ${({ theme }) => theme.colors.textColor};
  font-size: 1.2rem;
  line-height: 1.5;
  margin: 0;
  order: 2;
  text-align: center;
`

const Item = styled.span`
  color: ${({ theme }) => theme.colors.textColor};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

export const Footer: React.FC = (props) => {
  const year = new Date().getFullYear()
  const { cookiesWarningEnabled, showCookiesWarning } = useCookiesWarningContext()

  return (
    <Wrapper {...props}>
      <InnerContainer>
        <Paragraph>
          Copyright © {year} • BootNode.dev • All Rights Reserved
          {cookiesWarningEnabled && (
            <>
              &nbsp;- <Item onClick={showCookiesWarning}>Cookies</Item>
            </>
          )}
        </Paragraph>
      </InnerContainer>
    </Wrapper>
  )
}
