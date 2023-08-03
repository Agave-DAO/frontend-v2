import { useState } from 'react'

import { ToggleSwitch } from '@/src/components/form/ToggleSwitch'
import { useSetReserveAsCollateral } from '@/src/hooks/mutations/useSetReserveAsCollateral'
import { useAgaveTokens } from '@/src/providers/agaveTokensProvider'

export const AsCollateral: React.FC<{
  isActive: boolean
  assetAddress: string
}> = ({ assetAddress, isActive }) => {
  const [checked, setChecked] = useState(isActive)
  const [loading, setLoading] = useState(false)
  const setReserveAsCollateral = useSetReserveAsCollateral()

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

  return <ToggleSwitch checked={checked} disabled={loading} onChange={toggleSwitchHandler} />
}
