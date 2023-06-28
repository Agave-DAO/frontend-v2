import { ChangeEvent, HTMLAttributes, createRef, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  createUserHealthFactorAlerts,
  updateUserHealthFactorAlerts,
} from '@/src/apis/healthFactorAlerts'
import { Range } from '@/src/components/form/Range'
import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import Modal from '@/src/components/modals/BaseModal'
import { useUserHealthFactorAlerts } from '@/src/hooks/presentation/useUserHealthFactorAlerts'
import { useModalsContext } from '@/src/providers/modalsProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'

const Wrapper = styled.div`
  align-items: center;
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
  padding: 2rem;
`

const Contents = styled.div`
  --contents-padding: 16px;

  align-items: center;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem; // space between each form element
  color: ${({ theme: { colors } }) => colors.gray};
`

const Label = styled.label`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
`

const Input = styled.input<{ error?: boolean }>`
  padding: 0.5rem;
  border: 0px;
  border-radius: 5px;
  font-size: 1.4rem;
  background: ${({ theme: { colors } }) => colors.mainDark3};
  color: ${({ theme: { colors } }) => colors.gray};
  border: ${({ error }) => (error ? '1px solid red' : '0px')};
`

const TextWrapper = styled.div``

const SaveButton = styled.button<{ isSaving: boolean }>`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;
  --padding: 12px;

  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme: { colors } }) => colors.mainDark1};
  color: ${({ theme: { colors } }) => colors.textColor};
  border-radius: var(--border-radius);
  font-size: var(--font-size);
  height: var(--height);
  padding-left: var(--padding);
  padding-right: var(--padding);
  width: fit-content;
  border: 0;
  cursor: ${({ isSaving }) => (isSaving ? 'not-allowed' : 'pointer')};
  opacity: ${({ isSaving }) => (isSaving ? 0.3 : 1)};
  transition: opacity 0.1s ${({ isSaving }) => (isSaving ? 'none' : 'ease-in-out')};

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    --border-radius: 30px;
    --font-size: 1.6rem;
    --height: 46px;
    --padding: 16px;
    width: 150px;
  }
`

const Title = styled.h2`
  color: ${({ theme: { colors } }) => colors.textColor};
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
`

const Text = styled.p`
  color: ${({ theme: { colors } }) => colors.gray};
  font-size: 1.6rem;
  font-weight: 400;
  text-align: center;
`

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme: { colors } }) => colors.mainDark4};
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`

const RangeWrapper = styled.div`
  align-items: center;
  column-gap: 16px;
  display: grid;
  grid-template-columns: 1fr 20px;
  height: 24px;

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

  return <Range max={max} min={min} onChange={handleChange} step={0.1} value={value} />
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  closeOnBackgroundClick?: boolean
  onClose: () => void
}

