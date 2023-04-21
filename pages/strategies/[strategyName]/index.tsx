import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { useVaultModalContext } from '@/src/providers/vaultModalProvider'

const Strategy: NextPage = () => {
  const router = useRouter()
  const { strategyName } = router.query
  const { openCreateVaultModal } = useVaultModalContext()

  return (
    <>
      <p>Vault name: Vault {strategyName}</p>
      <p>
        <button onClick={() => openCreateVaultModal('0x12345678901234567890')}>Edit vault</button>
      </p>
    </>
  )
}

export default Strategy
