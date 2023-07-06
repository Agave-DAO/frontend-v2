import { useCallback } from 'react'

import { useGetUserVaults } from '@/src/hooks/queries/useGetUserVaults'

/**
 * This function returns an object containing a user's vault list and a function to create a new vault.
 * @returns The `useVaults` custom hook is returning an object with two properties: `vaultList` and
 * `createVault`. The `vaultList` property is obtained from the `useGetUserVaults` hook, and the
 * `createVault` property is obtained from the `useCreateNewVault` hook.
 */
export const useVaults = () => {
  const { refetchUserVaults, vaultList } = useGetUserVaults()

  /* `const vaultNameExists` is a function that checks if a given `vaultName` already exists in the
  `vaultList` array obtained from the `useGetUserVaults` */
  const vaultNameExists = useCallback(
    (vaultName: string) =>
      vaultList?.some((vault) => vault.name.toLowerCase() === vaultName.toLowerCase()),
    [vaultList],
  )

  return { vaultList, refetchUserVaults, vaultNameExists }
}
