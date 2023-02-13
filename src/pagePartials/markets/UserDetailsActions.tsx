import { useRouter } from 'next/router'

import { Button, ButtonDropdown, ButtonPrimary } from '@/src/components/buttons/Button'
import { Dropdown, DropdownItem } from '@/src/components/common/Dropdown'
import { SimpleGrid } from '@/src/components/layout/SimpleGrid'

type UserAction = {
  label: string
  target: (tokenAddress: string) => string
}

export type UserActions = {
  primary: UserAction
  secondary?: UserAction
  grouped?: UserAction[]
}

export function UserDetailsActions({
  grouped,
  primary,
  secondary,
  tokenAddress,
}: UserActions & {
  tokenAddress: string
}) {
  const router = useRouter()

  return (
    <SimpleGrid>
      {grouped && (
        <Dropdown
          dropdownButton={<ButtonDropdown>More actions</ButtonDropdown>}
          items={grouped.map((action) => (
            <DropdownItem
              key={action.label}
              onClick={() => router.push(action.target(tokenAddress))}
            >
              {action.label}
            </DropdownItem>
          ))}
        />
      )}

      {secondary && (
        <Button onClick={() => router.push(secondary.target(tokenAddress))}>
          {secondary.label}
        </Button>
      )}

      <ButtonPrimary onClick={() => router.push(primary.target(tokenAddress))}>
        {primary.label}
      </ButtonPrimary>
    </SimpleGrid>
  )
}
