import { HTMLAttributes } from 'react'

import { Asset } from '@/src/components/asset/Asset'
import { UserAssetBody } from '@/src/components/asset/UserAssetBody'
import { UserAssetHead, Props as UserAssetHeadProps } from '@/src/components/asset/UserAssetHead'

interface Props extends UserAssetHeadProps, HTMLAttributes<HTMLDivElement> {}

export const UserAsset: React.FC<Props> = ({ children, ...restProps }) => {
  return (
    <Asset>
      <UserAssetHead {...restProps} />
      <UserAssetBody>{children}</UserAssetBody>
    </Asset>
  )
}
