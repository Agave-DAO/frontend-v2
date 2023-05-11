import styled from 'styled-components'

import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'

const Wrapper = styled.div`
  background: ${({ theme: { colors } }) => colors.primary30};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px;
`

const Title = styled.h1`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 0 4px;
`

const Value = styled.p`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1.2;
  margin: 0;
`

export const FundsInStakingModule: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { totalStaked } = useStakeInformation()

    return (
      <Wrapper {...restProps}>
        <Title>Funds in the Staking Module</Title>
        <Value>
          <Amount decimals={18} symbol="AGVE" symbolPosition="after" value={totalStaked} />
        </Value>
      </Wrapper>
    )
  },
  ({ ...restProps }) => <SkeletonLoading style={{ height: '90px' }} {...restProps} />,
)
