import { ChangeEvent, HTMLAttributes, createRef, useCallback, useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { Range } from '@/src/components/form/Range'
import Modal from '@/src/components/modals/BaseModal'
import { MIN_SAFE_HEALTH_FACTOR } from '@/src/constants/common'
import { usePersistedState } from '@/src/hooks/usePersistedState'

const openAnimation = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Wrapper = styled.div`
  align-items: center;
  animation-duration: 0.25s;
  animation-iteration-count: 1;
  animation-name: ${openAnimation};
  animation-timing-function: linear;
  background: ${({ theme: { colors } }) => colors.overlay50};
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow: auto;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 105;
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 0 auto;
  max-width: 100%;
  outline: none;
  width: ${({ theme: { layout } }) => layout.maxWidth};
`

const enterFromTop = keyframes`
  0% {
    top: calc(var(--height) * -1);
  }
  100% {
    top: 50%;
  }
`

const enterFromBottom = keyframes`
  0% {
    bottom: calc(var(--height) * -1);
  }
  100% {
    bottom: 0;
  }
`

const Contents = styled.div`
  --contents-padding: 16px;
  --height: 120px;

  align-items: center;
  animation-duration: 0.15s;
  animation-iteration-count: 1;
  animation-name: ${enterFromBottom};
  animation-timing-function: ease-in;
  background-color: ${({ theme: { colors } }) => colors.darkestGray};
  bottom: 0;
  column-gap: 35px;
  display: flex;
  flex-grow: 0;
  height: var(--height);
  justify-content: space-between;
  left: 0;
  padding: var(--contents-padding);
  position: absolute;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --height: 210px;

    animation-duration: 0.35s;
    animation-name: ${enterFromTop};
    border-radius: 16px;
    bottom: auto;
    flex-direction: column;
    justify-content: center;
    left: 50%;
    max-width: 100%;
    row-gap: 32px;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 525px;
  }
`

const CloseButton = styled.button`
  --size: 31px;

  background-color: transparent;
  background-image: url('data:image/svg+xml;base64, PHN2ZyBmaWxsPSJub25lIiBoZWlnaHQ9IjMxIiB3aWR0aD0iMzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgZmlsbD0iIzAxOUQ4QiIgaGVpZ2h0PSIzMC4wNDYiIHJ4PSIxNS4wMjMiIHdpZHRoPSIzMC4wNDYiLz48cGF0aCBkPSJNMjEuNTMyIDIwLjIxNGwtMTEuNy0xMS43Yy0uMjg0LS4yODQtLjgxLS4yMTktMS4xNzMuMTQ1LS4zNjQuMzY0LS40MjkuODg5LS4xNDUgMS4xNzNsMTEuNyAxMS43Yy4yODQuMjg0LjgwOS4yMTkgMS4xNzMtLjE0NXMuNDI5LS44OS4xNDUtMS4xNzN6IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTkuODMzIDIxLjUzMmwxMS43LTExLjdjLjI4My0uMjg0LjIxOC0uODEtLjE0Ni0xLjE3My0uMzYzLS4zNjQtLjg4OS0uNDI5LTEuMTczLS4xNDVsLTExLjcgMTEuN2MtLjI4My4yODQtLjIxOC44MDkuMTQ2IDEuMTczLjM2My4zNjQuODg5LjQyOSAxLjE3My4xNDV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+');
  background-position: center;
  background-repeat: no-repeat;
  border: none;
  cursor: pointer;
  height: var(--size);
  padding: 0;
  position: absolute;
  right: var(--contents-padding);
  top: calc(var(--size) / -2);
  width: var(--size);

  &:active {
    opacity: 0.7;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    right: calc(var(--size) / -2);
    top: calc(var(--size) / -2);
  }
`

const TextWrapper = styled.div``

const Title = styled.h2`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.8rem;
    font-weight: 700;
    text-align: center;
  }
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 1.6rem;
    text-align: center;
  }
`

const RangeWrapper = styled.div`
  align-items: center;
  column-gap: 16px;
  display: grid;
  grid-template-columns: 1fr 20px;
  height: 44px;
  padding: 0 16px;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    background: ${({ theme: { colors } }) => colors.mainDark4};
    border-radius: 16px;
    margin: 0 auto;
    max-width: 100%;
    width: 350px;
  }
`

const RangeValue = styled.span`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.4rem;
  font-weight: 400;
  line-height: 1.2;
  text-align: right;
  text-wrap: nowrap;
`

const RangeSlider = ({
  max,
  min,
  onChange,
  value,
}: {
  max: number
  min: number
  onChange: (value: string) => void
  value: number
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    onChange(value)
  }

  return <Range max={max} min={min} onChange={handleChange} step={0.05} value={value} />
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeOnBackgroundClick?: boolean
  onClose: () => void
}

export const MinHealthConfigurationModal: React.FC<Props> = ({
  closeOnBackgroundClick = true,
  onClose,
  ...restProps
}) => {
  const [currentMSHF, setMSHF] = usePersistedState('minSafeHF', MIN_SAFE_HEALTH_FACTOR.toNumber())
  const parsedMSHF = currentMSHF ? currentMSHF / 1000 : MIN_SAFE_HEALTH_FACTOR.toNumber() / 1000
  const node = createRef<HTMLDivElement>()
  const [localMSHF, setLocalMSHF] = useState(parsedMSHF)

  const handleCloseAndSave = useCallback(() => {
    setMSHF(Number(localMSHF) * 1000)
    onClose()
  }, [localMSHF, onClose, setMSHF])

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        handleCloseAndSave()
      }
    }
    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [handleCloseAndSave])

  useEffect(() => {
    /**
     * Focus on the modal when it opens
     * this is to allow the user to close the modal with the escape key
     */
    if (node && node.current) {
      node.current.focus()
    }
  }, [node])

  return (
    <Modal>
      <Wrapper
        onClick={(e) => {
          e.stopPropagation()
          if (closeOnBackgroundClick) {
            handleCloseAndSave()
          }
        }}
        tabIndex={-1}
        {...restProps}
      >
        <Inner ref={node} tabIndex={-1}>
          <Contents
            onClick={(e) => {
              e.stopPropagation()
            }}
            role="dialog"
          >
            <CloseButton onClick={handleCloseAndSave} title="Close min health configuration" />
            <TextWrapper>
              <Title>Minimum Safe Health Factor</Title>
              <Text>Configuration</Text>
            </TextWrapper>
            <RangeWrapper>
              <RangeSlider
                max={5}
                min={1}
                onChange={(v) => {
                  if (Number(v) === 1) {
                    return setLocalMSHF(1.01) // set to 1.01 to avoid 1.0
                  }
                  setLocalMSHF(Number(v))
                }}
                value={localMSHF}
              />
              <RangeValue>{localMSHF < 1.05 ? 1 : localMSHF}</RangeValue>
            </RangeWrapper>
          </Contents>
        </Inner>
      </Wrapper>
    </Modal>
  )
}