export const HealthFactorAlertsModal: React.FC<Props> = ({
  closeOnBackgroundClick = true,
  onClose,
}) => {
  const node = createRef<HTMLDivElement>()
  const { address: userAddress } = useWeb3ConnectedApp()
  const {
    HFAlertEmail,
    HFAlertId,
    HFAlertThreshold,
    isHFAlertAgentListed,
    isHFAlertEnabled,
    setHFAlertEmail,
    setHFAlertId,
    setHFAlertThreshold,
    setIsHFAlertEnabled,
    setisHFAlertAgentListed,
  } = useModalsContext()
  const [localIsHFAlertEnabled, setLocalIsHFAlertEnabled] = useState(isHFAlertEnabled)
  const [localHFAlertEmail, setLocalHFAlertEmail] = useState(HFAlertEmail)
  const [localHFAlertThreshold, setLocalHFAlertThreshold] = useState(HFAlertThreshold)
  const [formChanged, setFormChanged] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(true)
  const emailValidation = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const { data, error, isLoading } = useUserHealthFactorAlerts(userAddress)

  const saveChanges = useCallback(async () => {
    if (emailValidation(localHFAlertEmail)) {
      setIsSaving(true)
      setIsEmailValid(true)
      try {
        if (!isHFAlertAgentListed) {
          await createUserHealthFactorAlerts(
            userAddress,
            localHFAlertThreshold,
            localHFAlertEmail,
            localIsHFAlertEnabled,
          )
        } else {
          await updateUserHealthFactorAlerts(
            HFAlertId,
            userAddress,
            localHFAlertThreshold,
            localHFAlertEmail,
            localIsHFAlertEnabled,
          )
        }
        setIsHFAlertEnabled(localIsHFAlertEnabled)
        setHFAlertEmail(localHFAlertEmail)
        setHFAlertThreshold(localHFAlertThreshold)
        setFormChanged(false)
        setIsSaving(false)
        onClose()
      } catch (error) {
        console.error("An error occured. Alerts can't be updated.")
      }
    } else {
      setIsEmailValid(false)
      console.error('Invalid email format.')
    }
  }, [
    localHFAlertThreshold,
    localHFAlertEmail,
    localIsHFAlertEnabled,
    isHFAlertAgentListed,
    userAddress,
    HFAlertId,
    setHFAlertEmail,
    setHFAlertThreshold,
    setIsHFAlertEnabled,
    onClose,
  ])

  useEffect(() => {
    const close = (e: { key: string }) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keyup', close)

    return () => window.removeEventListener('keyup', close)
  }, [onClose])

  useEffect(() => {
    if (node && node.current) {
      node.current.focus()
    }
  }, [node])

  useEffect(() => {
    if (data) {
      setLocalHFAlertEmail(data.email)
      setLocalHFAlertThreshold(data.threshold)
      setLocalIsHFAlertEnabled(data.isReminderEnabled)
      setisHFAlertAgentListed(data.isAgentListed)
      setHFAlertId(data.id)
    }
  }, [data, setHFAlertId, setisHFAlertAgentListed])

  if (isLoading || error) {
    if (error) {
      console.error(`An error occurred: {error.message}`)
    }
    return (
      <Modal>
        <Wrapper>
          <Contents style={{ width: '180px' }}>Loading...</Contents>
        </Wrapper>
      </Modal>
    )
  }

  return (
    <Modal>
      <Wrapper
        onClick={(e) => {
          e.stopPropagation()
          if (closeOnBackgroundClick) {
            onClose()
          }
        }}
        tabIndex={-1}
      >
        <Inner ref={node} tabIndex={-1}>
          <Contents
            onClick={(e) => {
              e.stopPropagation()
            }}
            role="dialog"
          >
            <CloseButton onClick={onClose} title="Close health factor alerts configuration" />
            <TextWrapper>
              <Title>Health Factor Alerts</Title>
              <Text>Configuration</Text>
            </TextWrapper>

            <Form>
              <Tile>
                <Label>E-mail address</Label>
                <Input
                  error={!isEmailValid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLocalHFAlertEmail(e.target.value)
                    setFormChanged(true)
                    setIsEmailValid(true)
                  }}
                  type="email"
                  value={localHFAlertEmail}
                />
              </Tile>

              <Tile>
                <Label>Threshold</Label>
                <RangeWrapper>
                  <RangeSlider
                    max={10}
                    min={0}
                    onChange={(value: string) => {
                      setLocalHFAlertThreshold(parseFloat(value))
                      setFormChanged(true)
                    }}
                    value={localHFAlertThreshold ?? 0}
                  />
                  <RangeValue>{localHFAlertThreshold}</RangeValue>
                </RangeWrapper>
              </Tile>

              <Tile>
                <Label>Enable alerts</Label>
                <ToggleSwitch
                  checked={localIsHFAlertEnabled}
                  onChange={() => {
                    setLocalIsHFAlertEnabled(!localIsHFAlertEnabled)
                    setFormChanged(true)
                  }}
                />
              </Tile>
            </Form>

            <SaveButton
              disabled={!formChanged || isSaving}
              isSaving={isSaving}
              onClick={saveChanges}
            >
              {isSaving ? 'Saving...' : 'Save changes'}
            </SaveButton>
          </Contents>
        </Inner>
      </Wrapper>
    </Modal>
  )
}
