import { CSSProperties, PropsWithChildren } from 'react'
import styled, { css, keyframes } from 'styled-components'

const neutralBackground = 'rgba(1,157,139,0.05)'

const loadingAnimation = keyframes`
  0% {
    background-color: var(--background-color-start);
  }

  50% {
    background-color: var(--background-color-end);
  }

  100% {
    background-color: var(--background-color-start);
  }
`

interface SkeletonProps extends PropsWithChildren {
  animate?: boolean
  animationDuration?: string
  style?: CSSProperties
}

const AnimationCSS = css<SkeletonProps>`
  --background-color-start: ${({ theme: { colors } }) => colors.mainDark1};
  --background-color-end: ${({ theme: { colors } }) => colors.mainDark3};

  animation-delay: 0;
  animation-duration: ${({ animationDuration }) => `${animationDuration}`};
  animation-iteration-count: infinite;
  animation-name: ${loadingAnimation};
  animation-timing-function: ease-in-out;
`

export const SkeletonLoading = styled.div<SkeletonProps>`
  ${({ animate }) => animate && AnimationCSS}
  background-color: ${({ animate, theme: { colors } }) =>
    animate ? colors.mainDark1 : neutralBackground};
  border-radius: 10px;
  min-height: 20px;
  min-width: 150px;
  width: 100%;
`

SkeletonLoading.defaultProps = {
  animate: true,
  animationDuration: '2s',
}

const ListItem: React.FC<SkeletonProps> = ({ children, ...restProps }) => (
  <SkeletonLoading
    style={{
      borderRadius: '16px',
    }}
    {...restProps}
  >
    {children}
  </SkeletonLoading>
)

const Head = styled(SkeletonLoading)`
  border-radius: 16px 16px 0 0;
  height: 106px;
  padding: 24px 16px;
`

Head.defaultProps = {
  animate: false,
}

export const MarketSkeletonLoading: React.FC<SkeletonProps> = ({ ...restProps }) => (
  <ListItem
    style={{
      height: '204px',
    }}
    {...restProps}
  >
    <Head />
    <div
      style={{
        columnGap: '20px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        minWidth: 0,
        padding: '16px',
      }}
    >
      {Array.from({ length: 3 }).map((item, index) => (
        <SkeletonLoading
          animate={false}
          key={`grid_${index}`}
          style={{
            height: '58px',
            minWidth: 0,
            width: 'auto',
          }}
        />
      ))}
    </div>
  </ListItem>
)

export const MyAssetSkeletonLoading: React.FC<SkeletonProps> = ({ ...restProps }) => (
  <ListItem
    style={{
      height: '176px',
    }}
    {...restProps}
  >
    <Head />
  </ListItem>
)
