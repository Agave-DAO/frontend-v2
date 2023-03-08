import { useState } from 'react'

import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import { agaveTokens } from '@/src/config/agaveTokens'
import { useSetReserveAsCollateral } from '@/src/hooks/mutations/useSetReserveAsCollateral'

export const AsCollateral: React.FC<{
  isActive: boolean
  assetAddress: string
}> = ({ assetAddress, isActive }) => {
  const [checked, setChecked] = useState(isActive)
  const [loading, setLoading] = useState(false)
  const setReserveAsCollateral = useSetReserveAsCollateral()

  // Checking if the asset is WXDAI. If it is, then it's always collateral and the user can't change it.
  const isAlwaysCollateral = agaveTokens.getTokenByAddress(assetAddress).symbol === 'WXDAI'

  const toggleSwitchHandler = async () => {
    setChecked(!checked)
    setLoading(true)

    try {
      const tx = await setReserveAsCollateral(assetAddress, !checked)
      await tx.wait()
      setLoading(false)
    } catch (error) {
      console.error(error)
      setChecked(checked)
      setLoading(false)
    }
  }

  return (
    <ToggleSwitch
      checked={isAlwaysCollateral ? true : checked}
      disabled={isAlwaysCollateral || loading}
      onChange={toggleSwitchHandler}
    />
  )
}
