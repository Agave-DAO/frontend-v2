import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { hash } from '@stablelib/sha256'
import * as u8a from 'uint8arrays'

import {
  getUserHealthFactorAlerts,
  updateUserHealthFactorAlerts,
} from '@/src/apis/healthFactorAlerts'
import { Alert } from '@/src/components/assets/Alert'
import { FeedbackBanner } from '@/src/components/common/FeedbackBanner'
import { GenericError } from '@/src/components/common/GenericError'
import { Range } from '@/src/components/form/Range'
import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SkeletonLoading } from '@/src/components/loading/SkeletonLoading'
import { Tooltip } from '@/src/components/tooltip/Tooltip'
import { useUserAccountDetails } from '@/src/hooks/presentation/useUserAccountDetails'
import { HealthFactorAlerts as HealthFactorAlertsTooltip } from '@/src/pagePartials/common/tooltips'
import { useUserActionsContext } from '@/src/providers/userActionsProvider'
import { useWeb3ConnectedApp } from '@/src/providers/web3ConnectionProvider'
import { fromWei } from '@/src/utils/common'
import { FeedbackTypes } from '@/types/feedback'

const Wrapper = styled.section``

const SectionPart = styled.div<{ isTop?: boolean }>`
  align-items: center;
  border-radius: ${(props) => (props.isTop ? '16px 16px 0 0' : '0 0  16px 16px')};
  background-color: ${(props) =>
    props.isTop ? 'rgba(1, 157, 139, 0.1)' : 'rgba(1, 157, 139, 0.05)'};
  column-gap: 16px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  column-gap: 16px;
  display: flex;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletLandscapeStart}) {
    padding: 24px;
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
`

const Label = styled.label`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
`

const Input = styled.input<{ error?: boolean }>`
  padding: 1rem;
  border: 0px;
  border-radius: 10px;
  font-size: 1.6rem;
  background-color: #122c34;
  color: ${({ error, theme: { colors } }) => (error ? '#dd6666' : colors.gray)};
`

const ActionButton = styled.button<{ inAction?: boolean }>`
  --border-radius: 20px;
  --font-size: 1.4rem;
  --height: 36px;
  --padding: 12px;

  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background-color: ${({ theme: { colors } }) => colors.mainDark1};
  color: ${({ theme: { colors } }) => colors.textColor};
  border-radius: var(--border-radius);
  font-size: var(--font-size);
  height: var(--height);
  min-height: 30px;
  margin: 15px auto;
  padding-left: var(--padding);
  padding-right: var(--padding);
  width: fit-content;
  border: 0;
  cursor: ${({ inAction }) => (inAction ? 'not-allowed' : 'pointer')};
  opacity: ${({ inAction }) => (inAction ? 0.3 : 1)};
  transition: opacity 0.1s ${({ inAction }) => (inAction ? 'none' : 'ease-in-out')};

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
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    font-size: 2.4rem;
  }
`

const TooltipIcon: React.FC = ({ ...restProps }) => (
  <svg
    fill="none"
    height="25"
    viewBox="0 0 24 25"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
    {...restProps}
  >
    <rect fill="#122C34" height="24" rx="12" width="24" y="0.5" />
    <path
      d="M12.008 7.40778C10.6471 7.40778 9.76563 7.96536 9.0736 8.95975C8.94806 9.14014 8.98677 9.38746 9.16188 9.52025L9.89738 10.0779C10.0742 10.212 10.3259 10.1807 10.4643 10.0072C10.8914 9.47216 11.2082 9.16411 11.8753 9.16411C12.3998 9.16411 13.0486 9.50168 13.0486 10.0103C13.0486 10.3948 12.7312 10.5923 12.2133 10.8826C11.6093 11.2213 10.8101 11.6427 10.8101 12.6968V12.8637C10.8101 13.0897 10.9933 13.2729 11.2193 13.2729H12.4549C12.6809 13.2729 12.8641 13.0897 12.8641 12.8637V12.7653C12.8641 12.0345 14.9999 12.0041 14.9999 10.0266C14.9999 8.53743 13.4552 7.40778 12.008 7.40778ZM11.8371 15.2301C11.1859 15.2301 10.6561 15.76 10.6561 16.4112C10.6561 17.0624 11.1859 17.5922 11.8371 17.5922C12.4884 17.5922 13.0182 17.0624 13.0182 16.4112C13.0182 15.7599 12.4884 15.2301 11.8371 15.2301Z"
      fill="#048478"
    />
  </svg>
)

const Tile = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: 10px;
`

const RangeWrapper = styled.div`
  align-items: center;
  column-gap: 16px;
  display: grid;
  grid-template-columns: 1fr 50px;
  height: 24px;
  width: 100%;

  @media (min-width: ${({ theme: { breakPoints } }) => breakPoints.tabletPortraitStart}) {
    border-radius: 16px;
    margin: 0 auto;
  }
`

const RangeValue = styled.span`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.2;
  text-align: center;
  padding: 2px;
  background-color: ${({ theme: { colors } }) => colors.mainDark3};
  border-radius: 10px;
