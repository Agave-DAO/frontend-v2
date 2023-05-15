import styled from 'styled-components'

import { ChevronRight } from '@/src/components/assets/ChevronRight'
import { CollateralSwap as CollateralSwapSVG } from '@/src/components/assets/CollateralSwap'
import { Long as LongSVG } from '@/src/components/assets/Long'
import { Short as ShortSVG } from '@/src/components/assets/Short'
import { ListItem } from '@/src/components/common/List'

const Wrapper = styled(ListItem)`
  background-color: ${({ theme: { colors } }) => colors.mainDark4};
  box-shadow: 0 15px 20px rgba(0, 0, 0, 0.17), 0 19.6444px 25.4815px rgba(0, 0, 0, 0.103259),
    0 4.15556px 6.51852px rgba(0, 0, 0, 0.0667407);
`

const Grid = styled.div`
  align-items: center;
  column-gap: 16px;
  display: grid;
  flex-direction: column;
  grid-template-columns: 40px 1fr;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`

const Title = styled.h3`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
`

const Type = styled.span`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 1.4rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.2;
`

const StrategyItem: React.FC<{
  title: string
  type: string
  icon: React.ReactNode
  onClick: () => void
}> = ({ icon, onClick, title, type, ...restProps }) => (
  <Wrapper onClick={onClick} {...restProps}>
    <Grid>
      {icon}
      <TitleWrapper>
        <Title>{title}</Title>
        <Type>{type}</Type>
      </TitleWrapper>
    </Grid>
    <ChevronRight />
  </Wrapper>
)

export const Long: React.FC<{ onClick: () => void }> = ({ onClick, ...restProps }) => (
  <StrategyItem icon={<LongSVG />} onClick={onClick} title="Long" type="Position" {...restProps} />
)

export const Short: React.FC<{ onClick: () => void }> = ({ onClick, ...restProps }) => (
  <StrategyItem
    icon={<ShortSVG />}
    onClick={onClick}
    title="Short"
    type="Position"
    {...restProps}
  />
)

export const CollateralSwap: React.FC<{ onClick: () => void }> = ({ onClick, ...restProps }) => (
  <StrategyItem
    icon={<CollateralSwapSVG />}
    onClick={onClick}
    title="Collateral Swap"
    type="Action"
    {...restProps}
  />
)
