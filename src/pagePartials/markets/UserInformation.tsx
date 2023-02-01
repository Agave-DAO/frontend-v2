import { BaseCard } from '@/src/components/common/BaseCard'
import { BaseTitle } from '@/src/components/text/BaseTitle'
import { RequiredConnection } from '@/src/hooks/requiredConnection'
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