`

const GenericMessage = styled(GenericError)`
  margin: 15px auto 30px;
  order: var(--list-presentation-order);
  background: transparent;
  padding: 0;
  text-align: center;
`
const Feedback = styled(FeedbackBanner)``

const NotSigned = styled.div`
  width: 100%;
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

const HFAlertsDetails: React.FC = () => {
  const { address, web3Provider } = useWeb3ConnectedApp()
  const {
    alertsData,
    setAlertsData,
    setViewHFAlertsSignature,
    setViewHFAlertsUser,
    viewHFAlertsSignature,
    viewHFAlertsUser,
  } = useUserActionsContext()

  const [changeCount, setChangeCount] = useState(0)
  const [isViewAllowed, setIsViewAllowed] = useState(false)
  const [isViewLoading, setIsViewLoading] = useState(false)
  const [criticalError, setCriticalError] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [updateSignature, setUpdateSignature] = useState<string | null>(null)
  const [viewSignatureMessage, setViewSignatureMessage] = useState('')
  const [updateSignatureMessage, setUpdateSignatureMessage] = useState('')

  const [feedbackTitle, setFeedbackTitle] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [feedbackType, setFeedbackType] = useState<FeedbackTypes>('')

  const [threshold, setThreshold] = useState(1)
  const [isEnabled, setIsEnabled] = useState(true)
  const [email, setEmail] = useState('')

  const [isEmailValid, setIsEmailValid] = useState(true)
  const emailValidation = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const calculateNonce = (email: string, threshold: number, state: boolean, timestamp: number) => {
    const data = email + threshold.toString() + state.toString() + timestamp.toString()
    const hashedData = hash(u8a.fromString(data))
    const hexHash = u8a.toString(hashedData, 'base16')
    return hexHash.slice(0, 6)
  }

  const feedback = useCallback(
    (title = '', text = '', type: FeedbackTypes = '') => {
      setFeedbackTitle(title)
      setFeedbackText(text)
      setFeedbackType(type)
    },
    [setFeedbackTitle, setFeedbackText, setFeedbackType],
  )

  const formChanged = useCallback(() => {
    setChangeCount((prevCount) => prevCount + 1)
    feedback()
  }, [setChangeCount, feedback])

  const updateUserAlerts = useCallback(async () => {
    if (!isSaving || !updateSignature || !updateSignatureMessage) return
    try {
      const data = await updateUserHealthFactorAlerts(
        address,
        updateSignature,
        updateSignatureMessage,
        threshold,
        email,
        isEnabled,
      )
      formChanged()
      feedback('Success', 'Alerts have been updated successfully', 'success')
      setAlertsData(data)
    } catch (err) {
      console.error("An error occurred. Alerts can't be updated.", err)
      feedback('An error occurred', 'Alerts could not be updated', 'error')
    }
  }, [
    address,
    isSaving,
    updateSignature,
    updateSignatureMessage,
    threshold,
    email,
    isEnabled,
    formChanged,
    feedback,
    setAlertsData,
  ])

  const getUserAlerts = useCallback(async () => {
    if (!isInitializing || !viewHFAlertsSignature || !viewSignatureMessage) return
    try {
      const data = await getUserHealthFactorAlerts(
        address,
        viewHFAlertsSignature,
        viewSignatureMessage,
      )
      setAlertsData(data)
      setIsViewLoading(false)
    } catch (err) {
      setCriticalError("An error occurred. Alerts can't be displayed.")
    } finally {
      setIsViewLoading(false)
    }
  }, [
    address,
    isInitializing,
    viewHFAlertsSignature,
    viewSignatureMessage,
    setAlertsData,
    setIsViewLoading,
  ])

  const signViewMessage = async () => {
    feedback()
    if (!web3Provider) return
    setIsSigning(true)
    try {
      const signer = web3Provider.getSigner()
      const timestamp = Date.now()
      const sigMsg = `View my HF alert details\n\n[TS:${timestamp}]`
      setViewSignatureMessage(sigMsg)
      const signature = await signer.signMessage(sigMsg)
      setViewHFAlertsSignature(signature)
      setViewHFAlertsUser(address)
      setIsInitializing(true)
    } catch (err) {
      setIsSigning(false)
      setViewHFAlertsUser(null)
      feedback('Signature failed', 'You need a valid signature to view the details', 'error')
    }
  }

  const signUpdateMessage = async () => {
    feedback()
    if (!isEmailValid || !web3Provider) {
      feedback('Invalid email', 'Please provide a valid email', 'error')
      return
    }
    setIsSigning(true)
    try {
      const signer = web3Provider.getSigner()
      const timestamp = Date.now()
      const nonce = calculateNonce(email, threshold, isEnabled, timestamp)
      const sigMsg = `Update my HF alert details\n\n[TS:${timestamp}][NONCE:${nonce}]`
      setUpdateSignatureMessage(sigMsg)
      const signature = await signer.signMessage(sigMsg)
      setUpdateSignature(signature)
      setIsSigning(false)
      setIsSaving(true)
    } catch (err) {
      setIsSigning(false)
      feedback('Signature failed', 'Changes have not been saved', 'error')
    }
  }

  useEffect(() => {
    if (address !== viewHFAlertsUser) {
      setViewHFAlertsSignature(null)
      feedback()
      setAlertsData(null)
      setViewHFAlertsUser(null)
    }
  }, [
    address,
    setViewHFAlertsSignature,
    feedback,
    setAlertsData,
    setViewHFAlertsUser,
    viewHFAlertsUser,
  ])

  useEffect(() => {
    if (alertsData) {
      setEmail(alertsData.email)
      setThreshold(alertsData.threshold)
      setIsEnabled(alertsData.isEnabled)
    }
  }, [alertsData])

  useEffect(() => {
    const handleIsViewAllowed = async () => {
      if (!address || !web3Provider || viewHFAlertsUser != address || isInitializing) {
        setIsViewAllowed(false)
        return
      }
      setIsViewAllowed(true)
    }
    handleIsViewAllowed()
  }, [address, viewHFAlertsUser, web3Provider, isInitializing])

  useEffect(() => {
    if (!isSaving) return
    updateUserAlerts().then(() => {
      setIsSaving(false)
    })
  }, [updateUserAlerts, isSaving])

  useEffect(() => {
    if (!isInitializing) return
    getUserAlerts().then(() => {
      setIsInitializing(false)
      setIsSigning(false)
    })
  }, [getUserAlerts, isInitializing])

  if (criticalError) {
    return (
      <NotSigned>
        <GenericMessage icon={<Alert />} text={criticalError} title="Error" />
      </NotSigned>
    )
  }

  if (!isViewAllowed) {
    return (
      <NotSigned>
        {feedbackText ? (
          <Feedback text={feedbackText} title={feedbackTitle} type={feedbackType} />
        ) : (
          ''
        )}
        <GenericMessage
          icon={<></>}
          text="Sign a message to access your HF alert details"
          title=""
        />
        <ActionButton disabled={isSigning} inAction={isSigning} onClick={signViewMessage}>
          {isSigning ? 'Signing...' : 'Sign message'}
        </ActionButton>
      </NotSigned>
    )
  }

  if (isViewLoading) {
    return (
      <NotSigned>
        <GenericMessage icon={<></>} text="Loading your HF alert details" title="Loading..." />
      </NotSigned>
    )
  }

  return (
    <Form>
      {feedbackText ? (
        <Feedback text={feedbackText} title={feedbackTitle} type={feedbackType} />
      ) : (
        ''
      )}
      <Tile>
        <Label>E-mail address</Label>
        <Input
          error={!isEmailValid}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newEmail = e.target.value
            setEmail(newEmail)
            setIsEmailValid(emailValidation(newEmail))
            formChanged()
          }}
          type="email"
          value={email}
        />
      </Tile>

      <Tile>
        <Label>Threshold</Label>
        <RangeWrapper>
          <RangeSlider
            max={10}
            min={1}
            onChange={(value: string) => {
              setThreshold(parseFloat(value))
              formChanged()
            }}
            value={threshold >= 1 ? threshold : 1.5}
          />
          <RangeValue>{threshold >= 1 ? threshold : 1.5}</RangeValue>
        </RangeWrapper>
      </Tile>

      <Tile>
        <Label>Enable alerts</Label>
        <ToggleSwitch
          checked={isEnabled}
          onChange={() => {
            setIsEnabled(!isEnabled)
            formChanged()
          }}
        />
      </Tile>

      <ActionButton
        disabled={!changeCount || isSaving || isSigning || !isEmailValid}
        inAction={isSaving || isSigning}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          signUpdateMessage()
        }}
      >
        {isSigning ? 'Signing...' : isSaving ? 'Saving...' : 'Save changes'}
      </ActionButton>
    </Form>
  )
}

export const HFAlerts: React.FC = withGenericSuspense(
  ({ ...restProps }) => {
    const { address } = useWeb3ConnectedApp()
    const [displayHFAlerts, setDisplayHFAlerts] = useState(false)
    const { userBorrows } = useUserAccountDetails(address)
    const minBorrowsForHFAlerts = BigNumber.from(100)
    useEffect(() => {
      setDisplayHFAlerts(fromWei(userBorrows, 18).gte(minBorrowsForHFAlerts))
    }, [userBorrows, minBorrowsForHFAlerts])

    if (!displayHFAlerts) return <></>
    return (
      <Wrapper>
        <SectionPart isTop {...restProps}>
          <Title>
            HF alerts
            <Tooltip content={HealthFactorAlertsTooltip} style={{ marginLeft: '10px' }}>
              <TooltipIcon />
            </Tooltip>
          </Title>
        </SectionPart>
        <SectionPart>
          <HFAlertsDetails />
        </SectionPart>
      </Wrapper>
    )
  },
  () => <SkeletonLoading style={{ height: '118px' }} />,
)
