import { useState } from 'react'

import { BigNumber } from 'ethers'

import { ButtonPrimary } from '@/src/components/buttons/Button'
import { BaseCard } from '@/src/components/common/BaseCard'
import { Formfield } from '@/src/components/form/Formfield'
import { TextfieldStatus } from '@/src/components/form/Textfield'
import { Amount } from '@/src/components/helpers/Amount'
import { withGenericSuspense } from '@/src/components/helpers/SafeSuspense'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'
import { TokenIcon } from '@/src/components/token/TokenIcon'
import { TokenInput } from '@/src/components/token/TokenInput'
import { ZERO_BN } from '@/src/constants/bigNumber'
import { useStakeInformation } from '@/src/hooks/presentation/useStakeInformation'

export const UserStakeActionCard = withGenericSuspense(() => {
  const { amountAvailableToStake: userAmountAvailableToStake } = useStakeInformation()
  const [tokenInputStatus, setTokenInputStatus] = useState<TextfieldStatus>()
  const [tokenInputStatusText, setTokenInputStatusText] = useState<string | undefined>()
  const [value, setValue] = useState('0')

  const disableSubmit =
    tokenInputStatus === TextfieldStatus.error || BigNumber.from(value || ZERO_BN).eq(ZERO_BN)

  const onClickMax = () => {
    setValue(userAmountAvailableToStake.toString())
  }

  // TODO add stake action in this component
  return (
    <BaseCard>
      <SimpleGrid>
        <p>Amount to stake:</p>
        <ButtonPrimary onClick={onClickMax}>Use Max</ButtonPrimary>
      </SimpleGrid>
      <SimpleGrid>
        <p>available to stake:</p>
        <h2>
          <Amount
            decimals={18}
            displayDecimals={2}
            symbol="AGVE"
            symbolPosition="after"
            value={userAmountAvailableToStake}
          />
        </h2>
      </SimpleGrid>

      <Formfield
        formControl={
          <TokenInput
            balancePosition="none"
            decimals={18}
            displayMaxButton={false}
            maxValue={userAmountAvailableToStake.toString()}
            setStatus={setTokenInputStatus}
            setStatusText={setTokenInputStatusText}
            setValue={setValue}
            symbol={'AGVE'}
            value={value}
          />
        }
        status={tokenInputStatus}
        statusText={tokenInputStatusText}
      />
      <br />
      <ButtonPrimary disabled={disableSubmit}>Stake</ButtonPrimary>
    </BaseCard>
  )
})
