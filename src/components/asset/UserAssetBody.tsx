import { HTMLAttributes } from 'react'

import { Body } from '@/src/components/asset/Asset'

export const UserAssetBody: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...restProps
}) => {
  return <Body {...restProps}>{children}</Body>
}
