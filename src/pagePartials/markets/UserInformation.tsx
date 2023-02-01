import { BaseCard } from '@/src/components/common/BaseCard'
import { RequiredConnection } from '@/src/components/helpers/RequiredConnection'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { UserBorrowDetails } from '@/src/pagePartials/markets/UserBorrowDetails'
import { UserDepositDetails } from '@/src/pagePartials/markets/UserDepositDetails'

export function UserInformation({ tokenAddress }: { tokenAddress: string }) {
  return (
    <BaseCard>
      <BaseTitle>My information</BaseTitle>
      <RequiredConnection isNotConnectedText="Connect wallet to see your information on the current market">
        <>
          <UserDepositDetails tokenAddress={tokenAddress} />
          <UserBorrowDetails tokenAddress={tokenAddress} />
        </>
      </RequiredConnection>
    </BaseCard>
  )
}
